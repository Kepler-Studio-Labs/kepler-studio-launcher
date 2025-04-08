import { app } from 'electron'
import { getApiHost } from './api'

const fs = require('fs')
const path = require('path')

export const getInstalledVersion = () => {
  const versionFilePath = path.join(app.getPath('appData'), '.kepler', 'installed_version.txt')

  try {
    if (!fs.existsSync(versionFilePath)) return null // Fichier non trouvé
    return fs.readFileSync(versionFilePath, 'utf-8').trim()
  } catch (error) {
    console.error('Erreur lors de la lecture de la version installée :', error)
    return null
  }
}

export const getLatestVersion = async () => {
  try {
    const res = await fetch(`${getApiHost()}/update/game/version`)

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

export const saveVersionFile = (version) => {
  const versionFilePath = path.join(app.getPath('appData'), '.kepler', 'installed_version.txt')
  try {
    if (fs.existsSync(versionFilePath)) fs.rmSync(versionFilePath)
    fs.writeFileSync(versionFilePath, version)
    console.log('done')
  } catch (error) {
    console.error(error)
    return false
  }
}
