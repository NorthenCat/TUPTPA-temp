import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUniversitasComponent } from './vendor.component';
import { AdminUniversitasRoutingModule } from './vendor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [AdminUniversitasComponent],
  imports: [
    CommonModule,
    AdminUniversitasRoutingModule,
    DataTablesModule,
    SharedModule
  ]
})
export class AdminUniversitasModule { }
