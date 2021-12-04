import { Injectable } from '@angular/core'
import { DialogService } from '@ngneat/dialog'
import { ConnectComponent } from './connect.component'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable, of, switchMap } from 'rxjs'
import { Socket } from 'ngx-socket-io'
import {
  NFTForSale,
  RemoveNFTDto,
  RequestValidation,
  ScopeEnum,
  SellNFTDto,
  UserAccount,
} from '@xact-wallet-sdk/client'
import { environment } from '@xact-checkout/root/environments'

@Injectable({
  providedIn: 'root',
})
export class ConnectService {
  dialogRef: any
  socketId!: string

  constructor(private readonly dialog: DialogService,
              private readonly socket: Socket,
              private readonly http: HttpClient) {
    this.connectSocket()
  }

  open() {
    this.dialogRef = this.dialog.open(ConnectComponent, {
      closeButton: false,
      enableClose: false,
      size: 'fullScreen',
    })
  }

  close() {
    if (this.dialogRef) {
      this.dialogRef.close()
      this.dialogRef = null
    }
  }

  connectSocket() {
    this.socket.connect()
    this.socket.on('xactCheckout.connexion', (socketId: string) => {
      this.socketId = socketId
    })
  }

  getQrCode(): Observable<any> {
    return this.http.get<string>(`${environment.API}/sdk/getQrCode/${this.socketId}`,
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        responseType: 'text',
      })
  }

  listenForAuth(): Observable<RequestValidation<UserAccount>> {
    return new Observable(observer => {
      this.socket.on('xactCheckout.auth', (user: RequestValidation<UserAccount>) => {
        observer.next(user)
      })
    })
  }

  listenForSellNFT(): Observable<RequestValidation<SellNFTDto>> {
    return new Observable(observer => {
      this.socket.on('xactCheckout.sell', (nft: RequestValidation<SellNFTDto>) => {
        observer.next(nft)
      })
    })
  }

  listenForDeletion(): Observable<RequestValidation<RemoveNFTDto>> {
    return new Observable(observer => {
      this.socket.on('xactCheckout.remove', (nft: RequestValidation<RemoveNFTDto>) => {
        observer.next(nft)
      })
    })
  }

  sellNFT(data: SellNFTDto): Promise<string | undefined> {
    return this.http.post<string>(`${environment.API}/sdk/sell-nft`, {
      ...data,
      socketId: this.socketId,
    }).toPromise()
  }

  deleteNFT(tokenId: string, nftIds: Array<string>): Promise<string | undefined> {
    return this.http.post<string>(`${environment.API}/sdk/delete-nft/${tokenId}?socketId=${this.socketId}`, {
      nftIds
    }).toPromise()
  }

  refreshNFT(accountId: string): Promise<UserAccount | undefined> {
    return this.http.post<UserAccount>(`${environment.API}/sdk/refresh`, {
      accountId,
      scope: [ScopeEnum.PROFILE, ScopeEnum.NFT],
    }).toPromise()
  }

  getNFTForSale(tokenId: string, nftId: string): Observable<NFTForSale & { media: string } | null> {
    return this.http.get<NFTForSale>(`${environment.API}/sdk/nft-for-sale?tokenId=${tokenId}&nftId=${nftId}`).pipe(
      switchMap(res => {
        if (!res.nft) {
          return of(null)
        }
        return this.http.get(res.nft.url).pipe(
          catchError(err => {
            return of({
              ...res,
            })
          }),
          map(
            (nft: any) => {
              return {
                ...res,
                media: nft.photo ? nft.photo : nft.nft.url,
              }
            },
          ),
        )
      }),
    )
  }

}
