import { RouterTestingModule } from '@angular/router/testing'
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'

import { HomeComponent } from './home.component'

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [RouterTestingModule],
    providers: [
    ],
    shallow: true,
  })

  beforeEach(() => {
    spectator = createComponent()
  })

  it('should create', () => {
    expect(spectator.component).toBeTruthy()
  })
})
