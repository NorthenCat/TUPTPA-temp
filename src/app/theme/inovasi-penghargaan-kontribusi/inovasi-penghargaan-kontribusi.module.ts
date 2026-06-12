import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InovasiPenghargaanKontribusiComponent } from './inovasi-penghargaan-kontribusi.component';
import { InovasiPenghargaanKontribusiRoutingModule } from './inovasi-penghargaan-kontribusi-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [InovasiPenghargaanKontribusiComponent],
  imports: [
    CommonModule,
    InovasiPenghargaanKontribusiRoutingModule,
    SharedModule, 
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class InovasiPenghargaanKontribusiModule { }
