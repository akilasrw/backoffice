import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    SideNavComponent,
    ServerErrorComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    SideNavComponent
  ]
})
export class CoreModule { }
