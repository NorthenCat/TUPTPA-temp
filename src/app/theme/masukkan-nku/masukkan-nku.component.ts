import { Component, OnInit, OnDestroy, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { AppService } from 'src/app/_services/app.service';
import { TupTpaService } from 'src/app/_services/tup-tpa.service';
import { OauthService } from 'src/app/_services/oauth.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-masukkan-nku',
  templateUrl: './masukkan-nku.component.html',
  styleUrls: ['./masukkan-nku.component.scss']
})
export class MasukkanNkuComponent implements OnInit, OnDestroy {
  // Begin - Main Component of dataTable [mandatory]
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();
  // End - Main Component of dataTable [mandatory]

  public loadingTable = false;
  public loadingFilter = false;

  // Search (custom searchbar)
  public keyword = '';

  // Filters
  public selectedPeriode = '';
  public periodeOptions: any[] = [];

  public selectedStruktur = '';
  public strukturOptions: any[] = [];

  // Dropdown khusus modal (diisi dari API)
  public modalUnitOptions: any[] = [];
  public modalPeriodeOptions: any[] = [];

  // Data
  public dataTable: any[] = [];
  public rawData: any[] = [];

  // ===== MODAL UPLOAD EXCEL =====
  @ViewChild('modalUploadExcel', { static: true }) public modalUploadExcel: any;
  @ViewChild('fileInput', { static: false }) public fileInput: any;

  public loadingModal = false;

  public formUploadExcel: FormGroup;
  public selectedFile: File = null;
  public selectedFileName = '';

  get fu() { return this.formUploadExcel.controls; }

  // ===== MODAL TAMBAH / UBAH PER DATA =====
  @ViewChild('modalPerData', { static: true }) public modalPerData: any;

  public loadingModalPerData = false;
  public formPerData: FormGroup;

  get fp() { return this.formPerData.controls; }

