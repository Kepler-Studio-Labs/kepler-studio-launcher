import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Auth from './views/Auth'
import MenuBar from './components/menu-bar'
import Main from './views/Main'
import Cobblemon from './views/Cobblemon'
import Profile from './views/Profile'
import Settings from './views/Settings'

function App() {
  return (
    <div className="flex flex-col w-full min-h-screen max-h-screen h-screen bg-neutral-900 text-neutral-200 select-none *:select-none overflow-hidden">
      <MenuBar />
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/main" element={<Main />} />
          <Route path="/cobblemon" element={<Cobblemon />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
