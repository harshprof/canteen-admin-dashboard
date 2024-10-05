'use client'

import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'
import { auth } from './lib/firebase'

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    console.log("User:", user);
    console.log("Loading:", loading);

    if (!loading) {
      if (user) {
        // If user is authenticated, redirect to the menu
        console.log('Redirecting to /menu')
        router.push('/menu')
      } else {
        // If no user is authenticated, redirect to login
        console.log('Redirecting to /login')
        router.push('/login')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return null
}
