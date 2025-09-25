# Podcast Production Studio

![App Preview](https://imgix.cosmicjs.com/2a864510-9a27-11f0-a9ab-e96a06d60994-photo-1589254065878-42c9da997008-1758815345086.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive podcast production platform that enables seamless recording, editing, and publishing workflows. Built for teams and solo creators who need professional-grade podcast management tools with collaborative recording capabilities.

## ✨ Features

- **Multi-User Recording Sessions** - Collaborative remote recording with real-time participant management
- **Advanced Audio Editing** - Visual audio timeline with clip management and mixing tools
- **Quality Control Workflow** - Comprehensive review system with approval processes
- **Episode Publishing** - Complete publishing pipeline with show notes, transcripts, and metadata
- **Sponsor Integration** - Built-in sponsor segment management with placement controls
- **Analytics Dashboard** - Production insights and episode performance tracking
- **Participant Management** - Complete host and guest management system
- **RSS Feed Generation** - Automatic podcast feed creation and management

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68d56186e4b13704227fb4ef&clone_repository=68d565bbe4b13704227fb52d)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "I want to buil an application that allows you to record, edit, and publish a podcast. It should allow you to have multiple people access the site from their own computers to be a part of the recording so that you can have multiple participants in the podcast. The editing should allow you to cut out clips and mix with the sound and then publishing should show the podcast and notes and an image for the podcast episode."

### Code Generation Prompt

> Based on the content model I created for "I want to buil an application that allows you to record, edit, and publish a podcast. It should allow you to have multiple people access the site from their own computers to be a part of the recording so that you can have multiple participants in the podcast. The editing should allow you to cut out clips and mix with the sound and then publishing should show the podcast and notes and an image for the podcast episode.", now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic** - Headless CMS for content management
- **React Icons** - Beautiful icons for the interface
- **Date-fns** - Date manipulation and formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd podcast-production-studio
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file with your Cosmic credentials:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. **Run the development server**
   ```bash
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 Cosmic SDK Examples

### Fetching Episodes
```typescript
import { cosmic } from '@/lib/cosmic'

async function getEpisodes() {
  try {
    const response = await cosmic.objects
      .find({ type: 'episodes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}
```

### Creating a Recording Session
```typescript
async function createRecordingSession(sessionData: CreateSessionData) {
  const response = await cosmic.objects.insertOne({
    type: 'recording-sessions',
    title: sessionData.title,
    metadata: {
      episode: sessionData.episodeId,
      session_date: sessionData.date,
      status: 'scheduled',
      participants: sessionData.participantIds,
      recording_quality: 'high'
    }
  })
  
  return response.object
}
```

## 🌟 Cosmic CMS Integration

The application integrates with 7 Cosmic object types:

- **Podcast Series** - Main podcast shows with hosts and RSS settings
- **Episodes** - Individual podcast episodes with metadata, transcripts, and participants
- **Participants** - Host and guest management with roles and audio setup notes
- **Recording Sessions** - Live recording session management with status tracking
- **Audio Clips** - Individual audio segments for editing and mixing
- **Quality Checks** - Review and approval workflow with quality assessments
- **Sponsor Segments** - Advertisement and sponsor content management

All content is managed through Cosmic's intuitive dashboard while the application provides a beautiful frontend interface for content consumption and production workflows.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect your repository to Netlify
2. Add environment variables in build settings
3. Set build command: `bun run build`
4. Set publish directory: `out` or `.next`

### Other Platforms
The application works on any platform that supports Next.js applications.

---

Built with ❤️ using [Cosmic](https://www.cosmicjs.com/docs) and Next.js
<!-- README_END -->