import Link from 'next/link'
import { Home, ClipboardList, BarChart2, Settings } from 'lucide-react'

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-1xl uppercase text-white">Canteen Admin</h1>
      </div>
      <ul className="flex flex-col py-4">
        <li>
          <Link href="/dashboard" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-200">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Home className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/menu" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-200">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <ClipboardList className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium">Menu Items</span>
          </Link>
        </li>
        <li>
          <Link href="/sales" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-200">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <BarChart2 className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium">Sales Analytics</span>
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-200">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <Settings className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar