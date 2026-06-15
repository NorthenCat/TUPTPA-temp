import { NgModule } from '@angular/core';
import { AgendaPenilaianComponent } from './agenda-penilaian.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AgendaPenilaianComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaPenilaianRoutingModule { }
