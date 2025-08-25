import fs from 'fs'
import { getKeplerPath } from './path'
import { join } from 'path'
import { getAuthApiHost } from './api'

export function saveAuthData(data) {
  const keplerPath = getKeplerPath()
  fs.writeFileSync(join(keplerPath, 'user_session'), data)
}

export function getAuthData() {
  const keplerPath = getKeplerPath()
  if (!fs.existsSync(join(keplerPath, 'user_session'))) return null

  const authFile = fs.readFileSync(join(keplerPath, 'user_session')).toString()
  const data = JSON.parse(atob(authFile))

  if (data.mcToken === null || data.mcToken === undefined) {
    fs.rmSync(join(keplerPath, 'user_session'))
    return null
  }

  if (data.refreshToken === null || data.refreshToken === undefined) {
    fs.rmSync(join(keplerPath, 'user_session'))
    return null
  }

  return data
}

export function disconnect() {
  const keplerPath = getKeplerPath()
  if (!fs.existsSync(join(keplerPath, 'user_session'))) return

  fs.rmSync(join(keplerPath, 'user_session'))
}

export async function refreshMcToken(mcToken, refreshToken) {
  const res = await fetch(
    `${getAuthApiHost()}/auth/launcher/minecraft-refresh?mcToken=${btoa(mcToken)}&refreshToken=${btoa(refreshToken)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error(text)
    return { success: false, code: 'ERROR_REFRESHING_TOKEN' }
  }

  const data = await res.json()
  return data
}
