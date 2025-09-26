import React from 'react'

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Jason</h1>
        <p className="text-xl text-gray-600">Health enthusiast, data lover, and wellness advocate</p>
      </div>

      <div className="space-y-8">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">My Health Journey</h2>
          <p className="text-gray-600 mb-4">
            Welcome to my personal health tracking and sharing platform. This blog serves as both a
            accountability tool and a way to share insights from my wellness journey.
          </p>
          <p className="text-gray-600">
            Through consistent tracking, evidence-based approaches, and sustainable habits,
            I'm working toward optimal health and sharing what I learn along the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">🎯 Focus Areas</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Nutrition optimization</li>
              <li>• Fitness and strength training</li>
              <li>• Sleep quality improvement</li>
              <li>• Stress management</li>
              <li>• Biomarker tracking</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-3">📊 Metrics I Track</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Weight and body composition</li>
              <li>• Sleep duration and quality</li>
              <li>• Daily steps and activity</li>
              <li>• Heart rate variability</li>
              <li>• Blood work panels</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Why I Share</h2>
          <p className="text-gray-600 mb-4">
            Health is highly personal, but I believe in the power of transparency and community.
            By sharing my data, experiments, and lessons learned, I hope to:
          </p>
          <ul className="space-y-2 text-gray-600 ml-6">
            <li>• Inspire others to take ownership of their health</li>
            <li>• Demonstrate the importance of consistent measurement</li>
            <li>• Share practical insights and resources</li>
            <li>• Build accountability through public commitment</li>
          </ul>
        </div>

        {/* TODO: Add personal photo and contact info */}
        <div className="text-center py-8">
          <p className="text-gray-600">
            Questions or want to connect? <a href="/contact" className="text-primary-600 hover:text-primary-700">Get in touch</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default About