import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListVendorComponent } from './list-vendor.component';
import { ListVendorRoutingModule } from './list-vendor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ListVendorComponent],
  imports: [
    CommonModule,
    ListVendorRoutingModule,
    SharedModule,
    DataTablesModule,
    NgbDropdownModule
  ]
})
export class ListVendorModule { }
