import React from 'react'
import { Link } from 'react-router-dom'

const Blog = () => {
  // TODO: Replace with real blog data
  const blogPosts = [
    {
      id: 1,
      title: "My 30-Day Sleep Optimization Experiment",
      excerpt: "Testing different sleep schedules, environments, and routines to improve sleep quality metrics.",
      date: "2024-09-20",
      category: "Sleep",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Tracking HRV: 6 Months of Data Analysis",
      excerpt: "What I learned from daily heart rate variability measurements and how it correlates with my recovery.",
      date: "2024-09-15",
      category: "Recovery",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "The Power of Morning Routine Consistency",
      excerpt: "How establishing a data-driven morning routine improved my energy levels and productivity metrics.",
      date: "2024-09-10",
      category: "Habits",
      readTime: "4 min read"
    }
  ]

  const categories = ["All", "Sleep", "Nutrition", "Exercise", "Recovery", "Habits", "Data"]

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Health & Wellness Blog</h1>
        <p className="text-xl text-gray-600">
          Personal experiments, data insights, and lessons from my health journey
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts */}
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium">
                {post.category}
              </span>
              <span className="text-sm text-gray-500">{post.readTime}</span>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
              <Link to={`/blog/${post.id}`}>
                {post.title}
              </Link>
            </h2>

            <p className="text-gray-600 mb-4">{post.excerpt}</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{post.date}</span>
              <Link
                to={`/blog/${post.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* TODO: Add pagination */}
      <div className="text-center mt-12">
        <button className="btn-primary">Load More Posts</button>
      </div>
    </div>
  )
}

export default Blog