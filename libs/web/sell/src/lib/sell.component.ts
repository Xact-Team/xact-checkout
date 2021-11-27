import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { ConnectService } from '@xact-checkout/shared/ui/connect'
import { UserStore } from '@xact-checkout/shared/data-access/user-store'
import { RequestService } from '@xact-checkout/shared/ui/waiting-authorization'
import { NFT, UserAccount } from '@xact-wallet-sdk/client'
import { NgxSpinnerService } from 'ngx-spinner'
import { IDropdownSettings } from 'ng-multiselect-dropdown'

@Component({
  selector: 'xact-checkout-sell',
  templateUrl: './sell.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellComponent implements OnInit {
  vm$ = this.userStore.vm$

  sellForm: FormGroup = this.fb.group({
    hbarAmount: ['', Validators.required],
    quantity: ['', Validators.required],
  })

  nft!: NFT

  //Multiselect dropdown
  dropdownList: any = []
  selectedItems = []
  dropdownSettings: IDropdownSettings = {}

  constructor(
    private readonly fb: FormBuilder,
    private readonly toastService: ToastrService,
    private readonly userStore: UserStore,
    private readonly spinner: NgxSpinnerService,
    private readonly requestService: RequestService,
    private readonly connectService: ConnectService,
    private readonly router: Router,
  ) {
    this.nft = { ...this.router.getCurrentNavigation()?.extras.state?.nft }
    if (Object.keys(this.nft).length === 0) {
      this.router.navigateByUrl('/')
    } else {
      if (this.nft.forSale) {
        this.sellForm.patchValue({ ...this.nft.forSale })
      }
    }
  }

  ngOnInit(): void {
    //MultiSelect init
    this.dropdownList = this.nft['nftIds']
    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
    }
  }

  get hbarAmount() {
    return this.sellForm.get('hbarAmount')!.value
  }

  async sell(user: UserAccount) {
    try {
      if (this.sellForm.get('quantity')?.value > this.nft.supply) {
        this.toastService.error(`Note: the max quantity must be ${this.nft.supply}`)
        return
      }
      await this.spinner.show()
      await this.connectService.sellNFT({
        fromAccountId: user.accountId,
        quantity: this.sellForm.get('quantity')?.value,
        hbarAmount: this.sellForm.get('hbarAmount')?.value,
        tokenId: this.nft.tokenId,
      })
      await this.spinner.hide()
      this.requestService.open({
        title: 'Waiting for request Validation...',
        subtitle: 'Please Validate the Request from Xact Wallet',
        accountId: user.accountId,
      })
    } catch (e) {
      await this.spinner.hide()
      this.toastService.error(e.error ? e.error.error : 'Sorry an internal error occurred!')
    }
  }

  async delete(user: UserAccount) {
    try {
      await this.spinner.show()
      await this.connectService.deleteNFT(this.nft.tokenId)
      this.requestService.open({
        title: 'Waiting for request Validation...',
        subtitle: 'Please Validate the Request from Xact Wallet',
        accountId: user.accountId,
      })
      await this.spinner.hide()
    } catch (e) {
      await this.spinner.hide()
      this.toastService.error(e.error ? e.error.error : 'Sorry an internal error occurred!')
    }
  }

  onItemSelect(item: any) {
    console.log(this.selectedItems)
  }

  onDeSelect(item: any) {
    console.log(this.selectedItems)
  }
}
