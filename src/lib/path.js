import path from 'path'
import { app } from 'electron'
import fs from 'fs'

export function getKeplerPath() {
  const p = path.join(app.getPath('appData'), '.kepler')
  if (!fs.existsSync(p))
    fs.mkdirSync(p, {
      recursive: true
    })
  return p
}

export function getDownloadsDir() {
  const p = path.join(getKeplerPath(), 'tmp')
  if (!fs.existsSync(p))
    fs.mkdirSync(p, {
      recursive: true
    })
  return p
}

export function getCobblemonDir() {
  const p = path.join(getKeplerPath(), 'games', 'cobblemon')
  if (!fs.existsSync(p))
    fs.mkdirSync(p, {
      recursive: true
    })
  return p
}

export function getGameDir(gameId, isMinecraftInstance = false) {
  const p = path.join(
    getKeplerPath(),
    'keplerapps',
    isMinecraftInstance ? 'minecraft' : 'common',
    gameId
  )
  if (!fs.existsSync(p))
    fs.mkdirSync(p, {
      recursive: true
    })
  return p
}

export function getJavaDir(gameId) {
  // isMinecraftInstance is true because java = 100% mc
  const p = path.join(getGameDir(gameId, true), 'runtime', 'bin')
  if (!fs.existsSync(p))
    fs.mkdirSync(p, {
      recursive: true
    })
  return p
}
