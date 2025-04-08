import fs from 'fs'
import { getKeplerPath } from './path'
import { join } from 'path'

export function saveAuthData(data) {
  const keplerPath = getKeplerPath()
  fs.writeFileSync(join(keplerPath, 'user_session'), data)
}

export function getAuthData() {
  const keplerPath = getKeplerPath()
  if (!fs.existsSync(join(keplerPath, 'user_session'))) return null

  const authFile = fs.readFileSync(join(keplerPath, 'user_session')).toString()
  const data = JSON.parse(atob(authFile))

  return data
}

export function disconnect() {
  const keplerPath = getKeplerPath()
  if (!fs.existsSync(join(keplerPath, 'user_session'))) return

  fs.rmSync(join(keplerPath, 'user_session'))
}
