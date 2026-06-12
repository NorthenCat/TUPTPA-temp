import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppService } from 'src/app/_services/app.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class AdminUniversitasComponent implements OnInit {
  // Begin - Main Component of dataTable [mandatory]
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger = new Subject();
  // End - Main Component of dataTable [mandatory]

  public dataTable = []

  public vendor = "ABC"
  public showLabel = false

  public defaultConfig: any;
  public email = ''
  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private appService: AppService,
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.defaultConfig = DefaultConfig;
  }

  ngOnInit() {
    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      processing: true,
      ordering: false,
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      language: {
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
        zeroRecords: 'Data tidak ditemukan!',
        emptyTable: 'Data tidak ditemukan!',
        lengthMenu: '_MENU_ data',
        processing: '',
        infoFiltered: '',
        infoEmpty: '',
        search: 'Cari:',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;',
        }
      }
    };
    this.getDataTable()
  }

  saveData() {
    alert(this.email)
  }

  onChangeVendor(event) {
    this.vendor = event.target.value
  }

  getDataTable() {
    this.dataTable = []
    ///{id?}/{activestatus?}/{rating?}/{vendortypeid?}/{vendorname?}
    this.appService.getVendor('0/1').subscribe(
      res => {
        console.log('Sukses')
        console.log(res.data)
        this.dataTable = res.data
        this.dtTrigger.next()
      },
      err => {
        console.log('err')
        console.log(err)
      }
    )
  }
}
