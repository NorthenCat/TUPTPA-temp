import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-shell',
  templateUrl: './content-shell.component.html',
  styleUrls: ['./content-shell.component.scss']
})
export class ContentShellComponent {
  @Input() loading = false;
}
