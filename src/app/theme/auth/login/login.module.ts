import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParticlesModule } from 'angular-particle';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    ToastyModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ParticlesModule
  ]
})
export class LoginModule { }
