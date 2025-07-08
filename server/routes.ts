import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertPostResultSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  },
});

// Mock social media API posting function
async function postToSocialMedia(platform: string, content: string, mediaUrls?: string[]): Promise<{ success: boolean; message: string; externalId?: string }> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Simulate different success rates for different platforms
  const successRates: Record<string, number> = {
    facebook: 0.95,
    twitter: 0.90,
    youtube: 0.85,
    tiktok: 0.88,
    pinterest: 0.92,
    threads: 0.90,
    snapchat: 0.87,
    whatsapp: 0.93
  };
  
  const successRate = successRates[platform] || 0.85;
  const isSuccess = Math.random() < successRate;
  
  if (isSuccess) {
    return {
      success: true,
      message: `Successfully posted to ${platform}`,
      externalId: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    return {
      success: false,
      message: `Failed to post to ${platform}: API rate limit exceeded`
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl, originalName: req.file.originalname, size: req.file.size });
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  // Create a new post
  app.post("/api/posts", async (req, res) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      // For now, use a mock user ID
      const userId = 1;
      
      const post = await storage.createPost({ ...validatedData, userId });
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Get user posts
  app.get("/api/posts", async (req, res) => {
    try {
      // For now, use a mock user ID
      const userId = 1;
      const posts = await storage.getUserPosts(userId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get a specific post
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Publish a post to social media platforms
  app.post("/api/posts/:id/publish", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      await storage.updatePostStatus(postId, "posting");
      
      const platforms = post.platforms as string[];
      const mediaUrls = post.mediaUrls as string[] || [];
      
      // Create initial post results for each platform
      const postResults = await Promise.all(
        platforms.map(platform =>
          storage.createPostResult({
            postId,
            platform,
            status: "pending",
            message: "Publishing in progress..."
          })
        )
      );
      
      // Start publishing to each platform (don't await - let it run in background)
      Promise.all(
        postResults.map(async (result) => {
          try {
            const apiResult = await postToSocialMedia(result.platform, post.content, mediaUrls);
            await storage.updatePostResult(
              result.id,
              apiResult.success ? "success" : "failed",
              apiResult.message,
              apiResult.externalId
            );
          } catch (error) {
            await storage.updatePostResult(
              result.id,
              "failed",
              `Failed to post to ${result.platform}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        })
      ).then(async () => {
        // Update post status when all platforms are done
        const finalResults = await storage.getPostResults(postId);
        const allCompleted = finalResults.every(r => r.status !== "pending");
        if (allCompleted) {
          await storage.updatePostStatus(postId, "completed");
        }
      });
      
      res.json({ message: "Publishing started", results: postResults });
    } catch (error) {
      res.status(500).json({ message: "Failed to start publishing" });
    }
  });

  // Get post results (publishing status)
  app.get("/api/posts/:id/results", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const results = await storage.getPostResults(postId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
