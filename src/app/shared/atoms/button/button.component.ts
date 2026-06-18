import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonType: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant = 'primary';
  @Input() size: 'sm' | 'lg' | '' = '';
  @Input() outline = false;
  @Input() block = false;
  @Input() disabled = false;
  @Input() extraClass = '';
  @Input() buttonClass = '';
  @Input() ariaLabel = '';

  @Output() clicked = new EventEmitter<Event>();

  get classes(): string {
    if (this.buttonClass) {
      return this.buttonClass;
    }

    const type = this.outline ? `btn-outline-${this.variant}` : `btn-${this.variant}`;
    return [
      'btn',
      type,
      this.size ? `btn-${this.size}` : '',
      this.block ? 'btn-block' : '',
      this.extraClass
    ].filter(Boolean).join(' ');
  }

  handleClick(event: Event) {
    this.clicked.emit(event);
  }
}
