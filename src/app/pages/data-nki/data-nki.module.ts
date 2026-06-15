import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataNkiComponent } from './data-nki.component';
import { DataNkiRoutingModule } from './data-nki-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [DataNkiComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DataTablesModule,
    DataNkiRoutingModule
  ]
})
export class DataNkiModule { }
