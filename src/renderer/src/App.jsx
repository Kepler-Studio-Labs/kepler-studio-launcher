import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Auth from './views/Auth'
import MenuBar from './components/menu-bar'
import Main from './views/Main'
import Cobblemon from './views/Cobblemon'
import Profile from './views/Profile'
import Settings from './views/Settings'
import { useEffect, useState } from 'react'
import { Update } from './views/Update'
import Survie from './views/Survie'
import { SettingsOverlay } from './components/settings-overlay'
import StarAcademy from './views/StarAcademy'

function App() {
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    window.api.onUpdateAvailable(() => {
      setIsUpdate(true)
    })
  })

  return isUpdate ? (
    <div className="flex flex-col w-full min-h-screen max-h-screen h-screen bg-neutral-900 text-neutral-200 select-none *:select-none overflow-hidden">
      <MenuBar />
      <Update />
    </div>
  ) : (
    <div className="flex flex-col w-full min-h-screen max-h-screen h-screen bg-neutral-900 text-neutral-200 select-none *:select-none overflow-hidden">
      <MenuBar />
      <SettingsOverlay />
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/main" element={<Main />} />
          <Route path="/cobblemon" element={<Cobblemon />} />
          <Route path="/star-academy" element={<StarAcademy />} />
          <Route path="/survie" element={<Survie />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
