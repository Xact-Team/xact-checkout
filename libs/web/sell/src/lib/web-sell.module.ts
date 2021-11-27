import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SellComponent } from './sell.component'
import { SharedUiPageModule } from '@xact-checkout/shared/ui/page'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { SharedUiIconModule } from '@xact-checkout/shared/ui/icon'
import { TooltipModule } from 'ng2-tooltip-directive'
import { NgxSpinnerModule } from 'ngx-spinner'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    FormsModule,
    SharedUiPageModule,
    SharedUiIconModule,
    NgxSpinnerModule,
    TooltipModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SellComponent,
      },
    ]),
    SweetAlert2Module,
  ],
  declarations: [SellComponent],
})
export class WebSellModule {}
