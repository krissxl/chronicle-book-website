import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPageComponent } from './app-page.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MainLayoutComponent } from '../shared/components/main-layout/main-layout.component';
import { AuthGuard } from '../auth.guard';
import { EntryPageComponent } from './entry/entry-page.component';
import { FormsModule } from '@angular/forms';
import { SearchPageComponent } from './search-page/search-page.component';
import { YearPageComponent } from './year-page/year-page.component';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';

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
        component: EntryPageComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
      {
        path: 'year',
        component: YearPageComponent,
      },
      {
        path: 'preferences',
        component: PreferencesPageComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    AppPageComponent,
    EntryPageComponent,
    SearchPageComponent,
    YearPageComponent,
    PreferencesPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
  ],
  exports: [RouterModule],
})
export class AppPageModule {}
