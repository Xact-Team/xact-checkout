import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core'
import { NFT } from '@xact-wallet-sdk/client'
import { HttpClient } from '@angular/common/http'
import { map, Observable, of } from 'rxjs'
import { IDropdownSettings } from 'ng-multiselect-dropdown'
import { Router } from '@angular/router'
import { UserStore } from '@xact-checkout/shared/data-access/user-store'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mime = require('mime')

@Component({
  selector: 'xact-checkout-home-tile',
  templateUrl: './home-tile.component.html',
  styles: [
    ``,
  ],
})
export class HomeTileComponent implements OnInit {
  user$ = this.userStore.user$;
  @Input() nft!: any;
  @Output() sellNFT: EventEmitter<NFT> = new EventEmitter<NFT>()

  media$!: Observable<string>
  type: string | null = null
  // Multiselect dropdown
  dropdownList: any = []
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: "item_id",
    textField: "item_text",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  }
  royalties = 0;
  constructor(private readonly http: HttpClient,
              private readonly userStore: UserStore,
              private readonly router: Router) {
  }


  ngOnInit() {
    if (Array.isArray(this.nft.royalties)) {
      this.royalties = +this.nft.royalties.map((el: any) => el.numerator).reduce((a: number, b: number) => a + b, 0)
    }
    if (this.nft.nftIdsForSale) {
      this.selectedItems.push(this.nft.nftIdsForSale[0].nftId);
      this.dropdownList = this.nft.nftIdsForSale.map((el: any) => el.nftId);
    }
    if (this.nft.cid) {
      this.media$ = this.http.get(this.nft.url)
        .pipe(
          map((res: any) => {
            if (res.photo) {
              HomeTileComponent.getTypeNft(res.photo).then(type => this.type = type);
              return res.photo;
            }
          }),
        )
    } else if (this.nft.url) {
      HomeTileComponent.getTypeNft(this.nft.url).then(type => {
        this.type = type;
        this.media$ = of(this.nft.url);
      });
    } else {
      this.media$ = of('https://images.unsplash.com/photo-1506792006437-256b665541e2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=334&amp;q=80')
    }
  }

  static async getTypeNft(link: any): Promise<string> {
    if (link && typeof link === 'string' && link.includes('audio')) {
      return 'audio'
    } else if (link && typeof link === 'string' && link.includes('video')) {
      return 'video'
    } else if (link && typeof link === 'string' && link.includes('application/pdf')) {
      return 'file'
    } else if (link && typeof link === 'string' && (link.includes('image') || link.includes('gif'))) {
      return 'image'
    } else if (link && typeof link === 'string' && (link.includes('model/gltf-binary')
      || link.includes('.glb') || link.includes('.gltf') || link.includes('.usdz'))) {
      return '3D'
    } else if (link && typeof link === 'string' && link.includes('https')) {
      const type = mime.getType(link)
      return this.getTypeNft(type)
    } else {
      return 'any'
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
      case 'any':
        return 'https://firebasestorage.googleapis.com/v0/b/xact-wallet.appspot.com/o/public%2Fany.svg?alt=media&token=57a60ead-91ba-4deb-859e-6c45990c4e75'
      default:
        return 'https://firebasestorage.googleapis.com/v0/b/xact-wallet.appspot.com/o/public%2Fany.svg?alt=media&token=57a60ead-91ba-4deb-859e-6c45990c4e75'
    }
  }

  redirectCheckout(tokenId: string, accountId: string, selectedItems: any) {
    if (selectedItems) {
      window.open(`/checkout/${tokenId}/${accountId}/${selectedItems}`, '_blank');
    } else {
      window.open(`/checkout/${tokenId}/${accountId}`, '_blank');
    }
  }

  sellHandler(nft: NFT) {
    this.sellNFT.emit(nft)
  }
}
