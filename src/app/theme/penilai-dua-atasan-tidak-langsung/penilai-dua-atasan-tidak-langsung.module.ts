import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenilaiDuaAtasanTidakLangsungComponent } from './penilai-dua-atasan-tidak-langsung.component';
import { PenilaiDuaAtasanTidakLangsungRoutingModule } from './penilai-dua-atasan-tidak-langsung-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { TupTpaPagesModule } from '../tup-tpa-pages/tup-tpa-pages.module';

@NgModule({
  declarations: [PenilaiDuaAtasanTidakLangsungComponent],
  imports: [
    CommonModule,
    PenilaiDuaAtasanTidakLangsungRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TupTpaPagesModule
  ]
})
export class PenilaiDuaAtasanTidakLangsungModule { }
