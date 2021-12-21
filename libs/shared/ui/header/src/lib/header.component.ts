import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiStore } from '@xact-checkout/shared/data-access/ui-store'
import { ConnectService } from '@xact-checkout/shared/ui/connect'
import { NavItem } from '@xact-checkout/shared/data-access/models'
import { UserStore } from '@xact-checkout/shared/data-access/user-store'
import { BehaviorSubject, map, take } from 'rxjs'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'xact-checkout-header',
  templateUrl: './header.component.html',
  styles: [
    `
        :host {
            display: block;
        }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  navItems$ = this.service.navItems$.pipe(map((navItems: NavItem[]) => navItems.filter((navItem) => !navItem.hideOnNavbar)))
  user$ = this.userStore.user$
  vm$ = this.service.vm$
  animateIcon = new BehaviorSubject(false)
  animateIcon$ = this.animateIcon.asObservable()

  constructor(private readonly service: UiStore,
              private readonly userStore: UserStore,
              private readonly toastService: ToastrService,
              private readonly spinner: NgxSpinnerService,
              private readonly connectService: ConnectService) {
    this.user$.pipe(take(1)).toPromise().then(async (user: any) => {
      if (user) {
        this.spinner.show().catch()
        await this.refresh(user.accountId)
      }
    })
  }

  connect() {
    return this.connectService.open()
  }

  toggleDarkMode(): void {
    this.service.toggleTheme()
  }


  logout() {
    this.userStore.clearUserEffect()
  }

  async refresh(accountId: string) {
    try {
      if (this.animateIcon.value) {
        return
      }
      this.animateIcon.next(true)
      const user = await this.connectService.refreshNFT(accountId)
      user && this.userStore.setUserEffect(user)
      this.animateIcon.next(false)
      this.spinner.hide().catch()
      this.toastService.success('your Account is now up to date')
    } catch (e) {
      this.spinner.hide().catch()
      this.animateIcon.next(false)
      this.toastService.error('Sorry an internal error occurred!')
      console.error(e)
    }
  }
}
