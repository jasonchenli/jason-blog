import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log('Form submitted:', formData)
    alert('Thanks for your message! I\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600">
          Questions about health tracking? Want to share your own journey? Let's connect!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Let's Connect</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-primary-600">📧</span>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">jason@jasonchen.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary-600">🐦</span>
                <div>
                  <p className="font-medium">Twitter</p>
                  <p className="text-gray-600">@jasonchen_health</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary-600">💼</span>
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-gray-600">linkedin.com/in/jasonchen</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">What I'd Love to Hear About</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Your own health tracking experiments and results</li>
              <li>• Questions about specific metrics or tools I use</li>
              <li>• Collaboration opportunities</li>
              <li>• Feedback on blog posts or the dashboard</li>
              <li>• Suggestions for new topics to explore</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Response Time</h2>
            <p className="text-gray-600">
              I typically respond within 24-48 hours. For urgent health questions,
              please consult with a healthcare professional directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact