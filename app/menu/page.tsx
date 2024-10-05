'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db, auth } from '../lib/firebase'
import AddMenuItem from '../components/AddMenuItem'
import { Trash2, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [user, loading, error] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login')
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        setIsAdmin(userDoc.exists() && userDoc.data()?.isAdmin)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setFetchError("Failed to verify admin status. Please try again.")
      }
    }

    checkAdminStatus()

    const unsubscribe = onSnapshot(
      collection(db, 'menu'),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MenuItem))
        console.log("Fetched menu items:", items)
        setMenuItems(items)
        setFetchError(null)
      },
      (error) => {
        console.error("Error fetching menu items:", error)
        setFetchError("Failed to fetch menu items. Please check your connection and try again.")
      }
    )

    return () => unsubscribe()
  }, [user, loading, router])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'menu', id))
        console.log("Item deleted successfully")
      } catch (error) {
        console.error("Error deleting item:", error)
        setFetchError("Failed to delete item. Please try again.")
      }
    }
  }

  const handleUpdate = async (item: MenuItem) => {
    setEditingItem(item)
    setIsAddModalOpen(true)
  }

  const handleEditSubmit = async (updatedItem: Omit<MenuItem, 'id'>) => {
    if (editingItem) {
      try {
        await updateDoc(doc(db, 'menu', editingItem.id), updatedItem)
        console.log("Item updated successfully")
        setEditingItem(null)
        setIsAddModalOpen(false)
      } catch (error) {
        console.error("Error updating item:", error)
        setFetchError("Failed to update item. Please try again.")
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Please log in to access this page.</div>
  if (!isAdmin) return <div>You do not have admin access to this page.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>

      {fetchError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{fetchError}</div>}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={() => {
          setEditingItem(null)
          setIsAddModalOpen(true)
        }}
      >
        Add New Menu Item
      </button>

      {isAddModalOpen && (
        <AddMenuItem
          onClose={() => {
            setIsAddModalOpen(false)
            setEditingItem(null)
          }}
          editingItem={editingItem}
          onSubmit={editingItem ? handleEditSubmit : undefined}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.length === 0 && <p>No menu items found.</p>}
        {menuItems.map(item => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="text-lg font-bold mb-2">${item.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
            <p className="text-sm text-gray-500 mb-4">Stock: {item.stock}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleUpdate(item)}
                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                aria-label={`Edit ${item.name}`}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}