import React from 'react'

const Metrics = () => {
  // TODO: Replace with real data from health tracking APIs
  const healthMetrics = [
    { metric: "Weight", value: "72.5 kg", change: "-0.8", trend: "down", date: "2024-09-25" },
    { metric: "Body Fat", value: "12.3%", change: "-0.5", trend: "down", date: "2024-09-25" },
    { metric: "Sleep Score", value: "87", change: "+3", trend: "up", date: "2024-09-25" },
    { metric: "HRV", value: "45 ms", change: "+2", trend: "up", date: "2024-09-25" },
    { metric: "Steps", value: "8,429", change: "+1,200", trend: "up", date: "2024-09-25" },
    { metric: "Resting HR", value: "52 bpm", change: "-1", trend: "down", date: "2024-09-25" }
  ]

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'
  }

  const getTrendColor = (trend, metric) => {
    // For some metrics, down is good (weight, body fat, resting HR)
    const downIsGood = ['Weight', 'Body Fat', 'Resting HR'].includes(metric)
    if (trend === 'up') {
      return downIsGood ? 'text-red-600' : 'text-green-600'
    } else if (trend === 'down') {
      return downIsGood ? 'text-green-600' : 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Metrics Dashboard</h1>
        <p className="text-xl text-gray-600">
          Real-time tracking of key health and wellness indicators
        </p>
      </div>

      {/* Current Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {healthMetrics.map((item) => (
          <div key={item.metric} className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                {item.metric}
              </h3>
              <span className="text-lg">{getTrendIcon(item.trend)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">{item.value}</span>
              <span className={`text-sm font-medium ${getTrendColor(item.trend, item.metric)}`}>
                {item.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Updated {item.date}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="space-y-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Weight Trend (90 Days)</h2>
          <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">TODO: Add interactive weight chart</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Sleep Quality</h2>
            <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">TODO: Sleep score chart</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Heart Rate Variability</h2>
            <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">TODO: HRV trend chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">Apple Health</h3>
            <p className="text-sm text-gray-600">Steps, Heart Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">Oura Ring</h3>
            <p className="text-sm text-gray-600">Sleep, HRV, Recovery</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">InBody Scale</h3>
            <p className="text-sm text-gray-600">Weight, Body Composition</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">Manual Entry</h3>
            <p className="text-sm text-gray-600">Blood Work, Symptoms</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Metrics