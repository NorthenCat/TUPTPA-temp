import { NgModule } from '@angular/core';
import { InovasiPenghargaanKontribusiComponent } from './inovasi-penghargaan-kontribusi.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: InovasiPenghargaanKontribusiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InovasiPenghargaanKontribusiRoutingModule { }
