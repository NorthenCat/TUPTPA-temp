import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DefaultConfig } from 'src/app/app-config';

@Component({
  selector: 'app-403',
  templateUrl: './403.component.html',
  styleUrls: ['./403.component.scss']
})
export class ForbiddenComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('403 | ' + DefaultConfig.Application.appName);
  }

}
