// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Sidebar from './components/Sidebar'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Canteen Admin Dashboard',
  description: 'Admin dashboard for college canteen management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}