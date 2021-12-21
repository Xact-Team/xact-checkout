import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, Observable, of, tap } from 'rxjs'
import { NFTForSale } from '@xact-wallet-sdk/client'
import { ConnectService } from '@xact-checkout/shared/ui/connect'
import { HomeTileComponent } from '../../../home/ui/tile/src/lib/home-tile.component'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'xact-checkout-checkout',
  templateUrl: './checkout.component.html',
  styles: [
    `
        :host {
            display: block;
        }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  tokenId: string;
  nftId: string;
  accountId: string;
  nft$!: Observable<any>
  type!: string
  emptyNFT = false
  royalties = 0;
  constructor(private readonly route: ActivatedRoute,
              private readonly connectService: ConnectService,
              private readonly cd: ChangeDetectorRef,
              private readonly spinner: NgxSpinnerService,
              private readonly router: Router) {
    this.spinner.show().catch();
    this.tokenId = this.route.snapshot.paramMap.get('tokenId') as string;
    this.accountId = this.route.snapshot.paramMap.get('accountId') as string;
    this.nftId = this.route.snapshot.paramMap.get('nftId') as string;
    if (!this.tokenId) {
      this.router.navigate(['/'])
      return
    } else {
      this.nft$ = this.connectService.getNFTForSale(this.tokenId,this.accountId, this.nftId).pipe(
        tap((nft: any) => {
          if (Array.isArray(nft.nft.royalties)) {
            this.royalties = +nft.nft.royalties.map((el: any) => el.numerator).reduce((a: number, b: number) => a + b, 0)
          }
          if (nft) {
            HomeTileComponent.getTypeNft(nft.media).then((type)=>{
              this.type = type;
            })
          } else {
            this.emptyNFT = true;
          }
          this.spinner.hide().catch();
          this.cd.detectChanges();
        }),
        catchError(err => {
          this.spinner.hide().catch();
          this.emptyNFT = true;
          return of(err);
        })
      )
    }
  }

  getTypeImage(type: string) {
    switch (type) {
      case 'audio':
        return 'https://firebasestorage.googleapis.com/v0/b/xact-wallet.appspot.com/o/public%2Faudio.svg?alt=media&token=32bd76c9-f3f6-4001-a841-6f75d5142afe'
      case 'video':
        return 'https://firebasestorage.googleapis.com/v0/b/xact-wallet.appspot.com/o/public%2Fvideo.svg?alt=media&token=d05c960a-9eaf-4a85-b10a-31623994956a'
      case 'file':
        return 'https://firebasestorage.googleapis.com/v0/b/xact-wallet.appspot.com/o/public%2Ffile.svg?alt=media&token=e8a647db-c829-4324-b1ee-d7a419aeaaf8'
      default:
        return 'https://firebasestorage.googleapis.com/v0/b/xact-wallet.appspot.com/o/public%2Fany.svg?alt=media&token=57a60ead-91ba-4deb-859e-6c45990c4e75'
    }
  }

}
