import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    SideNavComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    SideNavComponent
  ]
})
export class CoreModule { }
