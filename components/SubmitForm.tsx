'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitForm() {
  const router = useRouter()
  const [storyType, setStoryType] = useState<'link' | 'text' | 'ask' | 'show'>('link')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!title.trim()) {
      setError('Title is required')
      setLoading(false)
      return
    }

    if (storyType === 'link' && !url.trim()) {
      setError('URL is required for link posts')
      setLoading(false)
      return
    }

    if ((storyType === 'text' || storyType === 'ask') && !content.trim()) {
      setError('Content is required for text posts')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/stories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          storyType,
          url: url.trim(),
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create post')
        setLoading(false)
        return
      }

      // Redirect to the new story
      router.push(`/stories/${data.story.slug}`)
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Story Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Post Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="link"
              checked={storyType === 'link'}
              onChange={(e) => setStoryType(e.target.value as 'link')}
              className="mr-2"
            />
            <span className="text-sm">Link</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="text"
              checked={storyType === 'text'}
              onChange={(e) => setStoryType(e.target.value as 'text')}
              className="mr-2"
            />
            <span className="text-sm">Text</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="ask"
              checked={storyType === 'ask'}
              onChange={(e) => setStoryType(e.target.value as 'ask')}
              className="mr-2"
            />
            <span className="text-sm">Ask HN</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="show"
              checked={storyType === 'show'}
              onChange={(e) => setStoryType(e.target.value as 'show')}
              className="mr-2"
            />
            <span className="text-sm">Show HN</span>
          </label>
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hn-orange focus:border-transparent"
          placeholder="Enter a descriptive title"
        />
      </div>

      {/* URL (for link posts) */}
      {storyType === 'link' && (
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required={storyType === 'link'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hn-orange focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>
      )}

      {/* Content (for text/ask posts) */}
      {(storyType === 'text' || storyType === 'ask' || storyType === 'show') && (
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required={storyType === 'text' || storyType === 'ask'}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hn-orange focus:border-transparent"
            placeholder="Enter your content (Markdown supported)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Markdown formatting is supported
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-hn-orange text-white py-2 px-4 rounded-md hover:bg-hn-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Post'}
      </button>
    </form>
  )
}