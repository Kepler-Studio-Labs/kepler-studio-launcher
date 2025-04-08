import DiscordRPC from 'discord-rpc'

const clientId = '1359083970154725525'

const defaultActivity = {
  details: 'Menu principal',
  state: null,
  largeImageKey: 'keplerbg',
  largeImageText: 'Kepler Studio Launcher',
  smallImageKey: null,
  smallImageText: null,
  startTimestamp: new Date()
}

export class DiscordRPCInstance {
  constructor() {
    this.data = {
      ...defaultActivity
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

    this.rpc.setActivity(rpcData).catch(console.error)
  }

  update(data) {
    this.data = {
      ...this.data,
      ...data
    }
    this.refresh()
  }
}