  // ===== EDIT MODE (modal per data) =====
  public perDataMode: 'create' | 'edit' = 'create';
  private editingRawIndex: number = -1;


  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private appService: AppService,
    private tupTpaService: TupTpaService,
    private oauthService: OauthService,
    private fb: FormBuilder
  ) {
    this.translateService.setDefaultLang(localStorage.getItem('lang'));
    this.broadcasterService.changeLangBroadcast$.subscribe(res => {
      this.translateService.setDefaultLang(res.lang);
    });

    // Form modal upload excel
    this.formUploadExcel = this.fb.group({
      periode: new FormControl('', Validators.required),
      file: new FormControl(null, Validators.required),
    });

    // Form modal tambah/ubah NKU per data
    this.formPerData = this.fb.group({
      periode: new FormControl('', Validators.required),
      nilai: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(1000)]),
      unit: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.initDataTable();
    this.initFilterOptions();
    this.loadInitialData(); // refresh page -> tampil semua data
  }

  ngOnDestroy(): void {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }

  /** Datatable config (pagination ada, search bawaan dimatikan) */
  private initDataTable(): void {
    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      searching: true,
      lengthChange: false,
      language: {
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
        zeroRecords: 'Data tidak ditemukan!',
        emptyTable: 'Data tidak ditemukan!',
        lengthMenu: '_MENU_ data',
        processing: '',
        infoFiltered: '',
        infoEmpty: '',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;',
        }
      }
    };
  }

  /** Inisialisasi dropdown default (kosong, akan diisi setelah data API dimuat) */
  private initFilterOptions(): void {
    this.periodeOptions = [
      { value: '', label: 'Semua Periode' }
    ];

    this.strukturOptions = [
      { value: '', label: 'Semua Unit/Fakultas' }
    ];

    this.selectedPeriode = '';
    this.selectedStruktur = '';
  }

  /** Build filter options dari data API yang sudah di-fetch */
  private buildFilterOptionsFromData(rows: any[]): void {
    // Ambil unique periodeName untuk dropdown Periode
    const uniquePeriode = Array.from(new Set(
      rows.map(r => r.periodeName).filter(v => !!v)
    ));
    this.periodeOptions = [
      { value: '', label: 'Semua Periode' },
      ...uniquePeriode.map(p => ({ value: p, label: p }))
    ];

    // Ambil unique unitName untuk dropdown Unit/Fakultas
    const uniqueUnit = Array.from(new Set(
      rows.map(r => r.unitName).filter(v => !!v)
    ));
    this.strukturOptions = [
      { value: '', label: 'Semua Unit/Fakultas' },
      ...uniqueUnit.map(u => ({ value: u, label: u }))
    ];
  }

  /** Load awal: tampilkan semua data saat refresh */
  private loadInitialData(): void {
    this.loadingTable = true;

    this.fetchRawData().then((rows: any[]) => {
      this.rawData = rows || [];
      this.dataTable = this.rawData.slice();

      // Bangun dropdown filter dari data API
      this.buildFilterOptionsFromData(this.rawData);

      setTimeout(() => this.dtTrigger.next(), 0);
      this.loadingTable = false;
    }).catch(() => {
      this.dataTable = [];
      setTimeout(() => this.dtTrigger.next(), 0);
      this.loadingTable = false;
      this.toastError('Terjadi kesalahan sistem');
    });
  }

  /** Refresh data dari API setelah create/edit berhasil */
  private refreshData(): void {
    this.loadingTable = true;

    this.fetchRawData().then((rows: any[]) => {
      this.rawData = rows || [];

      // Bangun ulang dropdown filter dari data terbaru
      this.buildFilterOptionsFromData(this.rawData);

      const filtered = this.buildFilteredData(this.rawData);
      this.rerenderDatatable(filtered, true);
      this.loadingTable = false;
    }).catch(() => {
      this.loadingTable = false;
      this.toastError('Gagal memuat ulang data.');
    });
  }

  /** Klik tombol Terapkan */
  public applyFilter(): void {
    const filtered = this.buildFilteredData(this.rawData || []);
    this.rerenderDatatable(filtered, true);
  }

  /** Searchbar: klik tombol/search enter */
  public onSearch(): void {
    const filtered = this.buildFilteredData(this.rawData || []);
    this.rerenderDatatable(filtered, true);
  }

  /** Ketika input search DIHAPUS -> balik ke data awal (full) */
  public onKeywordChange(): void {
    const k = (this.keyword || '').trim();
    if (k === '') {
      this.selectedPeriode = '';
      this.selectedStruktur = '';
      const filtered = this.buildFilteredData(this.rawData || []);
      this.rerenderDatatable(filtered, true);
    }
  }

  /** Builder filter: periode + struktur + keyword */
  private buildFilteredData(rows: any[]): any[] {
    let result = rows ? rows.slice() : [];

    const periodeVal = this.selectedPeriode || '';
    const strukturVal = this.selectedStruktur || '';
    const keywordVal = (this.keyword || '').trim().toLowerCase();

    if (periodeVal) {
      result = result.filter(x => (x.periodeName || '') === periodeVal);
    }

    if (strukturVal) {
      result = result.filter(x => (x.unitName || '') === strukturVal);
    }

    if (keywordVal) {
      result = result.filter(x => {
        const periode = ((x.periodeName || '') + ' ' + (x.periodeLabel || '')).toLowerCase();
        const unit = (x.unitName || '').toLowerCase();
        const nilai = String((x.nilai || x.nilai === 0) ? x.nilai : '').toLowerCase();

        return (
          periode.indexOf(keywordVal) !== -1 ||
          unit.indexOf(keywordVal) !== -1 ||
          nilai.indexOf(keywordVal) !== -1
        );
      });
    }

    return result;
  }

  /** Re-render DataTables */
  private rerenderDatatable(rows: any[], resetPage?: boolean): void {
    this.dataTable = rows || [];

    if (this.dtElements && this.dtElements.length) {
      this.dtElements.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();

          setTimeout(() => {
            this.dtTrigger.next();

            if (resetPage) {
              setTimeout(() => {
                dtElement.dtInstance.then((newInstance: DataTables.Api) => {
                  newInstance.page('first').draw('page');
                });
              }, 0);
            }
          }, 0);
        });
      });
    } else {
      setTimeout(() => this.dtTrigger.next(), 0);
    }
  }

  // ===== MODAL UPLOAD EXCEL METHODS =====

  /** Klik tombol "Tambahkan Data Excel" -> buka modal */
  public onUploadExcel(): void {
    this.openUploadExcel();
  }

  public openUploadExcel(): void {
    this.loadingModal = false;
    this.formUploadExcel.reset();
    this.selectedFile = null;
    this.selectedFileName = '';

    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    this.modalUploadExcel.show();
  }

  public closeUploadExcel(): void {
    this.modalUploadExcel.hide();
  }

  public triggerPickFile(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  public onFileSelected(event: any): void {
    const file: File = event && event.target && event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const nameLower = (file.name || '').toLowerCase();
    const isExcel = nameLower.endsWith('.xls') || nameLower.endsWith('.xlsx');

    if (!isExcel) {
      this.selectedFile = null;
      this.selectedFileName = '';
      this.formUploadExcel.patchValue({ file: null });
      this.formUploadExcel.get('file').markAsTouched();
      this.toastError('File harus berformat .xls atau .xlsx');
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;

    this.formUploadExcel.patchValue({ file: file });
    this.formUploadExcel.get('file').markAsTouched();
  }

  /** Klik Simpan upload (dummy dulu, API nanti) */
  public saveUploadExcel(): void {
    if (this.formUploadExcel.invalid) {
      Object.keys(this.formUploadExcel.controls).forEach(k => {
        this.formUploadExcel.get(k).markAsTouched();
      });
      return;
    }

    this.loadingModal = true;

    setTimeout(() => {
      this.loadingModal = false;
      this.toastInfo('Upload excel (dummy) berhasil.');
      this.closeUploadExcel();
    }, 700);
  }

  // ===== MODAL TAMBAH / UBAH NKU PER DATA =====

  /** Klik tombol "Tambahkan Data per Data" -> buka modal (create) */
  public openPerData(): void {
    this.perDataMode = 'create';
    this.editingRawIndex = -1;

    this.loadingModalPerData = false;
    this.formPerData.reset();

    // Fetch dropdown data dari API
    this.fetchModalDropdownData();

    this.modalPerData.show();
  }

  public closePerData(): void {
    this.modalPerData.hide();
    this.perDataMode = 'create';
    this.editingRawIndex = -1;
  }


  /** Klik tombol Ubah di tabel -> buka modal (edit) dan isi default value */
  public openEditPerData(row: any): void {
    this.perDataMode = 'edit';

    // cari index di rawData (penting untuk update saat save)
    this.editingRawIndex = this.rawData.indexOf(row);

    this.loadingModalPerData = true;
    this.formPerData.reset();
    this.modalPerData.show();

    // Fetch dropdown data dari API, lalu isi form setelah data siap
    this.fetchModalDropdownData(() => {
      // Match periode berdasarkan nama (karena NKU API tidak return tpa_content_period_id)
      const periodeName = row && row.periodeName ? row.periodeName : '';
      const matchedPeriode = this.modalPeriodeOptions.find(o => o.label === periodeName);
      const periodeId = matchedPeriode ? matchedPeriode.value : '';

      const nilai = row && (row.nilai || row.nilai === 0) ? row.nilai : null;
      const unitId = row && row.organizationStructureId ? String(row.organizationStructureId) : '';

      this.formPerData.patchValue({
        periode: periodeId,
        nilai: nilai,
        unit: unitId
      });

      Object.keys(this.formPerData.controls).forEach(k => {
        this.formPerData.get(k).markAsPristine();
        this.formPerData.get(k).markAsUntouched();
      });

      this.loadingModalPerData = false;
    });
  }

  /** Fetch dropdown data untuk modal dari API */
  private fetchModalDropdownData(callback?: () => void): void {
    let periodeLoaded = false;
    let orgLoaded = false;

    const checkDone = () => {
      if (periodeLoaded && orgLoaded && callback) {
        callback();
      }
    };

    // Fetch semua periode
    this.tupTpaService.getTpaPeriod().subscribe(
      (res: any) => {
        if (res && res.success && res.data) {
          this.modalPeriodeOptions = res.data.map((item: any) => ({
            value: String(item.id),
            label: item.name
          }));
        } else {
          this.modalPeriodeOptions = [];
        }
        periodeLoaded = true;
        checkDone();
      },
      () => {
        this.modalPeriodeOptions = [];
        periodeLoaded = true;
        checkDone();
      }
    );

    // Fetch organization list
    this.tupTpaService.getOrganizationList('').subscribe(
      (res: any) => {
        if (res && res.success && res.data) {
          this.modalUnitOptions = res.data.map((item: any) => ({
            value: String(item.id),
            label: item.detail_name
          }));
        } else {
          this.modalUnitOptions = [];
        }
        orgLoaded = true;
        checkDone();
      },
      () => {
        this.modalUnitOptions = [];
        orgLoaded = true;
        checkDone();
      }
    );
  }

  /** Klik Simpan per data (dummy: masuk table / update table) */
  public savePerData(): void {
    if (this.formPerData.invalid) {
      Object.keys(this.formPerData.controls).forEach(k => {
        this.formPerData.get(k).markAsTouched();
      });
      return;
    }

    this.loadingModalPerData = true;

    const periodeId = this.formPerData.value.periode;
    const unitId = this.formPerData.value.unit;
    const nilai = Number(this.formPerData.value.nilai);

    // Cari label dari dropdown options
    const periodeOpt = this.modalPeriodeOptions.find(o => o.value === periodeId);
    const unitOpt = this.modalUnitOptions.find(o => o.value === unitId);
    const periodeName = periodeOpt ? periodeOpt.label : '';
    const unitName = unitOpt ? unitOpt.label : '';

    // CREATE
    if (this.perDataMode === 'create') {
      // Ambil user profile untuk created_by
      const profile = this.oauthService.retrieveProfile();
      const createdBy = profile
        ? (profile.id || profile.numberid || profile.user_id || profile.employee_id || null)
        : null;

      const body = {
        tpa_content_period_id: Number(periodeId),
        organization_structure_id: Number(unitId),
        score: nilai,
        created_by: createdBy
      };

      this.tupTpaService.createNkuData(body).subscribe(
        (res: any) => {
          this.loadingModalPerData = false;
          this.toastInfo('Data NKU berhasil ditambahkan.');
          this.closePerData();
          this.refreshData();
        },
        (err) => {
          console.error('Error creating NKU data:', err);
          console.error('[NKU Create] Error body:', JSON.stringify(err && err.error));
          this.loadingModalPerData = false;
          this.toastError('Gagal menambahkan data NKU.');
        }
      );

      return;
    }

    // EDIT
    if (this.perDataMode === 'edit') {
      if (this.editingRawIndex < 0 || this.editingRawIndex >= this.rawData.length) {
        setTimeout(() => {
          this.loadingModalPerData = false;
          this.toastError('Data yang akan diubah tidak ditemukan.');
        }, 100);
        return;
      }

      const current = this.rawData[this.editingRawIndex];

      // Ambil user profile untuk updated_by
      const profile = this.oauthService.retrieveProfile();
      console.log('[NKU Edit] Profile keys:', profile ? Object.keys(profile) : 'no profile');
      console.log('[NKU Edit] Profile:', profile);
      const updatedBy = profile
        ? (profile.id || profile.numberid || profile.user_id || profile.employee_id || null)
        : null;

      const body = {
        id: current.id,
        tpa_content_period_id: Number(periodeId),
        organization_structure_id: Number(unitId),
        score: nilai,
        updated_by: updatedBy
      };

      console.log('[NKU Edit] Profile:', profile);
      console.log('[NKU Edit] Request body:', JSON.stringify(body));

      this.tupTpaService.updateNkuData(body).subscribe(
        (res: any) => {
          this.loadingModalPerData = false;
          this.toastInfo('Perubahan NKU berhasil disimpan.');
          this.closePerData();
          this.refreshData();
        },
        (err) => {
          console.error('Error updating NKU data:', err);
          console.error('[NKU Edit] Error status:', err && err.status);
          console.error('[NKU Edit] Error body:', JSON.stringify(err && err.error));
          this.loadingModalPerData = false;
          this.toastError('Gagal menyimpan perubahan NKU.');
        }
      );

      return;
    }
  }

  // ===== FETCH DATA FROM API =====
  private fetchRawData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.tupTpaService.getNkuData().subscribe(
        (res: any) => {
          if (res && res.success && res.data) {
            const mapped = res.data.map((item: any) => ({
              id: item.id,
              periodeName: item.name || '',
              periodeLabel: item.work_location_description || '',
              unitName: item.work_location_name || '',
              nilai: item.score || 0,
              organizationStructureId: item.organization_structure_id,
              tpaContentPeriodId: item.tpa_content_period_id || null
            }));
            resolve(mapped);
          } else {
            resolve([]);
          }
        },
        (err) => {
          console.error('Error fetching NKU data:', err);
          reject(err);
        }
      );
    });
  }

  private toastError(msg?: string): void {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Gagal',
      msg: msg || 'Terjadi kesalahan sistem',
      timeout: 5000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'error'
    });
  }

  private toastInfo(msg?: string): void {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Info',
      msg: msg || 'Informasi',
      timeout: 3500,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'info'
    });
  }
}
