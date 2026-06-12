import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AppService } from 'src/app/_services/app.service';
import { DataTableDirective } from 'angular-datatables';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
export class ComponentComponent implements OnInit {
  // Create template reference variable from html as a string
  @ViewChild('modalFullScreen', {static: true}) public modalFullScreen: any;
  // notification property
  public toastData: any;
  public office: any;

  constructor(
    public broadcasterService: BroadcasterService,
    public translateService: TranslateService,
    public appService: AppService,
    private fb: FormBuilder
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
  }

  ngOnInit() {
  }

  modal(val) {
    if (val == 'open') {
      this.modalFullScreen.show();
    } else {
      this.modalFullScreen.hide();
    }
  }

  showAlertSuccess() {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Sukses',
      msg: 'Message sukses',
      timeout: 3000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'success'
    });
  }

  showAlertError() {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Error',
      msg: 'Message Error',
      timeout: 3000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'error'
    });
  }

  showAlertWarning() {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Warning',
      msg: 'Message Warning',
      timeout: 3000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'warning'
    });
  }

  showAlertInfo() {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Info',
      msg: 'Message Info',
      timeout: 3000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'info'
    });
  }

}
