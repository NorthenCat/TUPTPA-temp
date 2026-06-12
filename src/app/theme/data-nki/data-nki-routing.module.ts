import { NgModule } from '@angular/core';
import { DataNkiComponent } from './data-nki.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DataNkiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataNkiRoutingModule { }
