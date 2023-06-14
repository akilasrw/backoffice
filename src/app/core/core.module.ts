import { PositionPipe } from './pipes/position.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';



@NgModule({
  declarations: [
    NotFoundComponent,
    SideNavComponent,
    ServerErrorComponent,
    PositionPipe,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    SideNavComponent,
    PositionPipe,
    TimeAgoPipe,
  ]
})
export class CoreModule { }
