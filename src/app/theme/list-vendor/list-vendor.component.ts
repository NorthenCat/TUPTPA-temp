import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { AppService } from 'src/app/_services/app.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-vendor',
  templateUrl: './list-vendor.component.html',
  styleUrls: ['./list-vendor.component.scss']
})
export class ListVendorComponent implements OnInit {
  // Begin - Main Component of dataTable [mandatory]
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger = new Subject();
  // End - Main Component of dataTable [mandatory]

  @ViewChild('modalDefault', { static: true }) public modalDefault: any;

  public dataTable = []
  public selectedStatus = 'all'
  public activeStatus = [
    { value: '0', label: 'Tidak Aktif' },
    { value: '1', label: 'Aktif' },
    { value: 'all', label: 'All' },
  ];
  public optionsActiveStatus = [
    { value: '0', label: 'Tidak Aktif' },
    { value: '1', label: 'Aktif' },
  ];

  public vendorType = [];
  public selectedType = ''
  public selectedRating = '0'
  public activeRating = [
    { value : '0', label: 'Semua Rating'},
    { value : '1', label: '1'},
    { value : '2', label: '2'},
    { value : '3', label: '3'},
    { value : '4', label: '4'},
    { value : '5', label: '5'},
  ]
  public loadingTable = false
  public loadingModal = false

  public formType = ''
  public dataVendor = null

  public formVendor: FormGroup; // Create FormGroup instance

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private appService: AppService,
    private fb: FormBuilder
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    //this.defaultConfig = DefaultConfig;
    this.formVendor = this.fb.group({
      vendortypeid: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.required),
      activestatus: new FormControl('', Validators.required),
    });
  }

  get fv() { return this.formVendor.controls; }

  ngOnInit() {
    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
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
    this.getVendorType()
    this.getData()
  }

  getVendorType() {
    this.appService.getVendorType(0).subscribe(
      res => {
        if (res && res.data) {
          this.vendorType = res.data.map(val => {
            const { id, name } = val
            return { value: String(id), label: name }
          })
        } else {
          this.broadcasterService.notifBroadcast(true, {
            title: 'Gagal',
            msg: 'Terjadi kesalahan sistem',
            timeout: 5000,
            theme: 'bootstrap',
            position: 'top-right',
            type: 'error'
          });
        }

      },
      err => {
        this.broadcasterService.notifBroadcast(true, {
          title: 'Gagal',
          msg: 'Terjadi kesalahan sistem',
          timeout: 5000,
          theme: 'bootstrap',
          position: 'top-right',
          type: 'error'
        });
      },
      () => {
      }
    )
  }

  getData() {
    this.dataTable = []
    this.loadingTable = true
    ///{id?}/{activestatus?}/{rating?}/{vendortypeid?}/{vendorname?}
    const activestatus = this.selectedStatus
    const vendortypeid = this.selectedType || 0
    const rating = this.selectedRating || 0
    const params = `0/${activestatus}/${rating}/${vendortypeid}`
    this.appService.getVendor(params).subscribe(
      res => {
        if (res && res.data) {
          this.dataTable = res.data.map(val => {
            const { rating, activestatus} = val
            console.log(Number(rating) > 3)
            let labelRating = Number(rating) > 1 ? 'Baik' : Number(rating) > 3 ? 'Sangat Baik' : 'Buruk'
            let statusLabel = activestatus === true ? 'Aktif' : 'Tidak Aktif';
            const balikanBaru = { ...val, labelRating, statusLabel }
            return balikanBaru
          })
          this.broadcasterService.notifBroadcast(true, {
            title: 'Sukses',
            msg: 'Message sukses',
            timeout: 5000,
            theme: 'bootstrap',
            position: 'top-right',
            type: 'success'
          });
        } else {
          this.broadcasterService.notifBroadcast(true, {
            title: 'Gagal',
            msg: 'Terjadi kesalahan sistem',
            timeout: 5000,
            theme: 'bootstrap',
            position: 'top-right',
            type: 'error'
          });
        }
        this.dtTrigger.next()
        this.loadingTable = false
      },
      err => {
        this.broadcasterService.notifBroadcast(true, {
          title: 'Gagal',
          msg: 'Terjadi kesalahan sistem',
          timeout: 5000,
          theme: 'bootstrap',
          position: 'top-right',
          type: 'error'
        });
        this.dtTrigger.next()
        this.loadingTable = false
      },
      () => {
        this.loadingTable = false
      }
    )
  }

  openForm(type, data) {
    this.formVendor.reset()
    this.formType = type
    this.dataVendor = null

    if (type === 'create') {
      this.formVendor.patchValue({ activestatus: '1' })

    } else {
      this.dataVendor = data
      const { name, desc, activestatus, vendortypeid } = data
      this.formVendor.patchValue({
        vendortypeid: String(vendortypeid),
        name: name,
        desc: desc,
        activestatus: activestatus ? '1' : '0'
      })
    }
    this.modalDefault.show()
  }

  closeForm() {
    this.modalDefault.hide()
  }

  confirmSave() {
    if (this.formVendor.invalid) {
      Swal.fire({
        type: 'error',
        text: 'Pastikan semua masukan sudah diisi.',
        showCloseButton: true,
      })
    } else {
      Swal.fire({
        type: 'warning',
        text: 'Pastikan semua masukan sudah benar sebelum melanjutkan.',
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: 'Lanjutkan',
      }).then(res => {
        if (res.value) {
          console.log(this.formVendor.value)
          this.saveData()
        }
      })
    }
  }

  saveData() {
    const { name, vendortypeid, desc, activestatus } = this.formVendor.value
    let payload = {
      vendortypeid: vendortypeid,
      name: name,
      desc: desc,
      activestatus: activestatus,
    }
    if (this.formType === 'create') {
      // API CREATE
      this.appService.createVendor(payload).subscribe(res => {
        if (res && res.status === "Success") {
          this.successToast(res.message)
          this.getData()
          this.closeForm()
        } else {
          this.errorToast()
        }
      }, err => {
        this.errorToast()
      })
    } else {
      // API UPDATE
      const { id } = this.dataVendor
      let payloadUpdate = { ...payload, vendorid: id }
      this.appService.updateVendor(payloadUpdate).subscribe(res => {
        if (res && res.status === "Success") {
          this.successToast(res.message)
          this.getData()
          this.closeForm()
        } else {
          this.errorToast()
        }
      }, err => {
        this.errorToast()
      })
    }
  }

  successToast(msg) {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Sukses',
      msg: msg || 'Message sukses',
      timeout: 5000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'success'
    });
  }

  errorToast() {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Gagal',
      msg: 'Terjadi kesalahan sistem',
      timeout: 5000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'error'
    });
  }
}
