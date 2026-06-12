import { Component, OnInit, QueryList, ViewChild, ViewChildren, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { AppService } from 'src/app/_services/app.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manajemen-sumber-data',
  templateUrl: './manajemen-sumber-data.component.html',
  styleUrls: ['./manajemen-sumber-data.component.scss']
})
export class ManajemenSumberDataComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild('modalDefault', { static: true }) public modalDefault: any;

  public loadingTable = false;
  public loadingModal = false;

  private isDtInitialized = false;

  public keyword = '';

  //dummy
  public allData: any[] = [];

  public dataTable: any[] = [];

  public formType: 'create' | 'edit' = 'create';
  public selectedRow: any = null;

  public opsiBangkitkan = [
    { value: '1', label: 'Aktif' },
    { value: '0', label: 'Tidak Aktif' }
  ];

  public formManajemenData: FormGroup;

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router 
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });

    this.formManajemenData = this.fb.group({
      namaData: new FormControl('', Validators.required),
      namaViewQuery: new FormControl('', Validators.required),
      tombolBangkitkan: new FormControl('', Validators.required),
    });
  }

  get fv() { return this.formManajemenData.controls; }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      paging: true,
      searching: false,
      info: true,
      lengthChange: true,
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
        paginate: { first: '&laquo;', previous: '&lsaquo;', next: '&rsaquo;', last: '&raquo;' }
      }
    };

    this.getData();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  // =========================
  // DATA + FILTER
  // =========================
  getData() {
    this.loadingTable = true;
    // nanti kalau sudah ada API: isi this.allData dari res.data lalu panggil applyClientFilterAndRerender()
    this.allData = Array.from({ length: 25 }).map((_, idx) => ({
      id: idx + 1,
      namaData: 'Nama Data ' + (idx + 1),
      namaViewQuery: 'TPA_VIEW_' + (idx + 1),
      tombolBangkitkan: (idx % 2 === 0) ? '1' : '0',
      tombolBangkitkanLabel: (idx % 2 === 0) ? 'Aktif' : 'Tidak Aktif',
      createdBy: 'HANIF KHAIRUDDIN',
      createdAt: '10-06-2020 09:39:17',
    }));

    this.applyClientFilterAndRerender();
    this.loadingTable = false;
  }

  // dipanggil dari tombol search / enter di input
  applyFilter() {
    this.applyClientFilterAndRerender();
  }

  private applyClientFilterAndRerender() {
    var kw = (this.keyword || '').toLowerCase().trim();

    if (!kw) {
      this.dataTable = this.allData.slice();
    } else {
      this.dataTable = this.allData.filter(d => {
        return (d.namaData || '').toLowerCase().includes(kw)
          || (d.namaViewQuery || '').toLowerCase().includes(kw)
          || (d.createdBy || '').toLowerCase().includes(kw);
      });
    }

    this.rerenderDatatable();
  }

  private rerenderDatatable() {
    // init pertama kali
    if (!this.isDtInitialized) {
      this.isDtInitialized = true;
      setTimeout(() => this.dtTrigger.next(), 0);
      return;
    }

    // destroy + init ulang supaya pagination dan info ikut update
    if (this.dtElements && this.dtElements.length) {
      this.dtElements.forEach((dt: DataTableDirective) => {
        dt.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          setTimeout(() => this.dtTrigger.next(), 0);
        });
      });
    } else {
      setTimeout(() => this.dtTrigger.next(), 0);
    }
  }

  // =========================
  // MODAL
  // =========================
  openForm(type: 'create' | 'edit', row: any) {
    this.formManajemenData.reset();
    this.formType = type;
    this.selectedRow = null;

    if (type === 'edit' && row) {
      this.selectedRow = row;

      this.formManajemenData.patchValue({
        namaData: row.namaData || '',
        namaViewQuery: row.namaViewQuery || '',
        tombolBangkitkan: (row.tombolBangkitkan !== undefined && row.tombolBangkitkan !== null) ? row.tombolBangkitkan : ''
      });
    }

    this.modalDefault.show();
  }

  closeForm() {
    this.modalDefault.hide();
  }

  confirmSave() {
    Object.keys(this.formManajemenData.controls).forEach((key) => {
      var ctrl = this.formManajemenData.get(key);
      if (ctrl) ctrl.markAsTouched();
    });

    if (this.formManajemenData.invalid) {
      this.errorToast('Pastikan semua masukan sudah diisi.');
      return;
    }

    this.saveData();
  }

  saveData() {
    this.loadingModal = true;

    // dummy save
    setTimeout(() => {
      this.loadingModal = false;

      if (this.formType === 'create') {
        this.successToast('Data Manajemen Data tersimpan.');
      } else {
        this.successToast('Data Manajemen Data diperbarui.');
      }

      this.closeForm();
      this.getData();
    }, 200);
  }

  // =========================
  // AKSI TABEL
  // =========================
  goDetail(row: any) {
    const id = row && row.id ? row.id : null;

    if (!id) {
      this.errorToast('ID tidak ditemukan.');
      return;
    }

    // kirim info yang dibutuhkan header di halaman detail
    const namaData = row && row.namaData ? row.namaData : '';
    const namaViewQuery = row && row.namaViewQuery ? row.namaViewQuery : '';

    this.router.navigate(
      ['/pengaturan/manajemen-sumber-data/detail', id],
      {
        queryParams: {
          namaData: namaData,
          namaViewQuery: namaViewQuery
        }
      }
    );
  }

  onView(row: any) {
    this.goDetail(row);
  }

  // =========================
  // TOAST
  // =========================
  successToast(msg: string) {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Sukses',
      msg: msg || 'Berhasil',
      timeout: 5000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'success'
    });
  }

  errorToast(msg?: string) {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Gagal',
      msg: msg || 'Terjadi kesalahan sistem',
      timeout: 5000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'error'
    });
  }

  infoToast(msg: string) {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Info',
      msg: msg || '-',
      timeout: 3000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'info'
    });
  }
}
