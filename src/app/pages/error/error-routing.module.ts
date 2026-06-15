import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        loadChildren: './404/404.module#NotFoundModule'
      },
      {
        path: '403',
        loadChildren: './403/403.module#ForbiddenModule'
      },
      {
        path: 'maintenance',
        loadChildren: './maintenance/maintenance.module#MaintenanceModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
