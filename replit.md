# SocialBlaster - Social Media Management Platform

## Overview

This is a full-stack web application for managing and publishing content across multiple social media platforms. The application allows users to create posts, upload media files, and publish them simultaneously to various platforms like Twitter, Facebook, YouTube, TikTok, and others. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Uploads**: Multer for handling media uploads
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API endpoints

### Database Schema
- **users**: User authentication and profile data
- **posts**: Content, platform targeting, and scheduling information
- **postResults**: Individual platform posting results and status tracking

## Key Components

### Core Features
1. **Multi-Platform Publishing**: Simultaneous posting to 8+ social media platforms
2. **Media Upload**: Support for images and videos with file validation
3. **Content Scheduling**: Ability to schedule posts for future publication
4. **Real-time Status Tracking**: Live updates on posting progress across platforms
5. **Platform-Specific Previews**: Visual previews showing how content appears on different platforms

### Frontend Components
- **PlatformSelector**: Interactive platform selection with visual indicators
- **PostComposer**: Rich content editor with media upload and scheduling
- **PlatformPreviews**: Platform-specific content previews
- **PostingStatus**: Real-time posting progress tracking

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **File Upload Handler**: Secure media file processing and validation
- **Social Media Integration**: Mock API integrations with realistic response simulation

## Data Flow

1. **Content Creation**: User composes content and selects target platforms
2. **Media Processing**: Files are uploaded and validated server-side
3. **Post Scheduling**: Content is stored with platform-specific metadata
4. **Publishing Workflow**: Asynchronous posting to multiple platforms
5. **Status Monitoring**: Real-time updates on posting success/failure per platform

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for cloud database hosting
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Development**: Vite with React plugin and error overlay

### API Integrations
- Mock social media APIs simulating real platform integrations
- File storage system for uploaded media assets
- Session management for user authentication

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- Express server with TypeScript compilation via tsx
- Database migrations managed through Drizzle Kit
- Environment-specific configuration through .env files

### Production Build
- Vite production build outputting to dist/public
- Express server bundled with esbuild for Node.js
- Static file serving through Express middleware
- Database schema deployment via Drizzle migrations

### Architecture Decisions

**Problem**: Multi-platform social media management
**Solution**: Unified interface with platform-specific adapters and real-time status tracking
**Rationale**: Simplifies workflow while maintaining platform-specific optimizations

**Problem**: Real-time posting status updates
**Solution**: Polling-based query refresh with React Query
**Rationale**: Simple implementation that works reliably across different network conditions

**Problem**: File upload handling
**Solution**: Multer with local storage and validation middleware
**Rationale**: Secure file handling with type validation and size limits

**Problem**: Database abstraction
**Solution**: Storage interface pattern with multiple implementations
**Rationale**: Enables easy testing and potential database migration

## Changelog
- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.