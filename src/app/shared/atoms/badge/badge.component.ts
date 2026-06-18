import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variant = 'primary';
  @Input() pill = false;
  @Input() light = false;
  @Input() link = false;
  @Input() extraClass = 'm-r-5';

  get classes(): string[] {
    const variantClass = this.light ? `badge-light-${this.variant}` : `badge-${this.variant}`;
    return [
      'badge',
      this.extraClass,
      this.pill ? 'badge-pill' : '',
      variantClass
    ].filter(Boolean);
  }
}
