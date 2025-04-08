import { CompassIcon } from 'lucide-react'
import AppSidebar from '../components/app-sidebar'
import Header from '../components/header'
import { useNavigate } from 'react-router-dom'

function Main() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-full flex flex-row">
      <AppSidebar />
      <div
        className={`bg-[url('/src/assets/bg6.jpg')] bg-center bg-cover backdrop-blur-3xl w-full h-full`}
      >
        <div className="backdrop-blur-xl h-full w-full bg-black/75 p-8 pt-10">
          <div className="w-full h-full px-14 py-2 flex flex-col justify-between">
            <Header />
            <div className="grid grid-cols-2">
              <div className="flex flex-col items-start justify-end space-y-8">
                <h1 className="font-press-start uppercase text-5xl pr-20">
                  Cobblemon Saison 2 disponible
                </h1>
                <p className="text-neutral-400">
                  La saison 2 est là ! ⚡ Nouvelles aventures, nouveaux défis… Es-tu prêt à prouver
                  que tu es le dresseur ultime ? 🎮🔥
                </p>
                <button
                  className="p-4 px-8 bg-violet-500 hover:bg-violet-600 transition-all font-semibold text-xl cursor-pointer flex items-center gap-2"
                  onClick={() => navigate('/cobblemon')}
                >
                  <CompassIcon /> Découvrir
                </button>
              </div>
              <div className="flex flex-col items-start justify-end relative">
                <img
                  src="/src/assets/cobblemon.webp"
                  alt="Cobblemon illustration"
                  className="w-full absolute -right-14 -bottom-16"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
