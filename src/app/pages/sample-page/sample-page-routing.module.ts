import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/_classes/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'form-table',
        pathMatch: 'full'
      },
      {
        path: 'form-table',
        loadChildren: './form-table/form-table.module#FormTableModule',
        data: {animation: '2'}
      },
      {
        path: 'component',
        loadChildren: './component/component.module#ComponentModule',
        data: {animation: '3'}
      },
      {
        path: 'blank-page',
        // canActivate: [AdminGuard],
        loadChildren: './blank-page/blank-page.module#BlankPageModule',
        data: {animation: '4'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplePageRoutingModule { }
