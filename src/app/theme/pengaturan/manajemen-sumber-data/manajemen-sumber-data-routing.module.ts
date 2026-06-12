import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManajemenSumberDataComponent } from './manajemen-sumber-data.component';

const routes: Routes = [
  {
    path: '',
    component: ManajemenSumberDataComponent
  },
  {
    path: 'detail/:id',
    loadChildren: '../manajemen-data-detail/manajemen-data-detail.module#ManajemenDataDetailModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManajemenSumberDataRoutingModule {}
