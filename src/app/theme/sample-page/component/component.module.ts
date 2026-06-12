import { NgbDropdownModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentRoutingModule } from './component-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentComponent } from './component.component';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ComponentComponent],
  imports: [
    CommonModule,
    ToastyModule.forRoot(),
    ComponentRoutingModule,
    NgbDropdownModule,
    DataTablesModule,
    NgbTabsetModule,
    SharedModule
  ]
})
export class ComponentModule { }
