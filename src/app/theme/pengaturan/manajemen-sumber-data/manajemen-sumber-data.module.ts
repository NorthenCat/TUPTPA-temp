import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManajemenSumberDataComponent } from './manajemen-sumber-data.component';
import { ManajemenSumberDataRoutingModule } from './manajemen-sumber-data-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ManajemenSumberDataComponent],
  imports: [
    CommonModule,
    ManajemenSumberDataRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class ManajemenSumberDataModule { }
