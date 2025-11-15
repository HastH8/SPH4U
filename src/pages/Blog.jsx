import { useState, useEffect } from 'react'
import { MessageSquare, Clock, Send, Image as ImageIcon, X, Maximize2, Minimize2 } from 'lucide-react'
import { posts as initialPosts } from '../data/posts'
import { users } from '../data/users'

export default function Blog() {
  const [newPost, setNewPost] = useState('')
  const [newPostImage, setNewPostImage] = useState(null)
  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = localStorage.getItem('blogPosts')
    return saved ? JSON.parse(saved) : initialPosts
  })
  const [expandedPosts, setExpandedPosts] = useState({})

  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts))
  }, [blogPosts])

  const getUser = (userId) => users.find(u => u.id === userId) || users[0]

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPostImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newPost.trim() && !newPostImage) return

    const post = {
      id: Date.now(),
      userId: 1,
      text: newPost,
      timestamp: new Date().toISOString(),
      image: newPostImage,
      expanded: false
    }

    setBlogPosts([post, ...blogPosts])
    setNewPost('')
    setNewPostImage(null)
  }

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const shouldTruncate = (text) => text.length > 200

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <MessageSquare className="w-10 h-10 text-red-600" />
              Blog Feed
            </h1>
            <p className="text-xl text-gray-600">Share updates and progress with your team</p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 card-shadow mb-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share your thoughts, progress, or findings..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none text-sm sm:text-base"
                rows="4"
              />
              
              {newPostImage && (
                <div className="relative">
                  <img
                    src={newPostImage}
                    alt="Preview"
                    className="w-full rounded-lg max-h-48 sm:max-h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPostImage(null)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm sm:text-base">
                    <ImageIcon className="w-5 h-5" />
                    <span className="font-medium">Add Image</span>
                  </div>
                </label>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Post
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            {blogPosts.map((post) => {
              const user = getUser(post.userId)
              const isExpanded = expandedPosts[post.id]
              const needsTruncation = shouldTruncate(post.text)
              const displayText = isExpanded || !needsTruncation 
                ? post.text 
                : post.text.substring(0, 200) + '...'

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-xl p-4 sm:p-6 card-shadow hover:card-shadow-hover transition-all border border-gray-100"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-red-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{user.name}</h3>
                        <span className="text-sm text-gray-500 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(post.timestamp)}</span>
                        </div>
                      </div>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-sm sm:text-base">
                        <p className="break-words">{displayText}</p>
                        {needsTruncation && (
                          <button
                            onClick={() => toggleExpand(post.id)}
                            className="text-red-600 hover:text-red-700 font-medium mt-2 flex items-center gap-1 text-sm sm:text-base"
                          >
                            {isExpanded ? (
                              <>
                                <Minimize2 className="w-4 h-4" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <Maximize2 className="w-4 h-4" />
                                Read More
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      {post.image && (
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt="Post attachment"
                            className="w-full h-auto max-h-64 sm:max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(post.image, '_blank')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
