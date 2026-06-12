import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, OnInit, Input } from '@angular/core';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
  selector: 'app-toast-show',
  templateUrl: './toast-show.component.html',
  styleUrls: ['./toast-show.component.scss']
})
export class ToastShowComponent implements OnInit {
  @Input() options: any;
  public position = 'top-right';
  public closeOther = false;
  public theme = 'default';
  public type = 'default';
  public showClose = true;
  public title: string;
  public msg: string;

  constructor(
    private toastyService: ToastyService,
    private broadcasterService: BroadcasterService
  ) {
    this.broadcasterService.notifBroadcast$.subscribe(res => {
      this.addToast(res.data);
    });
  }

  ngOnInit() {}

  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout,
      theme: options.theme,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

}
