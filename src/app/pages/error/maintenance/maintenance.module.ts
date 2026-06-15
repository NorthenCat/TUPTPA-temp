import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceComponent } from './maintenance.component';
import { MaintenanceRoutingModule } from './maintenance-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaintenanceRoutingModule
  ],
  declarations: [MaintenanceComponent]
})
export class MaintenanceModule { }
