import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { ImmerComponentStore } from 'ngrx-immer/component-store'
import { delay, tap } from 'rxjs/operators'
import { tapResponse } from '@ngrx/component-store'
import { NFT, UserAccount } from '@xact-wallet-sdk/client'

interface UserState {
  user: UserAccount | null;
  isLoading: boolean;
}

const LS_USER_KEY = '@@CHECKOUT/user';

@Injectable({ providedIn: 'root' })
export class UserStore extends ImmerComponentStore<UserState> {
  private readonly body: HTMLElement

  constructor(@Inject(DOCUMENT) private document: Document) {
    super({
      user: null,
      isLoading: false,
    })
    this.body = this.document.body
    this.initializeEffect()
  }

  readonly user$ = this.select((s) => s.user)
  readonly isLoading$ = this.select((s) => s.isLoading)

  readonly vm$ = this.select(({
                                user,
                                isLoading,
                              }) => ({
    user, isLoading,
  }))

  readonly initializeEffect = this.effect(($) =>
    $.pipe(
      tap(() => {
        const userStorage = localStorage.getItem(LS_USER_KEY)
        if (userStorage) {
          const user = JSON.parse(userStorage)
          this.patchState({ user: user as UserAccount })
        }
      })
    ),
  )

  readonly updateUser = this.updater<UserAccount | null>((state, user) => {
    state.user = user
  })

  readonly updateIsLoading = this.updater<boolean>((state, isLoading) => {
    state.isLoading = isLoading
  })

  readonly setUserEffect = this.effect<UserAccount>((user$) =>
    user$.pipe(
      tap(() => this.updateIsLoading(true)),
      tapResponse((user: UserAccount) => {
        if(user.nft) {
          user.nft = user.nft.sort((a: NFT, b: NFT) => !!b.nftIdsForSale as any - (!!a.nftIdsForSale as any))
        }
        this.updateUser(user)
        localStorage.setItem(LS_USER_KEY, JSON.stringify(user))
      }, console.error),
      delay(2000),
      tap(() => {
        this.updateIsLoading(false);
      }),
    ),
  )

  readonly clearUserEffect = this.effect(($) =>
    $.pipe(
      tapResponse(() => {
        this.updateUser(null)
        localStorage.removeItem(LS_USER_KEY)
      }, console.error),
    ),
  )
}
