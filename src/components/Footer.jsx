import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Jason's Health</h3>
            <p className="text-sm">
              Personal health and wellness insights, metrics tracking, and resources for a healthier lifestyle.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/metrics" className="text-sm hover:text-white transition-colors">Health Metrics</Link></li>
              <li><Link to="/resources" className="text-sm hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
              {/* TODO: Add social media links */}
              <li><a href="#" className="text-sm hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">© 2024 Jason Chen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer