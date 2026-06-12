import { NgModule } from '@angular/core';
import { ManajemenTemplateComponent } from './manajemen-template.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: ManajemenTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManajemenTemplateRoutingModule { }
