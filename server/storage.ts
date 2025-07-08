import { users, posts, postResults, type User, type InsertUser, type Post, type InsertPost, type PostResult, type InsertPostResult } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  createPost(post: InsertPost & { userId: number }): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getUserPosts(userId: number): Promise<Post[]>;
  updatePostStatus(id: number, status: string): Promise<void>;
  
  // Post result methods
  createPostResult(result: InsertPostResult): Promise<PostResult>;
  getPostResults(postId: number): Promise<PostResult[]>;
  updatePostResult(id: number, status: string, message?: string, externalId?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private postResults: Map<number, PostResult>;
  private currentUserId: number;
  private currentPostId: number;
  private currentPostResultId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.postResults = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentPostResultId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPost(insertPost: InsertPost & { userId: number }): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
      ...insertPost,
      id,
      createdAt: new Date(),
      status: "draft",
      mediaUrls: insertPost.mediaUrls || null
    };
    this.posts.set(id, post);
    return post;
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.userId === userId);
  }

  async updatePostStatus(id: number, status: string): Promise<void> {
    const post = this.posts.get(id);
    if (post) {
      this.posts.set(id, { ...post, status });
    }
  }

  async createPostResult(insertResult: InsertPostResult): Promise<PostResult> {
    const id = this.currentPostResultId++;
    const result: PostResult = {
      ...insertResult,
      id,
      postedAt: null,
      message: insertResult.message || null,
      externalId: insertResult.externalId || null
    };
    this.postResults.set(id, result);
    return result;
  }

  async getPostResults(postId: number): Promise<PostResult[]> {
    return Array.from(this.postResults.values()).filter(result => result.postId === postId);
  }

  async updatePostResult(id: number, status: string, message?: string, externalId?: string): Promise<void> {
    const result = this.postResults.get(id);
    if (result) {
      this.postResults.set(id, {
        ...result,
        status,
        message: message || result.message,
        externalId: externalId || result.externalId,
        postedAt: status === "success" ? new Date() : result.postedAt
      });
    }
  }
}

export const storage = new MemStorage();
