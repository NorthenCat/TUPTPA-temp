// penilai-dua-atasan-tidak-langsung.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
import { ElementRef } from '@angular/core';
import { TupTpaService } from 'src/app/_services/tup-tpa.service';


@Component({
  selector: 'app-penilai-dua-atasan-tidak-langsung',
  templateUrl: './penilai-dua-atasan-tidak-langsung.component.html',
  styleUrls: ['./penilai-dua-atasan-tidak-langsung.component.scss']
})
export class PenilaiDuaAtasanTidakLangsungComponent implements OnInit, OnDestroy {
  // ===== DATATABLE =====
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();

  // loader
  public loadingTable = true;
  public loadingTableBasic = false;

  // filter model (role ini cuma periode)
  public selectedPeriode = '';
  public selectedStruktur = '';
  public periodeOptions: Array<{
    value: string;
    label: string;
    startDate: string;
    endDate: string;
    activeStatus: number;
  }> = [];
  public strukturOptions: Array<{
    value: string;
    label: string;
  }> = [];

  // search
  public searchText = '';

  @ViewChild('dtFilterHost', { static: false }) dtFilterHostRef: ElementRef;
  private mountDtFilterToTopbar(): void {
    if (!this.dtFilterHostRef || !this.dtFilterHostRef.nativeElement) return;
  
    var host = this.dtFilterHostRef.nativeElement as HTMLElement;
    if (!host) return;
  
    // Ambil SEMUA filter yg dibuat DataTables, pakai yang TERAKHIR (paling baru)
    var filters = document.querySelectorAll('.dataTables_wrapper .dataTables_filter');
    if (!filters || filters.length === 0) return;
  
    var filterEl = filters[filters.length - 1] as HTMLElement;
  
    // Bersihin host dulu biar gak numpuk
    while (host.firstChild) {
      host.removeChild(host.firstChild);
    }
  
    host.appendChild(filterEl);
  }

