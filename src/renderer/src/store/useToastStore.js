import { create } from 'zustand'
import { nanoid } from 'nanoid'

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'info') =>
    set((state) => ({
      toasts: [...state.toasts, { id: nanoid(), message, type }]
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}))

export default useToastStore
