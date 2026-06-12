import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TupTpaService } from 'src/app/_services/tup-tpa.service';

type TabType = 'target' | 'sikap' | 'inovasi';
type TableType = 'inovasi' | 'penghargaan' | 'kontribusi';

@Component({
  selector: 'app-inovasi-penghargaan-kontribusi',
  templateUrl: './inovasi-penghargaan-kontribusi.component.html',
  styleUrls: ['./inovasi-penghargaan-kontribusi.component.scss']
})
export class InovasiPenghargaanKontribusiComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective) dtElements!: QueryList<DataTableDirective>;

  // ===== TAB ACTIVE =====
  public activeTab: TabType = 'inovasi';

  public pegawaiId = '';
  public penilaianId = '';

  public organizationId = '';
  public tpaContentPeriodId = '';

  public loadingPage = false;

  public pegawai: any = {
    nama: '-',
    nip: '-',
    lokasi: '-',
    periode: '-',
    deskripsi: '-'
  };

  // ===== DATATABLE =====
  public dtOptions: DataTables.Settings[] = [];
  public dtTriggerInovasi: Subject<any> = new Subject<any>();
  public dtTriggerPenghargaan: Subject<any> = new Subject<any>();
  public dtTriggerKontribusi: Subject<any> = new Subject<any>();

  // ===== SEARCH =====
  public searchInovasi = '';
  public searchPenghargaan = '';
  public searchKontribusi = '';

  // ===== DATA =====
  public dataInovasi: any[] = [];
  public dataPenghargaan: any[] = [];
  public dataKontribusi: any[] = [];

  // simpan master untuk filter/search (dummy)
  private masterInovasi: any[] = [];
  private masterPenghargaan: any[] = [];
  private masterKontribusi: any[] = [];

  // ===== TOTALS =====
  public totalInovasi = 0;
  public totalPenghargaan = 0;
  public totalKontribusi = 0;

  public totalAllScore = 0;
  public totalAllExclude = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tupTpaService: TupTpaService
  ) {}

  ngOnInit(): void {
    this.pegawaiId = this.route.snapshot.paramMap.get('pegawaiId') || '';
    this.penilaianId = this.route.snapshot.paramMap.get('penilaianId') || '';

    this.tpaContentPeriodId =
      this.route.snapshot.queryParamMap.get('tpa_content_period_id') ||
      this.route.snapshot.queryParamMap.get('tpaContentPeriodId') ||
      this.penilaianId ||
      '';

    this.organizationId =
      this.route.snapshot.queryParamMap.get('organization_id') ||
      this.route.snapshot.queryParamMap.get('organizationId') ||
      '';

    var st: any = window.history && window.history.state ? window.history.state : null;

    // Ambil fallback dari history.state dulu
    if (st) {
      if (st.organizationId) {
        this.organizationId = String(st.organizationId);
      }

      if (st.organization_id) {
        this.organizationId = String(st.organization_id);
      }

      if (st.tpaContentPeriodId) {
        this.tpaContentPeriodId = String(st.tpaContentPeriodId);
      }

      if (st.tpa_content_period_id) {
        this.tpaContentPeriodId = String(st.tpa_content_period_id);
      }
    }

    if (st && st.pegawai) {
      this.pegawai.nama = st.pegawai.nama || '-';
      this.pegawai.nip = st.pegawai.nip || '-';
      this.pegawai.lokasi = st.pegawai.lokasi || '-';
      this.pegawai.periode = st.pegawai.periode || '-';
      this.pegawai.deskripsi = st.pegawai.deskripsi || '-';

      // TARUH DI SINI
      // fallback organizationId dari object pegawai
      if (!this.organizationId && st.pegawai.organization_id) {
        this.organizationId = String(st.pegawai.organization_id);
      }

      if (!this.organizationId && st.pegawai.organizationId) {
        this.organizationId = String(st.pegawai.organizationId);
      }

      sessionStorage.setItem('tpa_pegawai_header', JSON.stringify(this.pegawai));
    } else {
      var savedPegawai = sessionStorage.getItem('tpa_pegawai_header');
      if (savedPegawai) {
        this.pegawai = JSON.parse(savedPegawai);
      }
    }

    console.log('[IPK][ngOnInit] pegawaiId =', this.pegawaiId);
    console.log('[IPK][ngOnInit] penilaianId =', this.penilaianId);
    console.log('[IPK][ngOnInit] tpaContentPeriodId =', this.tpaContentPeriodId);
    console.log('[IPK][ngOnInit] organizationId =', this.organizationId);

    // Init DataTables config (3 tabel, index beda)
    this.initDtOptions();

    // TEST SEMENTARA - hapus lagi setelah berhasil
    

    this.loadIpkData();
  }

  ngOnDestroy(): void {
    this.dtTriggerInovasi.unsubscribe();
    this.dtTriggerPenghargaan.unsubscribe();
    this.dtTriggerKontribusi.unsubscribe();
  }

  // =========================
  // TAB NAV
  // =========================
  goToTab(tab: 'target' | 'sikap' | 'inovasi') {
    this.activeTab = tab;

    let segment = '';

    if (tab === 'target') segment = 'target-kinerja';
    if (tab === 'sikap') segment = 'sikap-kerja';
    if (tab === 'inovasi') segment = 'ipk';

    this.router.navigate(
      [
        '../..',   // naik 2 level: keluar dari target-kinerja/:penilaianId
        segment,
        this.penilaianId
      ],
      { relativeTo: this.route }
    );
  }

  // =========================
  // DATATABLE OPTIONS
  // =========================
  private initDtOptions(): void {
    const base: DataTables.Settings = {
      paging: true,
      info: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      deferLoading: 1,

      destroy: true,
      retrieve: true,

      searching: false,
      ordering: false,
      lengthChange: false,

      dom:
        "<'row'<'col-12'tr>>" +
        "<'row mt-2'<'col-sm-6'i><'col-sm-6 text-right'p>>",

      language: {
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
        zeroRecords: 'Data tidak ditemukan!',
        emptyTable: 'Data tidak ditemukan!',
        lengthMenu: '_MENU_ data',
        processing: '',
        infoFiltered: '',
        infoEmpty: 'Menampilkan 0 - 0 dari 0 data',
        search: 'Cari:',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;'
        }
      }
    };

    this.dtOptions[1] = { ...base };
    this.dtOptions[2] = { ...base };
    this.dtOptions[3] = { ...base };
  }

  private mapIpkRows(items: any[], type: TableType): any[] {
    var result: any[] = [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i] || {};

      result.push({
        id: item.id,

        namaKegiatan:
          this.safeText(item.activity_award) ||
          this.safeText(item.activity_inovation) ||
          this.safeText(item.activity_innovation) ||
          this.safeText(item.activity_contribution) ||
          this.safeText(item.nama_kegiatan) ||
          '-',

        detailKategori:
          this.safeText(item.detail_category_award) ||
          this.safeText(item.detail_category_inovation) ||
          this.safeText(item.detail_category_innovation) ||
          this.safeText(item.detail_category_contribution) ||
          this.safeText(item.detail_kategori) ||
          '-',

        tipeKategori:
          this.safeText(item.category_type_award) ||
          this.safeText(item.category_type_inovation) ||
          this.safeText(item.category_type_innovation) ||
          this.safeText(item.category_type_contribution) ||
          this.safeText(item.tipe_kategori) ||
          '-',

        durasi:
          this.safeText(item.duration) ||
          this.safeText(item.durasi) ||
          '-',

        jabatan:
          this.safeText(item.structural_position) ||
          this.safeText(item.position) ||
          this.safeText(item.jabatan) ||
          '-',

        tanggal:
          this.safeText(item.date) ||
          this.safeText(item.activity_date) ||
          this.safeText(item.created_at) ||
          '-',

        suratTugasUrl:
          this.safeText(item.activity_award_file) ||
          this.safeText(item.activity_inovation_file) ||
          this.safeText(item.activity_innovation_file) ||
          this.safeText(item.activity_contribution_file) ||
          '#',

        statusExclude:
          this.normalizeExcludeStatus(item),

        score:
          this.normalizeScore(item)
      });
    }

    return result;
  }

  private loadIpkFromApi(): void {
    console.log('[IPK] loadIpkFromApi terpanggil');

    this.tupTpaService.getIpk(this.tpaContentPeriodId, this.pegawaiId).subscribe({
      next: (res: any) => {
        console.log('[IPK] response =', res);

        var data = res && res.data ? res.data : {};

        var inovation = data && Array.isArray(data.inovation) ? data.inovation : [];
        var award = data && Array.isArray(data.award) ? data.award : [];
        var contribution = data && Array.isArray(data.contribution) ? data.contribution : [];

        this.masterInovasi = this.mapIpkRows(inovation, 'inovasi');
        this.masterPenghargaan = this.mapIpkRows(award, 'penghargaan');
        this.masterKontribusi = this.mapIpkRows(contribution, 'kontribusi');

        this.dataInovasi = this.masterInovasi.slice();
        this.dataPenghargaan = this.masterPenghargaan.slice();
        this.dataKontribusi = this.masterKontribusi.slice();

        this.recalcTotals();
        this.loadingPage = false;

        setTimeout(() => {
          this.triggerAllTables();
        }, 100);
      },
      error: (err: any) => {
        console.log('[IPK] getIpk error =', err);

        this.recalcTotals();
        this.loadingPage = false;

        setTimeout(() => {
          this.triggerAllTables();
        }, 100);
      }
    });
  }

  private loadIpkData(): void {
    console.log('[IPK] loadIpkData terpanggil');

    this.loadingPage = true;

    this.setDefaultIpkData();

    console.log('[IPK] tpaContentPeriodId before API =', this.tpaContentPeriodId);
    console.log('[IPK] pegawaiId / nik before API =', this.pegawaiId);

    if (!this.tpaContentPeriodId || !this.pegawaiId) {
      console.log('[IPK] STOP, tpaContentPeriodId / nik kosong');

      this.recalcTotals();
      this.loadingPage = false;
      this.triggerAllTables();
      return;
    }

    this.loadIpkFromApi();
  }

  // Tetap isi inovasi & kontribusi default lama, penghargaan diisi dari API.
  private setDefaultIpkData(): void {
    // INOVASI
    this.masterInovasi = [
      {
        namaKegiatan: '[Sudah Tahap Prototype] Aplikasi QMS PUTI Versi 2.0',
        detailKategori: 'Inovasi terimplementasi di tingkat Universitas/YPT Group',
        tipeKategori: 'Sudah Tahap Prototype',
        jabatan: 'Anggota Pengusul/Penulis',
        tanggal: '2025-02-13 00:00:00',
        statusExclude: 'TIDAK',
        score: 1.08
      },
      {
        namaKegiatan: '[Tahap Ide] Aplikasi QMS PUTI Versi 3.0',
        detailKategori: 'Inovasi terimplementasi di tingkat Direktorat/Fakultas',
        tipeKategori: 'Tahapan Ide',
        jabatan: 'Anggota Pengusul/Penulis',
        tanggal: '2025-06-12 00:00:00',
        statusExclude: 'TIDAK',
        score: 0.24
      },
      {
        namaKegiatan: '[Tahap Implementasi] Aplikasi QMS PUTI Versi 3.0',
        detailKategori: 'Inovasi terimplementasi di tingkat Direktorat',
        tipeKategori: 'Tahapan Implementasi',
        jabatan: 'Anggota Pengusul/Penulis',
        tanggal: '2025-10-22 00:00:00',
        statusExclude: 'TIDAK',
        score: 0.54
      }
    ];

    // PENGHARGAAN diisi dari API
    this.masterPenghargaan = [];

    // KONTRIBUSI
    this.masterKontribusi = [
      {
        namaKegiatan: '[Kepanitiaan Umum] Pembuatan Video Profil...',
        detailKategori: 'Kontribusi dalam kegiatan pada tin...',
        tipeKategori: 'Kepanitiaan umum',
        durasi: 'Bulan',
        jabatan: 'Anggota',
        tanggal: '2025-01-13 00:00:00',
        suratTugasUrl: '#',
        statusExclude: 'TIDAK',
        score: 0.65
      },
      {
        namaKegiatan: '[Kepanitiaan Umum] Audit Mutu Internal...',
        detailKategori: 'Kontribusi dalam kegiatan pada tin...',
        tipeKategori: 'Kepanitiaan umum',
        durasi: 'Bulan',
        jabatan: 'Anggota',
        tanggal: '2025-05-19 00:00:00',
        suratTugasUrl: '#',
        statusExclude: 'TIDAK',
        score: 0.65
      },
      {
        namaKegiatan: '[Kepanitiaan Umum] Pembuatan Video Tutorial...',
        detailKategori: 'Kontribusi dalam kegiatan pada tin...',
        tipeKategori: 'Kepanitiaan umum',
        durasi: 'Bulan',
        jabatan: 'Anggota',
        tanggal: '2025-09-19 00:00:00',
        suratTugasUrl: '#',
        statusExclude: 'TIDAK',
        score: 1.0
      }
    ];

    // assign ke data tampil
    this.dataInovasi = this.masterInovasi.slice();
    this.dataPenghargaan = this.masterPenghargaan.slice();
    this.dataKontribusi = this.masterKontribusi.slice();
  }



  private safeText(v: any): string {
    if (v === null || v === undefined) return '';
    return String(v).trim();
  }

  private normalizeExcludeStatus(item: any): string {
    if (!item) return 'TIDAK';

    if (item.status_exclude !== undefined && item.status_exclude !== null) {
      return this.booleanToYaTidak(item.status_exclude);
    }

    if (item.exclude_status !== undefined && item.exclude_status !== null) {
      return this.booleanToYaTidak(item.exclude_status);
    }

    if (item.is_exclude !== undefined && item.is_exclude !== null) {
      return this.booleanToYaTidak(item.is_exclude);
    }

    if (item.active_status !== undefined && item.active_status !== null) {
      return String(item.active_status).toUpperCase() === '0' ? 'YA' : 'TIDAK';
    }

    return 'TIDAK';
  }

  private booleanToYaTidak(value: any): string {
    var str = String(value).toLowerCase();

    if (str === 'true' || str === '1' || str === 'ya' || str === 'yes') {
      return 'YA';
    }

    return 'TIDAK';
  }

  private normalizeScore(item: any): number {
    if (!item) return 0;

    if (item.score !== undefined && item.score !== null && item.score !== '') {
      return Number(item.score);
    }

    if (item.final_score !== undefined && item.final_score !== null && item.final_score !== '') {
      return Number(item.final_score);
    }

    if (item.total_score !== undefined && item.total_score !== null && item.total_score !== '') {
      return Number(item.total_score);
    }

    return 0;
  }

  // =========================
  // TOTALS
  // =========================
  private recalcTotals(): void {
    this.totalInovasi = this.sumScore(this.dataInovasi);
    this.totalPenghargaan = this.sumScore(this.dataPenghargaan);
    this.totalKontribusi = this.sumScore(this.dataKontribusi);

    this.totalAllScore = this.round2(
      this.totalInovasi + this.totalPenghargaan + this.totalKontribusi
    );

    const excl = (arr: any[]) =>
      (arr || [])
        .filter(x => String(x.statusExclude || '').toUpperCase() === 'YA')
        .reduce((acc, x) => acc + Number(x.score || 0), 0);

    this.totalAllExclude = this.round2(
      excl(this.dataInovasi) + excl(this.dataPenghargaan) + excl(this.dataKontribusi)
    );
  }

  private sumScore(arr: any[]): number {
    const total = (arr || []).reduce((acc, x) => acc + Number(x.score || 0), 0);
    return this.round2(total);
  }

  private round2(n: number): number {
    return Math.round(n * 100) / 100;
  }

  // =========================
  // SEARCH (custom)
  // =========================
  applySearch(type: TableType): void {
    if (type === 'inovasi') {
      const q = (this.searchInovasi || '').toLowerCase().trim();
      this.dataInovasi = this.filterTable(this.masterInovasi, q);
      this.recalcTotals();
      this.rerender('inovasi');
      return;
    }

    if (type === 'penghargaan') {
      const q = (this.searchPenghargaan || '').toLowerCase().trim();
      this.dataPenghargaan = this.filterTable(this.masterPenghargaan, q);
      this.recalcTotals();
      this.rerender('penghargaan');
      return;
    }

    const q = (this.searchKontribusi || '').toLowerCase().trim();
    this.dataKontribusi = this.filterTable(this.masterKontribusi, q);
    this.recalcTotals();
    this.rerender('kontribusi');
  }

  private filterTable(source: any[], q: string): any[] {
    if (!q) return (source || []).slice();
    return (source || []).filter(x => {
      const join = [
        x.namaKegiatan,
        x.detailKategori,
        x.tipeKategori,
        x.jabatan,
        x.tanggal,
        x.statusExclude
      ]
        .join(' ')
        .toLowerCase();

      return join.includes(q);
    });
  }

  // =========================
  // DATATABLE RERENDER (FIX PAGINATION)
  // =========================
  private rerender(type: 'inovasi' | 'penghargaan' | 'kontribusi'): void {
    const list = this.dtElements ? this.dtElements.toArray() : [];

    // urutan table di HTML harus: inovasi, penghargaan, kontribusi
    const indexMap: any = { inovasi: 0, penghargaan: 1, kontribusi: 2 };
    const idx = indexMap[type];

    if (!list[idx]) {
      this.fireTrigger(type);
      return;
    }

    if (!list[idx].dtInstance || typeof (list[idx].dtInstance as any).then !== 'function') {
      setTimeout(() => this.fireTrigger(type), 0);
      return;
    }

    list[idx].dtInstance
      .then((dt: DataTables.Api) => {
        dt.destroy();
        setTimeout(() => this.fireTrigger(type), 0);
      })
      .catch(() => {
        setTimeout(() => this.fireTrigger(type), 0);
      });
  }

  private fireTrigger(type: 'inovasi' | 'penghargaan' | 'kontribusi'): void {
    if (type === 'inovasi') {
      this.dtTriggerInovasi.next();
      return;
    }
    if (type === 'penghargaan') {
      this.dtTriggerPenghargaan.next();
      return;
    }
    this.dtTriggerKontribusi.next();
  }

  private triggerAllTables(): void {
    setTimeout(() => {
      this.dtTriggerInovasi.next();
      this.dtTriggerPenghargaan.next();
      this.dtTriggerKontribusi.next();
    }, 0);
  }

  // =========================
  // ACTION
  // =========================
  downloadSuratTugas(row: any): void {
    const url = row && row.suratTugasUrl ? row.suratTugasUrl : '';
    if (!url || url === '#') return;
    window.open(url, '_blank');
  }
}
