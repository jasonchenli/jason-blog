import React from 'react'

const Resources = () => {
  const resourceCategories = [
    {
      title: "Health Tracking Tools",
      resources: [
        { name: "Oura Ring", description: "Sleep and recovery tracking", url: "#", type: "Device" },
        { name: "Apple Health", description: "Comprehensive health data platform", url: "#", type: "App" },
        { name: "MyFitnessPal", description: "Nutrition and calorie tracking", url: "#", type: "App" },
        { name: "Strava", description: "Activity and workout tracking", url: "#", type: "App" }
      ]
    },
    {
      title: "Books & Learning",
      resources: [
        { name: "Why We Sleep", description: "Matthew Walker - Sleep science", url: "#", type: "Book" },
        { name: "Outlive", description: "Peter Attia - Longevity medicine", url: "#", type: "Book" },
        { name: "Atomic Habits", description: "James Clear - Habit formation", url: "#", type: "Book" },
        { name: "The 4-Hour Body", description: "Tim Ferriss - Body optimization", url: "#", type: "Book" }
      ]
    },
    {
      title: "Lab Testing",
      resources: [
        { name: "Inside Tracker", description: "Personalized biomarker analysis", url: "#", type: "Service" },
        { name: "Function Health", description: "Comprehensive lab testing", url: "#", type: "Service" },
        { name: "Quest Diagnostics", description: "Standard lab work", url: "#", type: "Service" }
      ]
    },
    {
      title: "Nutrition & Supplements",
      resources: [
        { name: "Examine.com", description: "Evidence-based supplement research", url: "#", type: "Website" },
        { name: "Cronometer", description: "Detailed nutrition tracking", url: "#", type: "App" },
        { name: "Athletic Greens", description: "Daily nutritional insurance", url: "#", type: "Supplement" }
      ]
    }
  ]

  const getTypeColor = (type) => {
    const colors = {
      'Device': 'bg-blue-100 text-blue-800',
      'App': 'bg-green-100 text-green-800',
      'Book': 'bg-purple-100 text-purple-800',
      'Service': 'bg-orange-100 text-orange-800',
      'Website': 'bg-cyan-100 text-cyan-800',
      'Supplement': 'bg-pink-100 text-pink-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Health & Wellness Resources</h1>
        <p className="text-xl text-gray-600">
          Curated tools, books, and services I use and recommend for optimal health
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> These are personal recommendations based on my experience.
          Always consult healthcare professionals before making significant health changes.
          Some links may be affiliate links.
        </p>
      </div>

      {/* Resource Categories */}
      <div className="space-y-12">
        {resourceCategories.map((category) => (
          <section key={category.title}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {category.resources.map((resource) => (
                <div key={resource.name} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <a
                    href={resource.url}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Quick Start Guide */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">New to Health Tracking?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
              <p className="text-gray-600">Start with basic metrics: weight, sleep, and daily steps</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
              <p className="text-gray-600">Use your smartphone's built-in health app to begin tracking</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
              <p className="text-gray-600">Focus on consistency over perfection - track daily for 30 days</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</span>
              <p className="text-gray-600">Gradually add more advanced tracking tools as you build the habit</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Resources