import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPageComponent } from './app-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MainLayoutComponent } from '../shared/components/main-layout/main-layout.component';
import { AuthGuard } from '../auth.guard';
import { EntryComponent } from './entry/entry.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AppPageComponent,
      },
      {
        path: 'entry',
        component: EntryComponent
      }
    ],
  },
];

@NgModule({
  declarations: [AppPageComponent, EntryComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, FormsModule],
  exports: [RouterModule],
})
export class AppPageModule {}
