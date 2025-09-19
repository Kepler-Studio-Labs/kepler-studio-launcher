import { useLocation, useNavigate } from 'react-router-dom'
import icon from '../assets/icon.png'
import { BeefIcon, UnplugIcon } from 'lucide-react'
import { UserIcon } from 'lucide-react'
import { HouseIcon } from 'lucide-react'
import { SettingsIcon } from 'lucide-react'
import clsx from 'clsx'
import pokemonSvg from '../assets/433-4335826_new-pokemon-icon-icon.png'
import { useEffect, useState } from 'react'
import { cn } from '../renderer-libs/utils'
import { getStarAcademyWhitelist } from '../renderer-libs/client-api'

function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [starAcademyWhitelist, setStarAcademyWhitelist] = useState([])
  const [username, setUsername] = useState('')

  useEffect(() => {
    window.api.getAuthData().then((authData) => {
      setUsername(authData.name)
    })
    getStarAcademyWhitelist()
      .then((whiteListData) => {
        setStarAcademyWhitelist(whiteListData.data)
      })
      .catch((error) => {
        console.error(error)
        alert(
          'Une erreur est survenue lors de la récupération de la liste blanche de Star Academy !'
        )
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
            'p-4 w-full flex items-center gap-3 cursor-pointer relative group/item overflow-hidden rounded-full',
            location.pathname === '/profile' ? '' : 'bg-neutral-800 hover:bg-white hover:text-black'
          )}
          onClick={() => navigate('/profile')}
        >
          {location.pathname === '/profile' && (
            <div
              className={cn(
                'absolute inset-0',
                'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                'opacity-80 group-hover:opacity-80',
                'blur transition-opacity duration-500'
              )}
            />
          )}
          <UserIcon className={cn('w-6 h-6 shrink-0 z-10')} />
          {isOpen && <span className="z-20 font-medium text-from-left-animation">Profil</span>}
        </button>
        <div className="w-full">
          <button
            className={clsx(
              'p-4 w-full flex items-center gap-3 cursor-pointer relative group/item overflow-hidden rounded-t-2xl',
              location.pathname === '/main' ? '' : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/main')
            }}
          >
            {location.pathname === '/main' && (
              <div
                className={cn(
                  'absolute inset-0',
                  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                  'opacity-80 group-hover:opacity-80',
                  'blur transition-opacity duration-500'
                )}
              />
            )}
            <HouseIcon className={cn('w-6 h-6 shrink-0 z-10')} />
            {isOpen && <span className="z-20 font-medium text-from-left-animation">Accueil</span>}
          </button>
          {starAcademyWhitelist.some((el) => el.username === username) && (
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
              'p-4 w-full flex items-center gap-3 cursor-pointer relative group/item overflow-hidden',
              location.pathname === '/survie'
                ? ''
                : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/survie')
            }}
          >
            {location.pathname === '/survie' && (
              <div
                className={cn(
                  'absolute inset-0',
                  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                  'opacity-80 group-hover:opacity-80',
                  'blur transition-opacity duration-500'
                )}
              />
            )}
            <BeefIcon className={cn('w-6 h-6 shrink-0 z-10')} />
            {isOpen && <span className="z-20 font-medium text-from-left-animation">Survie</span>}
          </button>
          <button
            className={clsx(
              'p-4 w-full flex items-center gap-3 cursor-pointer relative group/item overflow-hidden rounded-b-2xl',
              location.pathname === '/settings'
                ? ''
                : 'bg-neutral-800 hover:bg-white hover:text-black'
            )}
            onClick={() => {
              navigate('/settings')
            }}
          >
            {location.pathname === '/settings' && (
              <div
                className={cn(
                  'absolute inset-0',
                  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                  'opacity-80 group-hover:opacity-80',
                  'blur transition-opacity duration-500'
                )}
              />
            )}
            <SettingsIcon className={cn('w-6 h-6 shrink-0 z-10')} />
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
