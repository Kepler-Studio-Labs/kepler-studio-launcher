import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import MenuBar from './components/menu-bar'
import { Router, Routes, Route } from 'react-router-dom'
import GameSettings from './views/GameSettings'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="flex flex-col w-full min-h-screen max-h-screen h-screen bg-neutral-900 text-neutral-200 select-none *:select-none overflow-hidden">
      <MenuBar />
      <Router>
        <Routes>
          <Route path="/" element={<GameSettings />} />
        </Routes>
      </Router>
    </div>
  </React.StrictMode>
)
