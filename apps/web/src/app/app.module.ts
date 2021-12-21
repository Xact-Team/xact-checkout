import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { WebShellModule } from '@xact-checkout/web/shell'
import { RouterModule } from '@angular/router'
import { DialogModule } from '@ngneat/dialog'
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io'
import { ToastrModule } from 'ngx-toastr'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { environment } from '@xact-checkout/root/environments'
import { NgxSpinnerModule } from 'ngx-spinner'

const config: SocketIoConfig = {
  url: environment.API_SOCKET, options: {
    transports: ['polling'],
  },
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    WebShellModule,
    SocketIoModule.forRoot(config),
    DialogModule.forRoot({
      sizes: {
        sm: {
          width: '300px',
          height: '250px',
        },
      },
    }),
    SweetAlert2Module.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
