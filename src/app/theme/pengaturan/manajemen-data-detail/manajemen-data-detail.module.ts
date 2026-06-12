import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManajemenDataDetailComponent } from './manajemen-data-detail.component';
import { ManajemenDataDetailRoutingModule } from './manajemen-data-detail-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ManajemenDataDetailComponent],
  imports: [
    CommonModule,
    ManajemenDataDetailRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class ManajemenDataDetailModule { }
