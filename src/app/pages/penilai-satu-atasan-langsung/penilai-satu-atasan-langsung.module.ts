import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenilaiSatuAtasanLangsungComponent } from './penilai-satu-atasan-langsung.component';
import { PenilaiSatuAtasanLangsungRoutingModule } from './penilai-satu-atasan-langsung-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { TupTpaPagesModule } from '../tup-tpa-pages/tup-tpa-pages.module';

@NgModule({
  declarations: [PenilaiSatuAtasanLangsungComponent],
  imports: [
    CommonModule,
    PenilaiSatuAtasanLangsungRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TupTpaPagesModule
  ]
})
export class PenilaiSatuAtasanLangsungModule { }