  // data table (dummy)
  private originalRows: any[] = [];
  public dataTable: any[] = [];

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private router: Router,
    private route: ActivatedRoute, 
    private tupTpaService: TupTpaService
  ) {
    // translate pattern
    this.translateService.setDefaultLang(localStorage.getItem('lang'));
    this.broadcasterService.changeLangBroadcast$.subscribe(res => {
      this.translateService.setDefaultLang(res.lang);
    });
  }

  ngOnInit(): void {
    console.log('MASUK PenilaiSatuAtasanLangsungComponent ✅');

    // 1) init datatable config
    this.initDataTable();

    this.strukturOptions = [
      { value: '1', label: 'Data Lama' },
      { value: '2', label: 'Data Baru' }
    ];


    // load periode dari API dulu, lalu setelah itu baru load tabel utama
    this.loadTpaPeriodOptions();

    // 5) trigger datatable + mount filter (cukup sekali)
    setTimeout(() => {
      this.dtTrigger.next();
      setTimeout(() => {
        this.mountDtFilterToTopbar();
      }, 0);
    }, 0);
  }

  private loadTpaPeriodOptions(): void {
    this.periodeOptions = [
      {
        value: '1',
        label: 'TPA PERIODE REDEV',
        startDate: '',
        endDate: '',
        activeStatus: 1
      }
    ];

    this.selectedPeriode = '1';
    this.loadLeaderStaffData(this.selectedPeriode, '1480');
  }

  ngOnDestroy(): void {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }

  /** Datatable config */
  private initDataTable(): void {
    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      searching: true,
      lengthChange: false,

      dom: '<"dt-row-top"<"dt-left"f><"dt-right dt-actions">>rt<"row"<"col-md-6"i><"col-md-6"p>>',

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
          last: '&raquo;'
        }
      },

      initComplete: () => {
        setTimeout(() => this.mountDtFilterToTopbar(), 0);
      },
      drawCallback: () => {
        setTimeout(() => this.mountDtFilterToTopbar(), 0);
      }
    };
  }

  private loadLeaderStaffData(periodId: string, orgId: string): void {
    this.loadingTable = true;
    this.dataTable = [];
    this.originalRows = [];

    const periodeObj = (this.periodeOptions || []).find(function(p){ return p.value === periodId; });
    const periodeLabel = periodeObj ? periodeObj.label : '';

    this.tupTpaService.viewLeaderStaffData(periodId, orgId).subscribe({
      next: (res: any) => {
        console.log('VIEW LEADER STAFF RES =', res);
        console.log('VIEW LEADER STAFF DATA =', res && res.data ? res.data : []);
        console.log('VIEW LEADER STAFF LENGTH =', res && res.data ? res.data.length : 0);

        const apiRows = (res && res.data) ? res.data : [];
        const rows = this.mapLeaderStaffRows(apiRows, periodeLabel);

        console.log('MAPPED ROWS =', rows);

        this.originalRows = rows;
        this.rerenderDatatable([...this.originalRows], true);

        this.loadingTable = false;
      },
      error: (err) => {
        console.error('API ERROR viewLeaderStaffData:', err);
        this.dataTable = [];
        this.originalRows = [];
        this.loadingTable = false;
      }
    });
  }

  private mapLeaderStaffRows(apiRows: any[], selectedPeriodeLabel?: string): any[] {
    // Kalau label dropdown bentuknya "TelU Point TPA - Genap 2024 - 2025"
    // kita pecah jadi title & subtitle sederhana.
    let periodeTitle = '';
    let periodeSubtitle = '';

    if (selectedPeriodeLabel) {
      const parts = selectedPeriodeLabel.split('-').map(x => x.trim());
      // contoh: ["TelU Point TPA", "Genap 2024", "2025"]
      periodeTitle = parts[0] || selectedPeriodeLabel;
      periodeSubtitle = parts.slice(1).join(' - ') || '';
    }

    return (apiRows || []).map((x: any) => ({
      // dipakai UI
      periodeTitle: periodeTitle || 'TelU Point TPA',
      periodeSubtitle: periodeSubtitle || '',

      nip: x.employee_id,                 // NIP dari API
      namaPegawai: x.fullname,
      jabatanPegawai: x.position_name,
      periodePenilaian: x.tpa_content_period, // tambahan kalau kamu mau tampilkan periode penilaian di tabel

      jumlahPegawai: x.jumlah_staff,
      jumlahPenilaian: x.jml_assessment,
      penilaianSelesai: x.jml_assessment_selesai,

      // simpan field asli untuk kebutuhan navigate/detail nanti
      employeeId: x.employee_id,
      positionId: x.position_id,
      workLocationId: x.work_location_id,
      tpaContentPeriodId: x.tpa_content_period_id
    }));
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

            // <-- mount filter setelah DT render ulang
            setTimeout(() => this.mountDtFilterToTopbar(), 0);

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
      setTimeout(() => {
        this.dtTrigger.next();
        setTimeout(() => this.mountDtFilterToTopbar(), 0);
      }, 0);
    }
  }

  // ===== FILTER MAIN PAGE =====
  onPeriodeChange(val: any): void {
    this.selectedPeriode = val;
  }

  applyFilter(): void {
    // dummy: tidak ubah isi, tapi rerender biar pagination stabil
    this.rerenderDatatable(this.dataTable, true);
    this.successToast('Filter diterapkan (dummy).');
  }

  applySearch(): void {
    // dummy: belum filter beneran, tapi rerender supaya datatable tetap konsisten
    this.rerenderDatatable(this.dataTable, true);
    this.successToast('Pencarian dijalankan (dummy).');
  }

  // ===== NAVIGATION =====
  public onDetail(row: any): void {
    const periodId = this.selectedPeriode ? this.selectedPeriode : '1';

    // id yg dipakai route
    const assessorId = row && (row.employeeId || row.nip) ? (row.employeeId || row.nip) : '';

    const leaderPayload = {
      nama: row.namaPegawai || '',
      nip: row.nip || '',
      jabatan: row.jabatanPegawai || '',
      unit: row.unitPegawai || row.unit || '', // kalau belum ada, nanti tetap kosong
      fotoUrl: row.fotoUrl || ''               // kalau belum ada, nanti tetap kosong
    };

    this.router.navigate(
      ['/penilai-dua-atasan-tidak-langsung/daftar-data-penilaian-pegawai', assessorId, periodId],
      { state: { leader: leaderPayload } }
    );
  }

  // ===== TOAST =====
  private successToast(msg: string): void {
    this.broadcasterService.notifBroadcast(true, {
      title: 'Sukses',
      msg: msg || 'Message sukses',
      timeout: 3000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'success'
    });
  }
}