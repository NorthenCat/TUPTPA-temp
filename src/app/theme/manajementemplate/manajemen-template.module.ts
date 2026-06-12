import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManajemenTemplateComponent } from './manajemen-template.component';
import { ManajemenTemplateRoutingModule } from './manajemen-template-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    ManajemenTemplateComponent
  ],
  imports: [
    CommonModule,
    ManajemenTemplateRoutingModule,
    FormsModule,             
    ReactiveFormsModule,
    DataTablesModule,
    SharedModule
  ]
})
export class ManajemenTemplateModule { }
