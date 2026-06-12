import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PegawaiComponent } from './pegawai.component';
import { PegawaiRoutingModule } from './pegawai-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { TupTpaPagesModule } from '../tup-tpa-pages/tup-tpa-pages.module';
import { PegawaiTargetKinerjaPegawaiComponent } from './target-kinerja-pegawai/target-kinerja-pegawai.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PegawaiComponent, PegawaiTargetKinerjaPegawaiComponent],
  imports: [
    CommonModule,
    PegawaiRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TupTpaPagesModule,
    NgbDropdownModule
  ]
})
export class PegawaiModule { }
