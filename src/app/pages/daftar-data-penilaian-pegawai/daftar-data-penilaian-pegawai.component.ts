// daftar-data-penilaian-pegawai.component.ts
import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TupTpaService } from 'src/app/_services/tup-tpa.service';

@Component({
  selector: 'app-daftar-data-penilaian-pegawai',
  templateUrl: './daftar-data-penilaian-pegawai.component.html',
  styleUrls: ['./daftar-data-penilaian-pegawai.component.scss']
})
export class DaftarDataPenilaianPegawaiComponent implements OnInit, OnDestroy {
  // ===== DATATABLE (mandatory) =====
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();

  public loadingTable = false;

  // search keyword (custom)
  public keyword = '';

  // param dari route (sementara)
  public assessorId = '';
  public periodId = '';

  // data tabel (dummy dulu, nanti dari API)
  public dataTable: any[] = [];
  public rawData: any[] = [];

  public headerProfil = {
    nama: '-',
    nip: '-',
    unit: '-',
    jabatan: '',
    foto: ''
  };

  public headerPimpinan = {
    penilaiPertama: '-',
    penilaiKedua: '-'
  };

  public employeeDetail: any = null;

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private route: ActivatedRoute,
    private router: Router,
    private tupTpaService: TupTpaService
  ) {
    // mengikuti pola project
    this.translateService.setDefaultLang(localStorage.getItem('lang'));
    this.broadcasterService.changeLangBroadcast$.subscribe(res => {
      this.translateService.setDefaultLang(res.lang);
    });
  }

  ngOnInit(): void {
    this.initDataTable();

    this.assessorId = this.route.snapshot.paramMap.get('assessorId') || '';
    this.periodId = this.route.snapshot.paramMap.get('periodId') || '';

    const st: any = window.history && window.history.state ? window.history.state : null;

    if (st && st.leader) {
      this.headerProfil.nama = st.leader.nama || '-';
      this.headerProfil.nip = st.leader.nip || '-';
      this.headerProfil.unit = st.leader.unit || '-';
      this.headerProfil.jabatan = st.leader.jabatan || '-';
      this.headerProfil.foto = st.leader.foto || '';

      sessionStorage.setItem('tpa_leader_header', JSON.stringify(this.headerProfil));
    } else {
      var savedLeader = sessionStorage.getItem('tpa_leader_header');
      if (savedLeader) {
        this.headerProfil = JSON.parse(savedLeader);
      }
    }

    this.loadEmployeeDetail();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }

  /** Datatable config (pagination oke, search bawaan dimatikan) */
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

  /** Load awal: tampilkan semua data saat page dibuka */
  private loadInitialData(): void {
    this.loadingTable = true;

    // sementara hardcode periodId = 1 dulu (nanti kita ambil dari halaman sebelumnya / dropdown)
    const periodId = this.periodId || '1';
    const assessorEmployeeId = this.assessorId || '';

    this.tupTpaService.getViewStaffData(periodId, assessorEmployeeId).subscribe({
      next: (res: any) => {
        const apiRows = (res && res.data) ? res.data : [];

        // Kalau kamu mau filter hanya pegawai yg dipilih dari halaman sebelumnya:
        // pegawaiId = this.pegawaiId (dari route param)
        const filteredRows = apiRows;
        // Mapping sesuai kebutuhan tabel page ini (dummy structure kamu)
        this.rawData = filteredRows.map((x: any) => ({
          pegawaiId: x.employee_id,
          nip: x.employee_id || '-',
          namaPegawai: x.employee_name || '-',

          // karena response API tidak ada field unit/program studi
          unitProgramStudi: '-',

          // simpan nama assessor terpisah, jangan dipakai untuk unit
          assessorName: x.assessor_name || '-',

          penilaianId: x.assessment_data_id || '-',

          contentPeriodName: x.content_period_name || '-',
          staffLevel: x.staff_level,
          tpaContentPeriodId: x.tpa_content_period_id,

          // status asli dari backend
          isTkpExists: x.is_tkp_exists,
          statusTkp: x.status_tkp || '-', //status target DTKP
          dtkpTotal: x.dtkp_total ? x.dtkp_total : 0,

          // ini ada di response, tapi kemungkinan milik penilai 2
          statusApproveTarget2: x.status_approve_target_2 || '-',

          // karena belum ada field yang jelas untuk approve target penilai langsung
          statusApproveTargetPenilaiLangsung: '-',

          statusAchievement: x.status_achievement || '-',
          statusApproveAchievement: x.status_approve_achievement || '-',
          statusApproveAchievement2: x.status_approve_achievement_2 || '-',
          workAttitudeStatus1: x.work_attitude_assessor_status_1 || '-',
          workAttitudeStatus2: x.work_attitude_assessor_status_2 || '-'
        }));

        this.dataTable = this.rawData.slice();

        setTimeout(() => this.dtTrigger.next(), 0);
        this.loadingTable = false;
      },
      error: (err) => {
        console.error('API ERROR ViewStaffData:', err);
        this.rawData = [];
        this.dataTable = [];
        setTimeout(() => this.dtTrigger.next(), 0);
        this.loadingTable = false;
        this.toastError('Gagal mengambil data staff dari API');
      }
    });
  }

  /** Search klik / enter */
  public onSearch(): void {
    const filtered = this.buildFilteredData(this.rawData || []);
    this.rerenderDatatable(filtered, true);
  }

  /** Ketika keyword dikosongkan -> balik ke semua data */
  public onKeywordChange(): void {
    const k = (this.keyword || '').trim();
    if (k === '') {
      const filtered = this.buildFilteredData(this.rawData || []);
      this.rerenderDatatable(filtered, true);
    }
  }

  /** Builder filter: keyword */
  private buildFilteredData(rows: any[]): any[] {
    let result = rows ? rows.slice() : [];
    const keywordVal = (this.keyword || '').trim().toLowerCase();

    if (!keywordVal) return result;

    result = result.filter(x => {
      const nip = (x.nip || '').toLowerCase();
      const nama = (x.namaPegawai || '').toLowerCase();
      const unit = (x.unitProgramStudi || '').toLowerCase();
      return (
        nip.indexOf(keywordVal) !== -1 ||
        nama.indexOf(keywordVal) !== -1 ||
        unit.indexOf(keywordVal) !== -1
      );
    });

    return result;
  }

  /** Re-render DataTables (pola MasukkanNKU) */
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

  /** Klik tombol Penilaian (nanti diarahkan ke page foto 2) */
  public onPenilaian(row: any): void {
    const pegawaiId = row.pegawaiId;
    const penilaianId = row.penilaianId;
    const prefix = this.getRolePrefix();

    var pegawaiHeader = {
      nama: row.namaPegawai || '-',
      nip: row.nip || '-',
      lokasi: row.unitProgramStudi || '-',
      periode: row.contentPeriodName || '-',
      deskripsi: row.staffLevel === 1 ? 'STAFF' : '-'
    };

    sessionStorage.setItem('tpa_pegawai_header', JSON.stringify(pegawaiHeader));

    this.router.navigate(
      [
        prefix,
        'daftar-data-penilaian-pegawai',
        pegawaiId,
        'target-kinerja',
        penilaianId
      ],
      {
        state: {
          pegawai: {
            nama: row.namaPegawai || '-',
            nip: row.nip || '-',
            lokasi: row.unitProgramStudi || '-',
            periode: row.contentPeriodName || '-',
            deskripsi: row.staffLevel === 1 ? 'STAFF' : '-'
          }
        }
      }
    );
  }

  private getRolePrefix(): string {
    const url = this.router.url || '';

    if (url.indexOf('/sdm-penilai-dua') !== -1) {
      return '/sdm-penilai-dua';
    }

    if (url.indexOf('/sdm-penilai-satu') !== -1) {
      return '/sdm-penilai-satu';
    }

    if (url.indexOf('/penilai-satu-atasan-langsung') !== -1) {
      return '/penilai-satu-atasan-langsung';
    }

    if (url.indexOf('/penilai-dua-atasan-tidak-langsung') !== -1) {
      return '/penilai-dua-atasan-tidak-langsung';
    }

    return '';
  }


  // ===== DUMMY DATA =====
  private fetchRawData(pegawaiId?: string): Promise<any[]> {
    return new Promise(resolve => {
      // pegawaiId belum dipakai, nanti untuk filter by API
      const dummy = [
        {
          nip: '01760040',
          namaPegawai: 'Setyorini',
          unitProgramStudi: 'Urusan Pengembangan Produk TI Non-Akademik',
          // nanti bisa ditambah field status2 sesuai API
          penilaianId: '1'
        },
        {
          nip: '01760041',
          namaPegawai: 'Bambang Supriyanto',
          unitProgramStudi: 'Ketua Program Studi S2 Informatika (FIF)',
          penilaianId: '2'
        },
        {
          nip: '01760042',
          namaPegawai: 'Dewi Lestari',
          unitProgramStudi: 'Ketua Program Studi S1 Informatika (FIF)',
          penilaianId: '3'
        }
      ];

      setTimeout(() => resolve(dummy), 250);
    });
  }

  // ===== TOAST =====
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
      timeout: 3000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'info'
    });
  }

  // employee detail 
  public isLoadingEmployee: boolean = false;
  public loadEmployeeDetail(): void {
    const employeeId = this.assessorId || '';
    if (!employeeId) return;

    this.isLoadingEmployee = true;

    this.tupTpaService.getEmployeeDetail(employeeId).subscribe({
      next: (res: any) => {
        this.employeeDetail = res && res.data ? res.data : null;

        if (this.employeeDetail) {
          this.headerProfil = {
            nama: this.employeeDetail.employee_name || '-',
            nip: this.employeeDetail.employee_id || '-',
            unit: this.employeeDetail.organization_structure_name || '-',
            jabatan: this.employeeDetail.work_description || '-',
            foto: this.employeeDetail.photo_url || ''
          };

          this.headerPimpinan = {
            penilaiPertama: this.employeeDetail.assessor_1 || '-',
            penilaiKedua: this.employeeDetail.assessor_2 || '-'
          };
        }

        this.isLoadingEmployee = false;
      },
      error: () => {
        this.isLoadingEmployee = false;
        this.toastError('Gagal mengambil detail pegawai');
      }
    });
  }
}
