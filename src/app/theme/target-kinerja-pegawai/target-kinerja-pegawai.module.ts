// target-kinerja-pegawai.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetKinerjaPegawaiComponent } from './target-kinerja-pegawai.component';
import { TargetKinerjaPegawaiRoutingModule } from './target-kinerja-pegawai-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TargetKinerjaPegawaiComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbDropdownModule,
    SharedModule,
    TargetKinerjaPegawaiRoutingModule
  ]
})
export class TargetKinerjaPegawaiModule {}
