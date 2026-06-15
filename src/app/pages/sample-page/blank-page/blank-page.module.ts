import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponent } from './blank-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BlankPageComponent],
  imports: [
    CommonModule,
    ToastyModule.forRoot(),
    BlankPageRoutingModule,
    DataTablesModule,
    SharedModule
  ]
})
export class BlankPageModule { }
