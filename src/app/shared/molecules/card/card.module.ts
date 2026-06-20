import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AnimationService, AnimatorModule } from 'css-animator';
import { ButtonModule } from '../../atoms/button/button.module';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    ButtonModule,
    AnimatorModule
  ],
  declarations: [CardComponent],
  exports: [CardComponent],
  providers: [AnimationService]
})
export class CardModule { }
