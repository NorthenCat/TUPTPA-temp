import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdmPenilaiSatuComponent } from './sdm-penilai-satu.component';
import { SdmPenilaiSatuRoutingModule } from './sdm-penilai-satu-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { TupTpaPagesModule } from '../tup-tpa-pages/tup-tpa-pages.module';

@NgModule({
  declarations: [SdmPenilaiSatuComponent],
  imports: [
    CommonModule,
    SdmPenilaiSatuRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TupTpaPagesModule
  ]
})
export class SdmPenilaiSatuModule { }
