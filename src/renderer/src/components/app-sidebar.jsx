import { useNavigate } from 'react-router-dom'
import icon from '../assets/icon.png'
import { UnplugIcon } from 'lucide-react'
import { UserIcon } from 'lucide-react'
import { HouseIcon } from 'lucide-react'
import { SettingsIcon } from 'lucide-react'
import clsx from 'clsx'
import { BoxIcon } from 'lucide-react'

function AppSidebar() {
  const navigate = useNavigate()

  const handleDisconnect = () => {
    window.electron.ipcRenderer.send('disconnect')
    navigate('/')
  }

  return (
    <div className="h-full w-22 p-4 py-12 bg-neutral-950 flex flex-col items-center justify-between transition-all duration-300 group">
      <img
        src={icon}
        alt="kepler icon"
        className="w-12 h-12 scale-100 transition-all duration-300"
      />
      <div className="w-full space-y-6">
        <button
          className={clsx(
            'rounded-full p-4 w-full flex items-center gap-2 cursor-pointer relative group/item',
            window.location.pathname === '/profile'
              ? 'bg-violet-700'
              : 'bg-neutral-800 hover:bg-white hover:text-black'
          )}
          onClick={() => navigate('/profile')}
        >
          <UserIcon className="w-6 h-6" />
          <span className="hidden absolute flex items-center justify-center left-4 right-0 top-0 bottom-0 scale-0 group-hover:scale-100 font-medium transition-all duration-300">
            Profil
          </span>
        </button>
        <div className="w-full">
          <button
            className={clsx(
              'rounded-full p-4 w-full flex items-center gap-2 cursor-pointer relative group/item',
              window.location.pathname === '/main'
                ? 'bg-violet-700'
                : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/main')
            }}
          >
            <span
              className={clsx(
                'absolute w-full bg-neutral-700 left-0 right-0 top-8 bottom-0 z-0',
                window.location.pathname === '/main'
                  ? 'bg-violet-700'
                  : 'bg-neutral-800 group-hover/item:bg-white group-hover/item:text-black'
              )}
            ></span>
            <HouseIcon className="w-6 h-6 z-10" />
            <span className="hidden absolute flex items-center justify-center left-4 right-0 top-0 bottom-0 scale-0 group-hover:scale-100 font-medium transition-all duration-300 z-10">
              Accueil
            </span>
          </button>
          <button
            className={clsx(
              'p-4 w-full flex items-center gap-2 cursor-pointer relative',
              window.location.pathname === '/cobblemon'
                ? 'bg-violet-700'
                : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/cobblemon')
            }}
          >
            <BoxIcon className="w-6 h-6" />
            <span className="hidden absolute flex items-center justify-center left-4 right-0 top-0 bottom-0 scale-0 group-hover:scale-100 font-medium transition-all duration-300">
              Cobblemon
            </span>
          </button>
          <button
            className={clsx(
              'rounded-full p-4 w-full flex items-center gap-2 cursor-pointer relative group/item',
              window.location.pathname === '/settings'
                ? 'bg-violet-700'
                : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/settings')
            }}
          >
            <span
              className={clsx(
                'absolute w-full bg-neutral-700 left-0 right-0 bottom-8 top-0 z-0',
                window.location.pathname === '/settings'
                  ? 'bg-violet-700'
                  : 'bg-neutral-800 group-hover/item:bg-white group-hover/item:text-black'
              )}
            ></span>
            <SettingsIcon className="w-6 h-6 z-10" />
            <span className="hidden absolute flex items-center justify-center left-4 right-0 top-0 bottom-0 scale-0 group-hover:scale-100 font-medium transition-all duration-300 z-10">
              Paramètres
            </span>
          </button>
        </div>
      </div>
      <button
        className="bg-neutral-800 hover:bg-white hover:text-black rounded-full p-4 w-full flex items-center gap-2 cursor-pointer relative"
        onClick={handleDisconnect}
      >
        <UnplugIcon className="w-6 h-6" />
        <span className="hidden absolute flex items-center justify-center left-6 right-0 top-0 bottom-0 scale-0 group-hover:scale-100 font-medium transition-all duration-300">
          Se déconnecter
        </span>
      </button>
    </div>
  )
}

export default AppSidebar
