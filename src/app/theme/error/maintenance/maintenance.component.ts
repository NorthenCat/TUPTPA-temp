import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DefaultConfig } from 'src/app/app-config';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Maintenance | ' + DefaultConfig.Application.appName);
  }

}
