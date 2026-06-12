import { NgModule } from '@angular/core';
import { SikapKerjaComponent } from './sikap-kerja.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SikapKerjaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SikapKerjaRoutingModule { }
