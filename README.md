# Hacker News Clone

![App Preview](https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=300&fit=crop&auto=format)

A modern, full-featured Hacker News clone built with Next.js 16 and Cosmic CMS. Browse stories, read threaded comments, and experience the classic Hacker News interface with modern performance enhancements.

## ✨ Features

- 📰 **Story Feed** - Browse link posts, text posts, Ask HN, and Show HN submissions
- 💬 **Threaded Comments** - View nested comment discussions with proper indentation
- 🔍 **Story Filtering** - Filter content by story type (Link, Text, Ask HN, Show HN)
- ⬆️ **Point System** - Display upvote counts for stories and comments
- 📱 **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- ⚡ **Fast Performance** - Built with Next.js 16 Server Components for optimal speed

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=6907e7342177b4cb6ee2710b&clone_repository=6907e8ac2177b4cb6ee2712a)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a Hacker New clone"

### Code Generation Prompt

> Based on the content model I created for "Create a Hacker New clone", now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless content management
- **React Markdown** - Markdown rendering for story content

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket with the Hacker News content model

### Installation

1. Clone this repository
2. Install dependencies:

```bash
bun install
```

3. Create a `.env.local` file with your Cosmic credentials:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📖 Cosmic SDK Examples

### Fetching Stories

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all stories with sorting
const { objects: stories } = await cosmic.objects
  .find({ type: 'stories' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Sort by points (highest first)
const sortedStories = stories.sort((a, b) => 
  (b.metadata?.points || 0) - (a.metadata?.points || 0)
)
```

### Fetching Story with Comments

```typescript
// Get a single story with full details
const response = await cosmic.objects.findOne({
  type: 'stories',
  slug: storySlug
}).props(['id', 'title', 'slug', 'metadata']).depth(1)

const story = response.object

// Get comments for this story
const { objects: comments } = await cosmic.objects
  .find({ 
    type: 'comments',
    'metadata.story': story.id 
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(2)
```

### Filtering by Story Type

```typescript
// Get only "Ask HN" stories
const { objects: askHNStories } = await cosmic.objects
  .find({ 
    type: 'stories',
    'metadata.story_type.key': 'ask'
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

## 🎨 Cosmic CMS Integration

This application uses the following Cosmic content structure:

### Stories Object Type
- **Title** (text) - Story headline
- **URL** (text) - External link for link posts
- **Content** (markdown) - Text content for self posts
- **Story Type** (select-dropdown) - Link, Text, Ask HN, or Show HN
- **Author** (text) - Username of story submitter
- **Points** (number) - Upvote count
- **Comment Count** (number) - Number of comments

### Comments Object Type
- **Content** (markdown) - Comment text
- **Author** (text) - Username of commenter
- **Story** (object) - Related story
- **Parent Comment** (object) - Parent comment for nested replies
- **Points** (number) - Upvote count

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect repository in Netlify
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add environment variables in Netlify dashboard
6. Deploy!

## 📝 Environment Variables

Create a `.env.local` file in the root directory:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

**Note**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

---

Built with [Cosmic](https://www.cosmicjs.com) - The Headless CMS for modern applications

<!-- README_END -->