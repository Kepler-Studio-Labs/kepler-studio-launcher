import { useEffect, useState } from 'react'
import AppSidebar from '../components/app-sidebar'
import Header from '../components/header'

function Profile() {
  const [username, setUsername] = useState('')
  const [uuid, setUUID] = useState('')

  useEffect(() => {
    window.api.getAuthData().then((authData) => {
      setUsername(authData.name)
      setUUID(authData.id)
    })
  }, [])

  return (
    <div className="w-full h-full flex flex-row">
      <AppSidebar />
      <div
        className={`bg-[url('/src/assets/bg4.jpg')] bg-center bg-cover backdrop-blur-3xl w-full h-full`}
      >
        <div className="backdrop-blur-xl h-full w-full bg-black/75 p-8 pt-10 space-y-6">
          <div className="w-full h-full px-14 py-2 space-y-8">
            <Header />
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2 bg-neutral-800/75 rounded-lg p-4 space-y-2 hidden">
                <p className="font-semibold uppercase">Profil</p>
                <a href="#!" className="text-violet-400">
                  Informations
                </a>
              </div>
              <div className="col-span-9 grid grid-cols-2 gap-4">
                <div className=" bg-neutral-800/75 rounded-lg p-4 space-y-2">
                  <p className="font-semibold uppercase">Informations du compte</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">Nom</p>{' '}
                    <span className="text-sm">{username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">Adresse email</p>{' '}
                    <span className="text-sm">?</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">Création du compte</p>{' '}
                    <span className="text-sm">?</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">UUID v4</p>{' '}
                    <span className="text-sm">{uuid}</span>
                  </div>
                </div>
                <div className=" bg-neutral-800/75 rounded-lg p-4 space-y-2">
                  <p className="font-semibold uppercase">Niveau Kepler</p>
                  <p className="text-sm text-neutral-400">Vous êtes actuellement niveau 1.</p>
                  <div className="bg-violet-950 w-full h-2 rounded-full">
                    <div className="bg-violet-500 w-1 rounded-full h-full"></div>
                  </div>
                  <p className="text-right text-xs text-neutral-400">0 / 120 xp</p>
                </div>
                <div className="col-span-2 bg-neutral-800/75 rounded-lg p-4 space-y-2">
                  <p className="font-semibold uppercase">Statistiques</p>
                  <div className="w-1/2 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-400">Temps de jeu</p>{' '}
                      <span className="text-sm">0 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-400">Cobblemons découverts</p>{' '}
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-400">Shinys découverts</p>{' '}
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-400">Légendaires possédés</p>{' '}
                      <span className="text-sm">0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-3 bg-neutral-800/75 rounded-lg p-4">
                <p className="font-semibold uppercase">Skin</p>
                <div className="w-full flex items-center justify-center">
                  <img
                    src={`https://mc-heads.net/body/${username}/left`}
                    alt={`${username} minecraft skin`}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
