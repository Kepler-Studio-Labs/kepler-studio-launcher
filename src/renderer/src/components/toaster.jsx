import { useState } from 'react'
import { cn } from '../renderer-libs/utils'

function Toaster() {
  const [toasts, setToasts] = useState([])

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xl w-full min-h-0 max-h-[calc(100vh-100px)] overflow-y-hidden">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={cn(
            'bg-black/80 p-4 rounded shadow-lg',
            toast.type === 'error' ? 'bg-red-800' : 'bg-green-800'
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default Toaster
