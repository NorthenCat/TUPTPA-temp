import { NgModule } from '@angular/core';
import { AdminUniversitasComponent } from './vendor.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminUniversitasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUniversitasRoutingModule { }
