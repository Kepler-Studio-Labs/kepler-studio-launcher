import { app } from 'electron'
import { getApiHost } from './api'
import { games } from './games'

const fs = require('fs')
const path = require('path')

export const getInstalledVersion = (game) => {
  const versionFilePath = path.join(app.getPath('appData'), '.kepler', `${game}-version.txt`)

  try {
    if (!fs.existsSync(versionFilePath)) return null // Fichier non trouvé
    return fs.readFileSync(versionFilePath, 'utf-8')
  } catch (error) {
    console.error('Erreur lors de la lecture de la version installée :', error)
    return null
  }
}

export const getLatestVersion = async (game) => {
  try {
    const gameMeta = games[game]
    if (!gameMeta) return null

    const res = await fetch(`${getApiHost()}/update/game/${gameMeta.dbId}/version`)

    if (!res.ok) {
      const text = await res.text()
      console.error(text)
      throw new Error('Failed to fetch remote version')
    }

    const data = await res.json()
    return data.success ? data.version : null
  } catch {
    return null
  }
}

export const saveVersionFile = (game, version) => {
  console.log('v', game, version)
  const versionFilePath = path.join(app.getPath('appData'), '.kepler', `${game}-version.txt`)
  try {
    if (fs.existsSync(versionFilePath)) fs.rmSync(versionFilePath)
    fs.writeFileSync(versionFilePath, version)
    console.log('done')
  } catch (error) {
    console.error(error)
    return false
  }
}
