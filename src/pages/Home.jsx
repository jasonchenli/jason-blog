import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to My Health Journey
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Tracking wellness metrics, sharing insights, and building healthier habits one day at a time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/blog" className="btn-primary">
            Read Latest Posts
          </Link>
          <Link to="/metrics" className="btn-primary bg-gray-600 hover:bg-gray-700">
            View Health Metrics
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-3">📊 Health Tracking</h3>
          <p className="text-gray-600">Monitor key health metrics and visualize progress over time.</p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-3">✍️ Wellness Blog</h3>
          <p className="text-gray-600">Personal insights and experiences on the path to better health.</p>
        </div>
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-3">📚 Resources</h3>
          <p className="text-gray-600">Curated tools and resources for optimal health and wellness.</p>
        </div>
      </section>

      {/* Recent Activity - Placeholder */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {/* TODO: Add real data */}
          <div className="border-l-4 border-primary-500 pl-4 py-2">
            <p className="font-medium">Latest blog post published</p>
            <p className="text-sm text-gray-600">2 days ago</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="font-medium">Health metrics updated</p>
            <p className="text-sm text-gray-600">3 days ago</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home