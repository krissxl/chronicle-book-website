import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EntryComponent } from './components/entry/entry.component';
import { EntryModalComponent } from './components/entry-modal/entry-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { FontPrefDirective } from './directives/font-pref.directive';
import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [
    SidebarComponent,
    MainLayoutComponent,
    CalendarComponent,
    EntryComponent,
    EntryModalComponent,
    LoaderComponent,
    ErrorMessageComponent,
    FontPrefDirective,
    MarkdownPipe
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    SidebarComponent,
    RouterModule,
    MainLayoutComponent,
    CalendarComponent,
    EntryComponent,
    EntryModalComponent,
    LoaderComponent,
    ErrorMessageComponent,
    FontPrefDirective
  ],
})
export class SharedModule {}
