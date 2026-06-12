import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaPenilaianComponent } from './agenda-penilaian.component';
import { AgendaPenilaianRoutingModule } from './agenda-penilaian-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AgendaPenilaianComponent],
  imports: [
    CommonModule,
    AgendaPenilaianRoutingModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AgendaPenilaianModule { }
