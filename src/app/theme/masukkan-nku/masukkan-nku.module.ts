import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasukkanNkuComponent } from './masukkan-nku.component';
import { MasukkanNkuRoutingModule } from './masukkan-nku-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [MasukkanNkuComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DataTablesModule,
    MasukkanNkuRoutingModule
  ]
})
export class MasukkanNkuModule { }
