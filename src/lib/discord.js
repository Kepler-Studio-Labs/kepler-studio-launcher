import DiscordRPC from 'discord-rpc'

const clientId = '1359083970154725525'

export const RPC_PRESETS = {
  MAIN_MENU: {
    details: 'Menu principal',
    state: null,
    largeImageKey: 'keplerbg',
    largeImageText: 'Kepler Studio Launcher',
    smallImageKey: 'idle',
    smallImageText: 'Menu principal',
    startTimestamp: new Date()
  },
  COBBLEMON_PLAYING: {
    details: 'Cobblemon: New Era',
    state: 'En jeu',
    largeImageKey: 'pokeball',
    largeImageText: 'Cobblemon: New Era',
    smallImageKey: 'keplerbg',
    smallImageText: 'En jeu',
    startTimestamp: new Date()
  },
  SURVIE_COPAINS_PLAYING: {
    details: 'La survie des copains',
    state: 'En jeu',
    largeImageKey: 'endereye',
    largeImageText: 'La survie des copains',
    smallImageKey: 'keplerbg',
    smallImageText: 'En jeu',
    startTimestamp: new Date()
  },
  COBBLEMON_LEGACY_PLAYING: {
    details: 'Cobblemon: New Era (Legacy)',
    state: 'En jeu',
    largeImageKey: 'pokeball',
    largeImageText: 'Cobblemon: New Era (Legacy)',
    smallImageKey: 'keplerbg',
    smallImageText: 'En jeu',
    startTimestamp: new Date()
  }
}

export class DiscordRPCInstance {
  constructor() {
    this.data = {
      ...RPC_PRESETS.MAIN_MENU
    }

    DiscordRPC.register(clientId)
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' })

    this.rpc.on('ready', () => {
      this.refresh()
      setInterval(() => {
        this.refresh()
      }, 20 * 1000)
    })

    this.rpc.login({ clientId }).catch(console.error)
  }

  refresh() {
    try {
      const rpcData = {
        instance: false,
        startTimestamp: this.data.startTimestamp
      }

      if (this.data.details) rpcData.details = this.data.details
      if (this.data.state) rpcData.state = this.data.state
      if (this.data.largeImageKey) rpcData.largeImageKey = this.data.largeImageKey
      if (this.data.largeImageText) rpcData.largeImageText = this.data.largeImageText
      if (this.data.smallImageKey) rpcData.smallImageKey = this.data.smallImageKey
      if (this.data.smallImageText) rpcData.smallImageText = this.data.smallImageText

      this.rpc.setActivity(rpcData)
    } catch (error) {
      console.error(error)
    }
  }

  update(data) {
    this.data = {
      ...this.data,
      ...data
    }
    this.refresh()
  }
}
