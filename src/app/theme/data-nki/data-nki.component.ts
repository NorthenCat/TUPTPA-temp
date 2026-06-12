import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-nki',
  templateUrl: './data-nki.component.html',
  styleUrls: ['./data-nki.component.scss']
})
export class DataNkiComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();

  public loadingTable = false;

  // Filters
  public selectedPeriode = '';
  public periodeOptions: any[] = [];

  public selectedStruktur = '';
  public strukturOptions: any[] = [];

  // Search
  public keyword = '';

  // Data
  public dataTable: any[] = [];
  public rawData: any[] = [];

  // Footer info
  public sumberDataInfo = 'Sumber data dari tanggal 01-12-2023 s.d 29-02-2024';

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private router: Router
  ) {
    this.translateService.setDefaultLang(localStorage.getItem('lang'));
    this.broadcasterService.changeLangBroadcast$.subscribe(res => {
      this.translateService.setDefaultLang(res.lang);
    });
  }

  ngOnInit(): void {
    this.initDataTable();
    this.initFilterOptions();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }

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

  private initFilterOptions(): void {
    this.periodeOptions = [
      { value: '', label: 'Semua Periode' },
      { value: 'TelU Point TPA Genap 2024 - 2025', label: 'Telu Point TPA Genap 2024-2025 | 26-05-2025 s.d 29-08-2025' }
    ];

    this.strukturOptions = [
      { value: '', label: 'Semua Struktur Organisasi' },
      { value: 'URUSAN MEKANIKAL ELEKTRIKAL', label: 'URUSAN MEKANIKAL ELEKTRIKAL' },
      { value: 'DIREKTORAT SUMBER DAYA MANUSIA', label: 'DIREKTORAT SUMBER DAYA MANUSIA' },
      { value: 'FAKULTAS TEKNIK ELEKTRO', label: 'FAKULTAS TEKNIK ELEKTRO' },
      { value: 'FAKULTAS INFORMATIKA', label: 'FAKULTAS INFORMATIKA' },
      { value: 'FAKULTAS EKONOMI DAN BISNIS', label: 'FAKULTAS EKONOMI DAN BISNIS' }
    ];

    this.selectedPeriode = '';
    this.selectedStruktur = '';
  }

  private loadInitialData(): void {
    this.loadingTable = true;

    this.fetchRawData().then((rows: any[]) => {
      this.rawData = rows || [];
      this.dataTable = this.rawData.slice();
      setTimeout(() => this.dtTrigger.next(), 0);
      this.loadingTable = false;
    }).catch(() => {
      this.dataTable = [];
      setTimeout(() => this.dtTrigger.next(), 0);
      this.loadingTable = false;
      this.toastError('Terjadi kesalahan sistem');
    });
  }

  public applyFilter(): void {
    const filtered = this.buildFilteredData(this.rawData || []);
    this.rerenderDatatable(filtered, true);
  }

  public onSearch(): void {
    const filtered = this.buildFilteredData(this.rawData || []);
    this.rerenderDatatable(filtered, true);
  }

  public onKeywordChange(): void {
    const k = (this.keyword || '').trim();
    if (k === '') {
      const filtered = this.buildFilteredData(this.rawData || []);
      this.rerenderDatatable(filtered, true);
    }
  }

  private buildFilteredData(rows: any[]): any[] {
    let result = rows ? rows.slice() : [];

    const periodeVal = this.selectedPeriode || '';
    const strukturVal = this.selectedStruktur || '';
    const keywordVal = (this.keyword || '').trim().toLowerCase();

    if (periodeVal) {
      result = result.filter(x => (x.periodePenilaian || '') === periodeVal);
    }

    if (strukturVal) {
      result = result.filter(x => (x.unitProdi || '').toUpperCase().indexOf(strukturVal.toUpperCase()) !== -1);
    }

    if (keywordVal) {
      result = result.filter(x => {
        const combined = [
          x.periodePenilaian || '',
          x.nip || '',
          x.namaPegawai || '',
          x.unitProdi || '',
          String(x.nilaiKerjaIndividu || ''),
        ].join(' ').toLowerCase();

        return combined.indexOf(keywordVal) !== -1;
      });
    }

    return result;
  }

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

  // Action buttons
  public exportIpk(): void {
    this.toastInfo('Export IPK sedang diproses...');
  }

  public exportExcel(): void {
    this.toastInfo('Export Excel sedang diproses...');
  }

  public unduhUmpanBalik(): void {
    this.toastInfo('Unduh Umpan Balik sedang diproses...');
  }

  public membangkitkan(): void {
    this.toastInfo('Membangkitkan data NKI...');
  }

  public openDetail(row: any): void {
    this.router.navigate(['/rekap-performasi'], { state: { data: row } });
  }

  // Dummy data
  private fetchRawData(): Promise<any[]> {
    return new Promise(resolve => {
      const dummy = [
        {
          periodePenilaian: 'TelU Point TPA Genap 2024 - 2025',
          nip: '01730036',
          namaPegawai: 'AANG SAEFUL ANWAR',
          unitProdi: 'URUSAN MEKANIKAL ELEKTRIKAL',
          statusPegawai: 1,
          nilaiKerjaIndividu: 105.41,
          kelebihanPoint: 0.00,
          statusApprove: '-'
        },
        {
          periodePenilaian: 'TelU Point TPA Genap 2024 - 2025',
          nip: '14850012',
          namaPegawai: 'BUDI SETIAWAN',
          unitProdi: 'DIREKTORAT SUMBER DAYA MANUSIA',
          statusPegawai: 1,
          nilaiKerjaIndividu: 98.75,
          kelebihanPoint: 2.50,
          statusApprove: 'Approved'
        },
        {
          periodePenilaian: 'TelU Point TPA Genap 2024 - 2025',
          nip: '16920045',
          namaPegawai: 'CITRA DEWI LESTARI',
          unitProdi: 'FAKULTAS TEKNIK ELEKTRO',
          statusPegawai: 1,
          nilaiKerjaIndividu: 112.30,
          kelebihanPoint: 5.00,
          statusApprove: 'Approved'
        },
        {
          periodePenilaian: 'TelU Point TPA Genap 2024 - 2025',
          nip: '18760078',
          namaPegawai: 'DIAN PERMATA SARI',
          unitProdi: 'FAKULTAS INFORMATIKA',
          statusPegawai: 1,
          nilaiKerjaIndividu: 95.20,
          kelebihanPoint: 0.00,
          statusApprove: '-'
        },
        {
          periodePenilaian: 'TelU Point TPA Genap 2024 - 2025',
          nip: '20150099',
          namaPegawai: 'EKO PRASETYO',
          unitProdi: 'FAKULTAS EKONOMI DAN BISNIS',
          statusPegawai: 1,
          nilaiKerjaIndividu: 101.88,
          kelebihanPoint: 1.25,
          statusApprove: 'Pending'
        }
      ];

      setTimeout(() => resolve(dummy), 300);
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
