import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPenilaianPegawaiComponent } from './edit-penilaian-pegawai.component';
import { EditPenilaianPegawaiRoutingModule } from './edit-penilaian-pegawai-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EditPenilaianPegawaiComponent],
  imports: [
    CommonModule,
    EditPenilaianPegawaiRoutingModule,
    SharedModule
  ]
})
export class EditPenilaianPegawaiModule { }
