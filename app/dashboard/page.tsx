// pages/dashboard.js
import React from 'react'

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Card 1: Total Sales */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Sales</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">$12,345</p>
        </div>

        {/* Card 2: Menu Items */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Menu Items</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">25</p>
        </div>

        {/* Card 3: Orders Today */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Orders Today</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">128</p>
        </div>

        {/* Card 4: Pending Orders */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Pending Orders</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">5</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
