import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EntryComponent } from './components/entry/entry.component';
import { EntryModalComponent } from './components/entry-modal/entry-modal.component';

@NgModule({
  declarations: [
    SidebarComponent,
    MainLayoutComponent,
    CalendarComponent,
    EntryComponent,
    EntryModalComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    SidebarComponent,
    RouterModule,
    MainLayoutComponent,
    CalendarComponent,
    EntryComponent,
    EntryModalComponent,
  ],
})
export class SharedModule {}
