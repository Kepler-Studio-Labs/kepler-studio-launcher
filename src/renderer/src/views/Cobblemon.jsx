import AppSidebar from '../components/app-sidebar'
import { GameButton } from '../components/game-button'
import Header from '../components/header'
import { SettingsIcon } from 'lucide-react'
import darkrai from '../assets/darkrai.png'

function Cobblemon() {
  return (
    <div className="w-full h-full flex flex-row">
      <AppSidebar />
      <div
        className={`bg-[url('/src/assets/bg5.jpg')] bg-center bg-cover backdrop-blur-3xl w-full h-full`}
      >
        <div className="backdrop-blur-xl h-full w-full bg-black/75 p-8 pt-10">
          <div className="w-full h-full px-14 py-2 flex flex-col items-start justify-between relative">
            <Header />
            <div className="space-y-4">
              <h1 className="text-5xl uppercase font-bold">Cobblemon: New Era</h1>
              <p className="w-1/2 text-sm text-neutral-400">
                La saison 2 de Cobblemon ouvre ses portes avec de nouveaux défis et opportunités.
                Capture, entraîne et affronte d’autres dresseurs dans un monde en constante
                évolution. Prépare-toi à repousser tes limites et à laisser ta marque sur
                l’académie.
              </p>
              <div className="flex items-center gap-2">
                <GameButton />
                <button className="p-2 px-1 rounded-full bg-white/25 hover:bg-white/10 text-transparent font-semibold flex items-center gap-2 cursor-pointer">
                  . <SettingsIcon className="w-4 h-4 text-white" strokeWidth={2} /> .
                </button>
              </div>
            </div>
            <div></div>
            <img
              src={darkrai}
              alt=""
              className="absolute right-10 bottom-6 w-80 rotate-[20deg] mix-blend-multiply grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cobblemon
