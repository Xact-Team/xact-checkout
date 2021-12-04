import { Injectable } from '@nestjs/common'
import { AppConfig } from '@xact-checkout/api/configuration'
import { InjectAppConfig } from '@xact-checkout/api/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Client, DebugLevel, NFTForSale, RefreshAccountDTO, ScopeEnum, SellNFTDto } from '@xact-wallet-sdk/client'

@Injectable()
export class SdkService {
  client

  constructor(@InjectAppConfig() readonly appConfig: AppConfig,
              private readonly eventEmitter: EventEmitter2) {
  }

  /* Init Client */
  async initClient() {
    this.client = new Client({
      apiKey: this.appConfig.sdkApi,
      options: {
        debugLevel: DebugLevel.DEBUG,
        apiUrl: 'https://api.dev.xact.ac/v1',
        socketUrl: 'https://api.dev.xact.ac',
      },
    })
    await this.client.initConnexion()
    /* Listeners */
    this.listenToAuthEvent()
    this.listenToSellEvent()
    this.listenToBuyEvent()
    this.listenToRemoveSaleEvent()
  }

  /* Get QR Code */
  async getQrCode(socketId: string): Promise<string> {
    if (!this.client) {
      await this.initClient()
    }
    const qrCode = await this.client.generateQRCode({
      socketId,
      scope: [ScopeEnum.PROFILE, ScopeEnum.NFT],
    })
    return qrCode
  }

  /* Listen to new Auth Event */
  listenToAuthEvent() {
    this.client.connect().subscribe(user => {
      this.eventEmitter.emit('xactCheckout.auth', user)
    })
  }

  /* Sell a NFT */
  async sellNFT(opts: SellNFTDto): Promise<void> {
    if (!this.client) {
      await this.initClient()
    }
    return this.client.sellNFT(opts)
  }

  /* Listen to new Sell Event */
  listenToSellEvent() {
    this.client.sellNFTValidation().subscribe(nft => {
      this.eventEmitter.emit('xactCheckout.sell', nft)
    })
  }

  /* Refresh User's Account */
  async refresh(opts: RefreshAccountDTO) {
    if (!this.client) {
      await this.initClient()
    }
    return this.client.refreshAccount(opts)
  }

  async getNFTForSale(tokenId: string): Promise<NFTForSale> {
    if (!this.client) {
      await this.initClient()
    }
    return this.client.getNFTForSaleByTokenId({ tokenId })
  }

  /* Listen To new Buy Event */
  listenToBuyEvent() {
    this.client.buyNFTValidation().subscribe(nft => {
      this.eventEmitter.emit('xactCheckout.buy', nft)
    })
  }


  async removeFromSale(tokenId: string, nftIds: Array<string>, socketId: string) {
    if (!this.client) {
      await this.initClient()
    }
    return this.client.deleteNFTFromSale({ tokenId, socketId, nftIds })
  }

  private listenToRemoveSaleEvent() {
    this.client.deleteSellNFTValidation().subscribe((nft) => {
      this.eventEmitter.emit('xactCheckout.remove', nft)
    })
  }
}
