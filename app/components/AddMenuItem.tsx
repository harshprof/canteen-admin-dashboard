'use client'

import { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

interface AddMenuItemProps {
  onClose: () => void;
  editingItem?: MenuItem | null;
  onSubmit?: (item: Omit<MenuItem, 'id'>) => Promise<void>;
}

export default function AddMenuItem({ onClose, editingItem, onSubmit }: AddMenuItemProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  // Predefined categories
  const categories = ['Chaat', 'Drinks', 'Snacks', 'Desserts'];

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name)
      setPrice(editingItem.price.toString())
      setStock(editingItem.stock.toString())
      setCategory(editingItem.category)
      setDescription(editingItem.description)
    }
  }, [editingItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const item = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      description
    }

    try {
      if (editingItem && onSubmit) {
        await onSubmit(item)
      } else {
        await addDoc(collection(db, 'menu'), item) // Changed from 'menuItems' to 'menu'
      }
      onClose()
    } catch (error) {
      console.error("Error adding/updating menu item:", error)
      alert("An error occurred while saving the menu item. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {editingItem ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}