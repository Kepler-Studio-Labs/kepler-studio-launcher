import Header from '../components/header'

function GameSettings() {
  return (
    <div className="w-full h-full flex flex-row">
      <div
        className={`bg-[url('/src/assets/bg6.jpg')] bg-center bg-cover backdrop-blur-3xl w-full h-full`}
      >
        <div className="backdrop-blur-xl h-full w-full bg-black/75 p-8 pt-10">
          <div className="w-full h-full px-14 py-2 flex flex-col justify-between">
            <Header />
            <div className="grid grid-cols-2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameSettings
