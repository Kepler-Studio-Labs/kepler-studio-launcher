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

export function getJavaDir() {
  const p = path.join(getKeplerPath(), 'games', 'cobblemon', 'runtime', 'bin')
  if (!fs.existsSync(p))
    fs.mkdirSync(p, {
      recursive: true
    })
  return p
}
