import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefaultConfig } from 'src/app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { TupTpaService } from 'src/app/_services/tup-tpa.service';

interface GeneralInfo {
  label: string;
  value: string;
}

interface AccordionItem {
  title: string;
  open: boolean;
}

interface IpkRow {
  no: number;
  namaKegiatan: string;
  detailKategori: string;
  tipeKategori: string;
  jabatan: string;
  tanggal: string;
  statusExclude: string;
  score: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './detail-penilaian-pegawai.component.html',
  styleUrls: ['./detail-penilaian-pegawai.component.scss']
})
export class DetailPenilaianPegawaiComponent implements OnInit {
  public defaultConfig: any;
  pageTitle = 'Detail Manajemen Template';
  pageSubtitle = 'Daftar Detail Konten Periode Penilaian';
  selectedKomponen: string = 'Pilih Komponen';   // default
  komponenOptions = ['Pilih Komponen', 'Komponen 1', 'Komponen 2', 'Komponen 3'];
  loadingPage = false;
  periodId = '';

  // ===== Informasi umum (3 field dari API, sisanya dummy) =====
  generalInfo: GeneralInfo[] = [
    { label: 'Nama Periode',                value: '-' },
    { label: 'Tanggal Mulai Periode',       value: '-' },
    { label: 'Tanggal Akhir Periode',       value: '-' },
    { label: 'Terhitung Mulai Tanggal (TMT)', value: '01/01/2022' },
    { label: 'Bobot Penilai Pertama',       value: '50%' },
    { label: 'Bobot Penilai Kedua',         value: '50%' },
    { label: 'Status Aktif',                value: 'Tidak Aktif' },
  ];

  // ===== Pilih komponen (dropdown di kanan kartu pertama) =====

  // ===== Komponen 1: DTKP – accordion list =====
  dtkpItems: AccordionItem[] = [
    { title: 'Daftar DTKP', open: true },
    { title: 'Referensi',   open: false },
    { title: 'Satuan',      open: false },
    { title: 'Ukuran',      open: false },
    { title: 'Target',      open: true },
  ];

  targetTw = ['Target TW 1', 'Target TW 2', 'Target TW 3', 'Target TW 4'];

  // ===== Komponen 2: Sikap Kerja =====
  sikapKerja: AccordionItem[] = [
    { title: 'Sikap Kerja: Harmony',   open: true },
    { title: 'Sikap Kerja: Excellence', open: false },
    { title: 'Sikap Kerja: Integrity',  open: false },
  ];

  sikapDeskripsi = `Kecakapan pegawai untuk menyampaikan informasi secara jelas dan sistematis
(lisan maupun tertulis), memastikan pemahaman, mendengarkan secara aktif, terampil,
dan mengemukakan argumentasi yang logis, serta menggagas sistem komunikasi terbuka
secara strategis untuk mencari solusi.`;

  // ===== Komponen 3: IPK – Inovasi, Kontribusi, Penghargaan =====
  inovasiRows: IpkRow[] = [
    {
      no: 1,
      namaKegiatan: '[Sudah Tahap Prototype] Aplikasi QMS PUTI Versi 2.0',
      detailKategori: 'Inovasi terimplementasi di tingkat Universitas/YPT Group',
      tipeKategori: 'Sudah Tahap Prototype',
      jabatan: 'Anggota Pengusul / Penulis',
      tanggal: '2025-02-13 00:00:00',
      statusExclude: 'TIDAK',
      score: 1.08,
    },
    {
      no: 2,
      namaKegiatan: '[Tahap Ide] Aplikasi QMS PUTI Versi 3.0',
      detailKategori: 'Inovasi terimplementasi di tingkat Direktorat/Fakultas',
      tipeKategori: 'Tahapan Ide',
      jabatan: 'Anggota Pengusul / Penulis',
      tanggal: '2025-06-12 00:00:00',
      statusExclude: 'TIDAK',
      score: 0.24,
    },
    {
      no: 3,
      namaKegiatan: '[Tahap Implementasi] Aplikasi QMS PUTI Versi 3.0',
      detailKategori: 'Inovasi terimplementasi di tingkat Direktorat',
      tipeKategori: 'Tahapan Implementasi',
      jabatan: 'Anggota Pengusul / Penulis',
      tanggal: '2025-10-22 00:00:00',
      statusExclude: 'TIDAK',
      score: 0.54,
    },
  ];

