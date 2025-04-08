import { MinusIcon } from 'lucide-react'
import { XIcon } from 'lucide-react'

function MenuBar() {
  const handleClose = () => {
    window.electron.ipcRenderer.send('close')
  }

  const handleMinimize = () => {
    window.electron.ipcRenderer.send('minimize')
  }

  return (
    <div className="w-full flex items-center justify-end gap-2 h-fit absolute z-50" id="titlebar">
      <button className="px-2 py-1.5 cursor-pointer group" onClick={handleMinimize}>
        <MinusIcon className="size-5 stroke-2 text-neutral-500 hover:text-white" />
      </button>
      <button className="px-2 py-1.5 cursor-pointer group" onClick={handleClose}>
        <XIcon className="size-5 stroke-2 text-neutral-500 hover:text-white" />
      </button>
    </div>
  )
}

export default MenuBar
