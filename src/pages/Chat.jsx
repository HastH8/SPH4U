import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, MessageCircle, Paperclip, Image as ImageIcon, Video, File, X, Download, LogIn } from 'lucide-react'
import { messages as initialMessages } from '../data/messages'
import { users } from '../data/users'

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages')
    return saved ? JSON.parse(saved) : initialMessages
  })
  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const navigate = useNavigate()
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isLoggedIn = !!currentUser

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getUser = (userId) => users.find(u => u.id === userId) || users[0]

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const attachment = {
          id: Date.now() + Math.random(),
          type: type,
          file: file,
          preview: reader.result,
          name: file.name,
          size: file.size,
          mimeType: file.type
        }
        setAttachments([...attachments, attachment])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const downloadFile = (attachment) => {
    const link = document.createElement('a')
    link.href = attachment.preview
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openFile = (attachment) => {
    const link = document.createElement('a')
    link.href = attachment.preview
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (!newMessage.trim() && attachments.length === 0) return

    const message = {
      id: Date.now(),
      userId: currentUser.id,
      text: newMessage,
      attachments: attachments.map(a => ({
        type: a.type,
        preview: a.preview,
        name: a.name,
        size: a.size,
        mimeType: a.mimeType
      })),
      timestamp: new Date().toISOString()
    }

    setMessages([...messages, message])
    setNewMessage('')
    setAttachments([])
    setShowAttachmentMenu(false)
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Team Discussion</h1>
            <p className="text-sm text-gray-600">5 members online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">
                  {date}
                </div>
              </div>
              <div className="space-y-4">
                {dateMessages.map((message) => {
                  const user = getUser(message.userId)
                  const isCurrentUser = message.userId === 1

                  return (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center text-xl flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isCurrentUser
                              ? 'bg-red-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                          }`}
                        >
                          {message.text && (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          )}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="relative">
                                  {attachment.type === 'image' && (
                                    <div className="relative group">
                                      <img
                                        src={attachment.preview}
                                        alt={attachment.name}
                                        className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => openFile(attachment)}
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          downloadFile(attachment)
                                        }}
                                        className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Download image"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                  {attachment.type === 'video' && (
                                    <div className="relative group">
                                      <video
                                        src={attachment.preview}
                                        controls
                                        className="max-w-xs rounded-lg"
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          downloadFile(attachment)
                                        }}
                                        className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Download video"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                  {attachment.type === 'file' && (
                                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                                      isCurrentUser ? 'bg-red-700' : 'bg-gray-100'
                                    }`}>
                                      <File className={`w-5 h-5 ${isCurrentUser ? 'text-white' : 'text-gray-600'}`} />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-white' : 'text-gray-900'}`}>
                                          {attachment.name}
                                        </p>
                                        <p className={`text-xs ${isCurrentUser ? 'text-red-100' : 'text-gray-500'}`}>
                                          {(attachment.size / 1024).toFixed(2)} KB
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => downloadFile(attachment)}
                                        className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                                          isCurrentUser 
                                            ? 'bg-red-600 text-white hover:bg-red-800' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        title="Download file"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {!isLoggedIn && (
        <div className="bg-red-50 border-t border-red-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <LogIn className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">Please log in to send messages</p>
              <p className="text-xs text-red-600 mt-1">You need to be logged in to participate in the chat.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Login
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto p-4">
          {attachments.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="relative flex-shrink-0">
                  {attachment.type === 'image' && (
                    <img
                      src={attachment.preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  {attachment.type === 'video' && (
                    <video
                      src={attachment.preview}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  {attachment.type === 'file' && (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <File className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isLoggedIn ? "Type a message..." : "Please log in to send messages..."}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!isLoggedIn}
              />
              <div className="absolute right-2 bottom-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/login')
                    } else {
                      setShowAttachmentMenu(!showAttachmentMenu)
                    }
                  }}
                  className="text-gray-500 hover:text-red-600 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isLoggedIn}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                {showAttachmentMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                    <div className="flex flex-col gap-2">
                      <label className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Photo</span>
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">Video</span>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, 'video')}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded transition-colors">
                        <File className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">File</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'file')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center flex-shrink-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isLoggedIn}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
