import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManajemenDataDetailComponent } from './manajemen-data-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ManajemenDataDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManajemenDataDetailRoutingModule {}
