import DiscordRPC from 'discord-rpc'
import { create } from 'zustand'

const clientId = '1359083970154725525'

export const useDiscordStore = create((set, get) => ({
  initialized: false,
  rpc: null,
  details: 'Menu principal',
  state: null,
  largeImageKey: 'keplerbg',
  largeImageText: 'Kepler Studio Launcher',
  smallImageKey: null,
  smallImageText: null,
  startTimestamp: new Date(),

  init() {
    if (get().initialized) return

    DiscordRPC.register(clientId)
    const rpc = new DiscordRPC.Client({ transport: 'ipc' })

    rpc.on('ready', () => {
      get().update()
      setInterval(() => {
        get().update()
      }, 15 * 1000)
    })

    rpc.login({ clientId }).catch(console.error)

    set({
      rpc
    })
  },
  update() {
    const {
      startTimestamp,
      details,
      state,
      largeImageKey,
      largeImageText,
      smallImageKey,
      smallImageText
    } = get()

    const rpcData = {
      instance: false,
      startTimestamp
    }

    if (details) rpcData.details = details
    if (state) rpcData.state = state
    if (largeImageKey) rpcData.largeImageKey = largeImageKey
    if (largeImageText) rpcData.largeImageText = largeImageText
    if (smallImageKey) rpcData.smallImageKey = smallImageKey
    if (smallImageText) rpcData.smallImageText = smallImageText

    get().rpc.setActivity(rpcData).catch(console.error)
  },
  define(data) {
    set({
      ...data
    })
    get().update()
  }
}))
