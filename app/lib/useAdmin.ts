import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db, auth } from './firebase'

export function useAdmin() {
  const [user] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        setIsAdmin(userDoc.data()?.isAdmin || false)
      } else {
        setIsAdmin(false)
      }
    }

    checkAdminStatus()
  }, [user])

  return isAdmin
}