// app/components/SalesChart.tsx
'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function SalesChart() {
  const [salesData, setSalesData] = useState<{ date: string; total: number }[]>([])

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesQuery = query(collection(db, 'sales'), orderBy('date', 'desc'), limit(7))
      const querySnapshot = await getDocs(salesQuery)
      const data = querySnapshot.docs.map(doc => ({
        date: doc.data().date,
        total: doc.data().total
      }))
      setSalesData(data.reverse())
    }

    fetchSalesData()
  }, [])

  const chartData = {
    labels: salesData.map(item => item.date),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(item => item.total),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sales Last 7 Days</h2>
      <Line data={chartData} />
    </div>
  )
}