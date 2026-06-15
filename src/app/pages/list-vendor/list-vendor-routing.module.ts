import { NgModule } from '@angular/core';
import { ListVendorComponent } from './list-vendor.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ListVendorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListVendorRoutingModule { }
