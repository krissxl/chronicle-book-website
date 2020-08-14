import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { CalendarComponent } from './components/calendar/calendar.component';


@NgModule({
  declarations: [SidebarComponent, MainLayoutComponent, MainLayoutComponent, CalendarComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    SidebarComponent,
    RouterModule,
    MainLayoutComponent,
    CalendarComponent
  ]
})
export class SharedModule { }
