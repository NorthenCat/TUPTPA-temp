import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';

@Component({
  selector: 'app-404',
  templateUrl: './404.component.html',
  styleUrls: ['./404.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('404 | ' + DefaultConfig.Application.appName);
  }

}
