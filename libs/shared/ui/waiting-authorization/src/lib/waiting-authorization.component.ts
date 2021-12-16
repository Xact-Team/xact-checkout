import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { DialogRef } from '@ngneat/dialog'
import { ConnectService } from '@xact-checkout/shared/ui/connect'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { ToastrService } from 'ngx-toastr'
import { UserStore } from '@xact-checkout/shared/data-access/user-store'
import { Router } from '@angular/router'
import { RequestValidation, SellNFTDto, StatusRequest } from '@xact-wallet-sdk/client'

@UntilDestroy()
@Component({
  selector: 'xact-checkout-waiting-authorization',
  templateUrl: './waiting-authorization.component.html',
  styles: [
    `
        ::ng-deep .ngneat-dialog-content {
            background: transparent !important;
            box-shadow: none !important;
            animation: none !important;
        }

        .spinner {
            animation: rotate 1.4s linear infinite;
            -webkit-animation: rotate 1.4s linear infinite;
            -moz-animation: rotate 1.4s linear infinite;
        }

        @keyframes rotate {
            to {
                transform: rotate(360deg);
            }
        }

        @-webkit-keyframes rotate {
            to {
                -webkit-transform: rotate(360deg);
            }
        }

        @-moz-keyframes rotate {
            to {
                transform: rotate(360deg);
            }
        }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingAuthorizationComponent implements OnInit {

  constructor(public ref: DialogRef,
              private readonly toastService: ToastrService,
              private readonly router: Router,
              private readonly userStore: UserStore,
              private readonly connectService: ConnectService) {
  }

  ngOnInit() {
    this.connectService.listenForDeletion()
      .pipe(untilDestroyed(this))
      .subscribe(async (req) => {
        try {
          this.ref.close()
          if (req.status === StatusRequest.ACCEPTED) {
            this.toastService.success('Your NFT has been withdraw !')
            const user = await this.connectService.refreshNFT(this.ref.data.accountId)
            user && this.userStore.setUserEffect(user)
            return this.router.navigateByUrl(`/app/home`)
          } else {
            this.toastService.success('Your have refused the request !')
            return this.router.navigateByUrl(`/home`)
          }
        } catch (e) {
          console.log('e', e)
          return
        }
      })
    this.connectService.listenForSellNFT()
      .pipe(untilDestroyed(this))
      .subscribe(async (nft: RequestValidation<SellNFTDto>) => {
        try {
          this.ref.close()
          if (nft.status === StatusRequest.ACCEPTED) {
            this.toastService.success('Your NFT is now on sale !')
            const user = await this.connectService.refreshNFT(this.ref.data.accountId)
            user && this.userStore.setUserEffect(user)
            return this.router.navigateByUrl(`/checkout/${nft.tokenId}`)
          } else {
            this.toastService.success('Your have refused the request !')
            return this.router.navigateByUrl(`/home`)
          }
        } catch (e) {
          console.log('e', e)
          return
        }
      })
  }

}
