// components/Login.tsx
'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('') // Clear previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Fetch the user document to check if they are an admin
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists() && userDoc.data().isAdmin) {
        // If the user is an admin, redirect to the admin page
        router.push('/menu') // Adjust the route as per your app
      } else {
        setError('You do not have admin access')
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  )
}