  kontribusiRows: IpkRow[]   = [...this.inovasiRows];
  penghargaanRows: IpkRow[]  = [...this.inovasiRows];

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private route: ActivatedRoute,
    private tupTpaService: TupTpaService
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.defaultConfig = DefaultConfig;
  }

  ngOnInit() {
    this.periodId = this.route.snapshot.paramMap.get('id') || '';
    if (this.periodId) {
      this.loadPeriodDetail(this.periodId);
    }
  }

  private loadPeriodDetail(id: string): void {
    this.loadingPage = true;

    this.tupTpaService.getTpaPeriodById(id).subscribe(
      (res: any) => {
        const item = res && res.data ? res.data : null;
        if (item) {
          this.applyPeriodInfo(item);
          this.loadingPage = false;
        } else {
          this.loadPeriodDetailFromList(id);
        }
      },
      () => {
        this.loadPeriodDetailFromList(id);
      }
    );
  }

  private loadPeriodDetailFromList(id: string): void {
    this.tupTpaService.getTpaPeriod().subscribe(
      (res: any) => {
        const list = res && res.success && Array.isArray(res.data) ? res.data : [];
        const item = list.find((row: any) => String(row.id) === String(id));
        if (item) {
          this.applyPeriodInfo(item);
        } else {
          this.broadcasterService.notifBroadcast(true, {
            title: 'Gagal',
            msg: 'Data periode tidak ditemukan.',
            timeout: 5000,
            theme: 'bootstrap',
            position: 'top-right',
            type: 'error',
          });
        }
        this.loadingPage = false;
      },
      () => {
        this.loadingPage = false;
        this.broadcasterService.notifBroadcast(true, {
          title: 'Gagal',
          msg: 'Gagal memuat detail periode.',
          timeout: 5000,
          theme: 'bootstrap',
          position: 'top-right',
          type: 'error',
        });
      }
    );
  }

  private applyPeriodInfo(item: any): void {
    const startDate = this.extractPeriodDate(
      item,
      'start_date',
      'period_start_date',
      'start_period_date'
    );
    const endDate = this.extractPeriodDate(
      item,
      'end_date',
      'period_end_date',
      'end_period_date'
    );

    this.generalInfo = [
      { label: 'Nama Periode', value: (item && item.name) || '-' },
      { label: 'Tanggal Mulai Periode', value: this.formatDisplayDate(startDate) },
      { label: 'Tanggal Akhir Periode', value: this.formatDisplayDate(endDate) },
      { label: 'Terhitung Mulai Tanggal (TMT)', value: '01/01/2022' },
      { label: 'Bobot Penilai Pertama', value: '50%' },
      { label: 'Bobot Penilai Kedua', value: '50%' },
      { label: 'Status Aktif', value: 'Tidak Aktif' },
    ];
  }

  private extractPeriodDate(item: any, ...keys: string[]): string {
    if (!item) {
      return '';
    }

    for (const key of keys) {
      if (item[key]) {
        return String(item[key]);
      }
    }

    return '';
  }

  private formatDisplayDate(value: string): string {
    const raw = (value || '').trim();
    if (!raw) {
      return '-';
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
    if (isoMatch) {
      return `${isoMatch[2]}/${isoMatch[3]}/${isoMatch[1]}`;
    }

    return raw;
  }

  get totalInovasiScore() {
    return this.inovasiRows.reduce((acc, r) => acc + r.score, 0);
  }

  get totalKontribusiScore() {
    return this.kontribusiRows.reduce((acc, r) => acc + r.score, 0);
  }

  get totalPenghargaanScore() {
    return this.penghargaanRows.reduce((acc, r) => acc + r.score, 0);
  }
  
  toggleAccordion(list: AccordionItem[], item: AccordionItem) {
    item.open = !item.open;
  }
}
