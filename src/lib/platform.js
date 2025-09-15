export function getPlatform() {
  const platform = process.platform
  if (platform.startsWith('win')) return 'windows'
  if (platform === 'darwin') return 'mac'
  if (platform === 'linux') return 'linux'
  return 'unknown'
}

export function getArch() {
  const arch = process.arch
  if (arch === 'arm64' || arch === 'aarch64') return 'arm64'
  if (arch === 'x64' || arch === 'amd64') return 'x64'
  return 'unknown'
}
