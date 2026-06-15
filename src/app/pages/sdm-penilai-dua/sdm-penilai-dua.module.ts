import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdmPenilaiDuaComponent } from './sdm-penilai-dua.component';
import { SdmPenilaiDuaRoutingModule } from './sdm-penilai-dua-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { TupTpaPagesModule } from '../tup-tpa-pages/tup-tpa-pages.module';

@NgModule({
  declarations: [SdmPenilaiDuaComponent],
  imports: [
    CommonModule,
    SdmPenilaiDuaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TupTpaPagesModule
  ]
})
export class SdmPenilaiDuaModule { }
