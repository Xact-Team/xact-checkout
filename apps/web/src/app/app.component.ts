import { Component } from '@angular/core'

@Component({
  selector: 'xact-checkout-root',
  template: '<ngx-spinner color="#7465F0" bdColor="rgba(51,51,51,0.8)" size="medium" type="pacman"></ngx-spinner><router-outlet></router-outlet>',
})
export class AppComponent {
}
