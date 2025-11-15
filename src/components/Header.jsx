import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white border-b-2 border-red-600 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">Thomas L. Kennedy</span>
              <span className="text-xs text-gray-600">SPH4U Passion Project</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/calendar" 
              className={`font-medium transition-colors ${
                isActive('/calendar') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Calendar
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium transition-colors ${
                isActive('/blog') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/research" 
              className={`font-medium transition-colors ${
                isActive('/research') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Research
            </Link>
            <Link 
              to="/videos" 
              className={`font-medium transition-colors ${
                isActive('/videos') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Videos
            </Link>
            <Link 
              to="/chat" 
              className={`font-medium transition-colors ${
                isActive('/chat') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Chat
            </Link>
            <Link 
              to="/team" 
              className={`font-medium transition-colors ${
                isActive('/team') 
                  ? 'text-red-600 border-b-2 border-red-600 pb-1' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Team
            </Link>
            <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
              Login
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-red-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`font-medium transition-colors pl-2 ${
                  isActive('/') 
                    ? 'text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/calendar" 
                className={`font-medium transition-colors pl-2 ${
                  isActive('/calendar') 
                    ? 'text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Calendar
              </Link>
              <Link 
                to="/blog" 
                className={`font-medium transition-colors pl-2 ${
                  isActive('/blog') 
                    ? 'text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/research" 
                className={`font-medium transition-colors pl-2 ${
                  isActive('/research') 
                    ? 'text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Research
              </Link>
              <Link 
                to="/videos" 
                className={`font-medium transition-colors pl-2 ${
                  isActive('/videos') 
                    ? 'text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Videos
              </Link>
              <Link 
                to="/chat" 
                className={`font-medium transition-colors pl-2 ${
                  isActive('/chat') 
                    ? 'text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Chat
              </Link>
              <Link 
                to="/team" 
                className={`font-medium transition-colors pl-2 ${
                  isActive('/team') 
                    ? 'text-red-600 border-l-4 border-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Team
              </Link>
              <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-center" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

