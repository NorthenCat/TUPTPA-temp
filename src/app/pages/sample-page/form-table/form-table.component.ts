import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AppService } from 'src/app/_services/app.service';
import { DataTableDirective } from 'angular-datatables';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.scss']
})
export class FormTableComponent implements OnInit {
  // Begin - Main Component of dataTable [mandatory]
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger = new Subject();
  // End - Main Component of dataTable [mandatory]

  public loadingTable: boolean; // Create property for spinner loading
  public loadingTableBasic: boolean; // Create property for spinner loading

  public dataFaq: Array<any>; // Create property for FAQ data list
  public dataBasic: Array<any>; // Create property for FAQ data list

  public positionOption: Array<any>; // Create property for option list
  public playersOption: Array<any>; // Create property for option list
  public officeOption: Array<any>; // Create property for option list

  public formPlayers: FormGroup; // Create FormGroup instance
  public formUsers: FormGroup; // Create FormGroup instance

  // notification property
  public toastData: any;
  public office: any;
  public no: number;

  constructor(
    public broadcasterService: BroadcasterService,
    public translateService: TranslateService,
    public appService: AppService,
    private fb: FormBuilder
  ) {
    this.no = 0;
    this.dataFaq = [];
    this.dataBasic = [];
    this.toastData = {};
    this.loadingTable = false;
    this.loadingTableBasic = false;
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.officeOption = [
      {value: '0', label: 'Direktorat Pusat Teknologi Informasi'},
      {value: '1', label: 'Direktorat Admisi'},
      {value: '2', label: 'Direktorat Akademik'},
      {value: '3', label: 'Direktorat Kemahasiswaan'},
      {value: '4', label: 'Direktorat Sumber Daya Manusia'},
    ];
    this.playersOption = [
      {value: '0', label: 'Lionel Messi'},
      {value: '1', label: 'Andres Iniesta'},
      {value: '2', label: 'Xavi Hernandes'},
      {value: '3', label: 'Carles Puyol'},
      {value: '4', label: 'Sergio Busquets'},
      {value: '5', label: 'Pedro'},
      {value: '6', label: 'David Villa'},
      {value: '7', label: 'Dani Alves'},
      {value: '8', label: 'Victor Valdes'},
      {value: '9', label: 'Jordi Alba'},
      {value: '10', label: 'Gerard Pique'},
      {value: '11', label: 'Cesc Fabregas'},
      {value: '12', label: 'Joseph Guardiola'}
    ];
    this.positionOption = [
      {value: '1', label: 'Accountant'},
      {value: '2', label: 'Junior Technical Author'},
      {value: '3', label: 'Senior Javascript Developer'},
      {value: '4', label: 'Accountant'},
      {value: '5', label: 'Software Engineer'},
      {value: '6', label: 'Office Manager'},
      {value: '7', label: 'Systems Administrator'},
      {value: '8', label: 'Software Engineer'},
      {value: '9', label: 'Financial Controller'},
      {value: '10', label: 'Support Engineer'},
      {value: '11', label: 'Data Coordinator'},
      {value: '12', label: 'Customer Support'},
    ];
    this.formUsers = this.fb.group ({
      username: new FormControl('aditya z', Validators.required),
      password: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      age: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ]),
      photo: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required)
    });
    this.formPlayers = this.fb.group ({
      person: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      number: new FormControl('', [Validators.required, Validators.max(99)])
    });
  }

  get fp() { return this.formPlayers.controls; }
  get fu() { return this.formUsers.controls; }

  ngOnInit() {
    this.loadDatatableBasic();
    this.loadDatatableServerside();
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
    // this.fu.position.disable();
  }

  resetForm() {
    this.formPlayers.reset();
  }

  resetFormFloat() {
    this.formUsers.reset();
  }

  loadDatatableServerside() {
    this.dtOptions[0] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
      serverSide: true,
      processing: true,
      ordering: false,
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      language: {
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
        processing: 'loading...',
        lengthMenu: '_MENU_ data',
        zeroRecords: 'Data tidak ditemukan!',
        emptyTable: 'Data tidak ditemukan!',
        loadingRecords: '&nbsp;',
        infoFiltered: '',
        infoEmpty: '',
        search: 'Cari:',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;',
        }
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.loadingTable = true;
        setTimeout(() => { // fake loading for 7 sec [just ignore if in development mode]
          this.appService.getFaqData(dataTablesParameters).subscribe((resp) => {
            this.loadingTable = false;
            this.dataFaq = resp.data;
            // this.dataFaq = [];
            this.no = resp.from;
            callback({
              recordsTotal: resp.total,
              recordsFiltered: resp.total,
              data: [],
            });
          }, err => {
            this.broadcasterService.notifBroadcast(true, {
              title: 'Gagal',
              msg: 'Terjadi kesalahan sistem',
              timeout: 5000,
              theme: 'bootstrap',
              position: 'top-right',
              type: 'error'
            });
            this.loadingTable = false;
          });
        }, 7000); // fake loading for 7 sec [just ignore if in development mode]
      }
    };
  }

  loadDatatableBasic() {
    this.loadingTableBasic = true;
    this.appService.getFakeData().subscribe(response => {
      setTimeout(() => { // fake loading for 3 sec [just ignore if in development mode]
        this.dataBasic = response.data;
        this.dtTrigger.next(); // Trigger for load datatable
        this.broadcasterService.notifBroadcast(true, {
          title: 'Sukses',
          msg: 'Message sukses',
          timeout: 5000,
          theme: 'bootstrap',
          position: 'top-right',
          type: 'success'
        });
        this.loadingTableBasic = false;
      }, 3000); // fake loading for 3 sec [just ignore if in development mode]
    }, err => {
      this.broadcasterService.notifBroadcast(true, {
        title: 'Gagal',
        msg: 'Terjadi kesalahan sistem',
        timeout: 5000,
        theme: 'bootstrap',
        position: 'top-right',
        type: 'error'
      });
      this.loadingTableBasic = false;
    });
  }

}
