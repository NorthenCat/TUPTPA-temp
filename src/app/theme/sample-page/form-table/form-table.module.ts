import { FormTableRoutingModule } from './form-table-routing.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormTableComponent } from './form-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [FormTableComponent],
  imports: [
    CommonModule,
    ToastyModule.forRoot(),
    FormTableRoutingModule,
    DataTablesModule,
    SharedModule,
    NgbDropdownModule
  ]
})
export class FormTableModule { }
