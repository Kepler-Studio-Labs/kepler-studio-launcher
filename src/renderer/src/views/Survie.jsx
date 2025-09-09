import AppSidebar from '../components/app-sidebar'
import { GameButton } from '../components/game-button'
import Header from '../components/header'
import { SettingsIcon } from 'lucide-react'
import friends from '../assets/friends.png'

function Survie() {
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
              <h1 className="text-5xl uppercase font-bold">La survie des copains</h1>
              <p className="w-1/2 text-sm text-neutral-400">
                Mais c&apos;est aussi la survie de Garfield.
              </p>
              <div className="flex items-center gap-2">
                <GameButton gameId="survie" />
                <button
                  className="p-2 px-1 rounded-full bg-white/25 hover:bg-white/10 text-transparent font-semibold flex items-center gap-2 cursor-pointer"
                  onClick={() => alert('Impossible')}
                >
                  . <SettingsIcon className="w-4 h-4 text-white" strokeWidth={2} /> .
                </button>
              </div>
            </div>
            <div></div>
            <img
              src={friends}
              alt=""
              className="absolute -right-12 bottom-6 w-[500px] rotate-[20deg]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Survie
