import { useLocation, useNavigate } from 'react-router-dom'
import icon from '../assets/icon.png'
import { BeefIcon, SparkleIcon, UnplugIcon } from 'lucide-react'
import { UserIcon } from 'lucide-react'
import { HouseIcon } from 'lucide-react'
import { SettingsIcon } from 'lucide-react'
import clsx from 'clsx'
import pokemonSvg from '../assets/433-4335826_new-pokemon-icon-icon.png'
import { useEffect, useState } from 'react'
import { cn } from '../renderer-libs/utils'

function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const starAcademyWhitelist = ['LeVraiPumba', 'Drazouu', 'Cl0udyseul', 'Aerithia_', 'Swadar']
  const [username, setUsername] = useState('')

  useEffect(() => {
    window.api.getAuthData().then((authData) => {
      setUsername(authData.name)
    })
  }, [])

  const handleDisconnect = () => {
    window.electron.ipcRenderer.send('disconnect')
    navigate('/')
  }

  const handleMouseLeave = (e) => {
    try {
      if (e.currentTarget && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
        setIsOpen(false)
      }
    } catch {
      // do nothing
    }
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={clsx(
        'h-full p-4 py-12 bg-neutral-950 flex flex-col items-center justify-between transition-all duration-300',
        isOpen ? 'w-72' : 'w-22'
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={icon}
        alt="kepler icon"
        className="w-12 h-12 scale-100 transition-all duration-300"
      />
      <div className="w-full space-y-6">
        <button
          className={clsx(
            'rounded-full p-4 w-full flex flex-nowrap items-center gap-3 cursor-pointer relative group/item',
            location.pathname === '/profile'
              ? 'bg-violet-700'
              : 'bg-neutral-800 hover:bg-white hover:text-black'
          )}
          onClick={() => navigate('/profile')}
        >
          <UserIcon className="w-6 h-6 shrink-0" />
          {isOpen && <span className="z-20 font-medium text-from-left-animation">Profil</span>}
        </button>
        <div className="w-full">
          <button
            className={clsx(
              'rounded-full p-4 w-full flex flex-nowrap items-center gap-3 cursor-pointer relative group/item',
              location.pathname === '/main'
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
                location.pathname === '/main'
                  ? 'bg-violet-700'
                  : 'bg-neutral-800 group-hover/item:bg-white group-hover/item:text-black'
              )}
            ></span>
            <HouseIcon className="w-6 h-6 shrink-0 z-10" />
            {isOpen && <span className="z-20 font-medium text-from-left-animation">Accueil</span>}
          </button>
          {starAcademyWhitelist.includes(username) && (
            <button
              className={clsx(
                'p-4 w-full flex items-center gap-3 cursor-pointer relative group/item overflow-hidden',
                location.pathname === '/star-academy'
                  ? ''
                  : 'bg-neutral-800 hover:bg-white hover:text-black'
              )}
              onClick={() => {
                navigate('/star-academy')
              }}
            >
              {location.pathname === '/star-academy' && (
                <div
                  className={cn(
                    'absolute inset-0',
                    'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                    'opacity-80 group-hover:opacity-80',
                    'blur transition-opacity duration-500'
                  )}
                />
              )}
              <img
                src={pokemonSvg}
                className={cn(
                  'w-6 h-6 shrink-0 z-10',
                  location.pathname === '/star-academy' ? '' : 'group-hover/item:invert'
                )}
                alt=""
              />
              {isOpen && (
                <span className="z-20 font-medium text-from-left-animation">Star Academy</span>
              )}
            </button>
          )}
          <button
            className={clsx(
              'p-4 w-full flex items-center gap-3 cursor-pointer relative',
              location.pathname === '/cobblemon'
                ? 'bg-violet-700'
                : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/cobblemon')
            }}
          >
            <SparkleIcon className="w-6 h-6 shrink-0" />
            {isOpen && <span className="z-20 font-medium text-from-left-animation">Cobblemon</span>}
          </button>
          <button
            className={clsx(
              'p-4 w-full flex items-center gap-3 cursor-pointer relative',
              location.pathname === '/survie'
                ? 'bg-violet-700'
                : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/survie')
            }}
          >
            <BeefIcon className="w-6 h-6 shrink-0" />
            {isOpen && <span className="z-20 font-medium text-from-left-animation">Survie</span>}
          </button>
          <button
            className={clsx(
              'rounded-full p-4 w-full flex flex-nowrap items-center gap-3 cursor-pointer relative group/item',
              location.pathname === '/settings'
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
                location.pathname === '/settings'
                  ? 'bg-violet-700'
                  : 'bg-neutral-800 group-hover/item:bg-white group-hover/item:text-black'
              )}
            ></span>
            <SettingsIcon className="w-6 h-6 shrink-0 z-10" />
            {isOpen && (
              <span className="z-20 font-medium text-from-left-animation">Paramètres</span>
            )}
          </button>
        </div>
      </div>
      <button
        className="bg-neutral-800 hover:bg-white hover:text-black rounded-full p-4 w-full flex flex-nowrap items-center gap-3 cursor-pointer relative"
        onClick={handleDisconnect}
      >
        <UnplugIcon className="w-6 h-6 shrink-0" />
        {isOpen && (
          <span className="z-20 font-medium text-nowrap text-from-left-animation">
            Se déconnecter
          </span>
        )}
      </button>
    </div>
  )
}

export default AppSidebar
