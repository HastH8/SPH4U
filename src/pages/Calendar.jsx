import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, Plus, Edit2, X, Clock, MapPin, LogIn } from 'lucide-react'
import { milestones as initialMilestones } from '../data/calendar'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendarEvents')
    return saved ? JSON.parse(saved) : initialMilestones
  })
  const [showEventModal, setShowEventModal] = useState(false)
  const navigate = useNavigate()
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isLoggedIn = !!currentUser
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: ''
  })

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events))
  }, [events])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  const handleDateClick = (day) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split('T')[0]
    setSelectedDate(dateStr)
    setFormData({
      title: '',
      date: dateStr,
      time: '14:00',
      description: ''
    })
    setEditingEvent(null)
    setShowEventModal(true)
  }

  const handleEditEvent = (event) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time || '14:00',
      description: event.description
    })
    setShowEventModal(true)
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (editingEvent) {
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...editingEvent, ...formData }
          : e
      ))
    } else {
      const newEvent = {
        id: Date.now(),
        ...formData,
        status: 'upcoming'
      }
      setEvents([...events, newEvent])
    }
    setShowEventModal(false)
    setEditingEvent(null)
    setFormData({ title: '', date: '', time: '', description: '' })
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId))
    setShowEventModal(false)
    setEditingEvent(null)
  }

  const changeMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1))
  }

  const renderCalendarDays = () => {
    const days = []
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = new Date(year, month - 1, day)
      const dateEvents = getEventsForDate(date)
      days.push(
        <div
          key={`prev-${day}`}
          className="h-24 p-1 border border-gray-200 bg-gray-50 text-gray-400"
        >
          <div className="text-sm font-medium">{day}</div>
          {dateEvents.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {dateEvents.slice(0, 2).map(event => (
                <div
                  key={event.id}
                  className="bg-red-100 text-red-700 text-xs px-1 py-0.5 rounded truncate"
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dateEvents.length > 2 && (
                <div className="text-xs text-gray-500">+{dateEvents.length - 2}</div>
              )}
            </div>
          )}
        </div>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      const isToday = dateStr === new Date().toISOString().split('T')[0]
      const dateEvents = getEventsForDate(date)
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 p-1 border border-gray-200 transition-colors ${
            isToday ? 'bg-red-50 border-red-300' : 'bg-white'
          } ${isLoggedIn ? 'cursor-pointer hover:bg-red-50' : 'cursor-not-allowed opacity-75'}`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-red-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-0.5">
            {dateEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className="bg-red-600 text-white text-xs px-1 py-0.5 rounded truncate"
                title={event.title}
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditEvent(event)
                }}
              >
                {event.title}
              </div>
            ))}
            {dateEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dateEvents.length - 2}</div>
            )}
          </div>
        </div>
      )
    }

    const totalCells = days.length
    const remainingCells = 42 - totalCells
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day)
      const dateEvents = getEventsForDate(date)
      days.push(
        <div
          key={`next-${day}`}
          className="h-24 p-1 border border-gray-200 bg-gray-50 text-gray-400"
        >
          <div className="text-sm font-medium">{day}</div>
          {dateEvents.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {dateEvents.slice(0, 2).map(event => (
                <div
                  key={event.id}
                  className="bg-red-100 text-red-700 text-xs px-1 py-0.5 rounded truncate"
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dateEvents.length > 2 && (
                <div className="text-xs text-gray-500">+{dateEvents.length - 2}</div>
              )}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CalendarIcon className="w-10 h-10 text-red-600" />
                Project Calendar
              </h1>
              <p className="text-xl text-gray-600">Track important milestones and deadlines</p>
            </div>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login')
                } else {
                  const today = new Date().toISOString().split('T')[0]
                  setSelectedDate(today)
                  setFormData({
                    title: '',
                    date: today,
                    time: '14:00',
                    description: ''
                  })
                  setEditingEvent(null)
                  setShowEventModal(true)
                }
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isLoggedIn}
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>

          {!isLoggedIn && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <LogIn className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Please log in to create events</p>
                <p className="text-xs text-red-600 mt-1">You need to be logged in to add or edit calendar events.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Login
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl card-shadow border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0">
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center font-semibold text-gray-700 bg-gray-100">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events
                .sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')))
                .filter(e => new Date(e.date + 'T' + (e.time || '00:00')) >= new Date())
                .slice(0, 5)
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false)
                  setEditingEvent(null)
                  setFormData({ title: '', date: '', time: '', description: '' })
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
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
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {editingEvent ? 'Update' : 'Create'} Event
                </button>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                    className="bg-red-100 text-red-700 px-6 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false)
                    setEditingEvent(null)
                    setFormData({ title: '', date: '', time: '', description: '' })
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
