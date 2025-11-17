import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, FileVideo, Plus, X, LogIn } from 'lucide-react'
import { subscribeToVideos, addVideo } from '../firebase/services'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    thumbnail: '📹',
    videoUrl: ''
  })
  const navigate = useNavigate()
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isLoggedIn = !!currentUser

  useEffect(() => {
    const unsubscribe = subscribeToVideos((firebaseVideos) => {
      setVideos(firebaseVideos)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    try {
      await addVideo({
        ...formData,
        timestamp: new Date().toISOString()
      })
      setFormData({
        title: '',
        description: '',
        duration: '',
        thumbnail: '📹',
        videoUrl: ''
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding video:', error)
      alert('Failed to add video. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <FileVideo className="w-10 h-10 text-red-600" />
                Video Library
              </h1>
              <p className="text-xl text-gray-600">Watch experiments and presentations</p>
            </div>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login')
                } else {
                  setShowAddModal(true)
                }
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isLoggedIn}
            >
              <Plus className="w-5 h-5" />
              Add Video
            </button>
          </div>

          {!isLoggedIn && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center gap-3">
              <LogIn className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Please log in to add videos</p>
                <p className="text-xs text-red-600 mt-1">You need to be logged in to add videos to the library.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Login
              </button>
            </div>
          )}

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No videos yet. Add your first video to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all border border-gray-100"
                >
                  <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                    <div className="text-6xl">{video.thumbnail || '📹'}</div>
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity cursor-pointer"
                      onClick={() => {
                        if (video.videoUrl) {
                          window.open(video.videoUrl, '_blank')
                        }
                      }}
                    >
                      <div className="bg-red-600 rounded-full p-4 hover:bg-red-700 transition-colors">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-gray-600">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-red-50 rounded-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Player</h2>
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              <video
                controls
                className="w-full h-full"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23DC2626' width='1280' height='720'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='white'%3EVideo Placeholder%3C/text%3E%3C/svg%3E"
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-gray-600 mt-4 text-center">
              Add videos with URLs to see them play here
            </p>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-900">Add Video</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({
                    title: '',
                    description: '',
                    duration: '',
                    thumbnail: '📹',
                    videoUrl: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (e.g., 5:32)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="5:32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="📹"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Add Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({
                      title: '',
                      description: '',
                      duration: '',
                      thumbnail: '📹',
                      videoUrl: ''
                    })
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

