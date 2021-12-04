import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeTileComponent } from './home-tile.component'
import { RouterModule } from '@angular/router'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { FormsModule } from '@angular/forms'

@NgModule({
  imports: [CommonModule, RouterModule, NgMultiSelectDropDownModule, FormsModule],
  declarations: [
    HomeTileComponent,
  ],
  exports: [
    HomeTileComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class WebHomeUiTileModule {
}
