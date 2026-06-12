import { Component, OnInit } from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  selector: 'app-edit-penilaian-pegawai',
  templateUrl: './edit-penilaian-pegawai.component.html',
  styleUrls: ['./edit-penilaian-pegawai.component.scss']
})
export class EditPenilaianPegawaiComponent implements OnInit {
  public defaultConfig: any;

  pageTitle = 'Edit Manajemen Template';
  pageSubtitle = 'Daftar Detail Konten Periode Penilaian';

  selectedKomponen: string = 'Komponen 1';
  komponenOptions = ['Komponen 1', 'Komponen 2', 'Komponen 3'];

  generalInfo: GeneralInfo[] = [
    { label: 'Nama Periode', value: 'TelU Point TPA Genap 2022-2023' },
    { label: 'Tanggal Mulai Periode', value: '05/31/2023' },
    { label: 'Tanggal Akhir Periode', value: '09/30/2023' },
    { label: 'Terhitung Mulai Tanggal (TMT)', value: '01/01/2022' },
    { label: 'Bobot Penilai Pertama', value: '50%' },
    { label: 'Bobot Penilai Kedua', value: '50%' },
    { label: 'Status Aktif', value: 'Tidak Aktif' },
  ];

  dtkpItems: AccordionItem[] = [
    { title: 'Daftar DTKP', open: true },
    { title: 'Referensi', open: false },
    { title: 'Satuan', open: false },
    { title: 'Ukuran', open: false },
    { title: 'Target', open: true },
  ];

  targetTw = ['Target TW 1', 'Target TW 2', 'Target TW 3', 'Target TW 4'];

  sikapKerja: AccordionItem[] = [
    { title: 'Sikap Kerja: Harmony', open: true },
    { title: 'Sikap Kerja: Excellence', open: false },
    { title: 'Sikap Kerja: Integrity', open: false },
  ];

  sikapDeskripsi = `Kecakapan pegawai untuk menyampaikan informasi secara jelas dan sistematis
(lisan maupun tertulis), memastikan pemahaman, mendengarkan secara aktif, terampil,
dan mengemukakan argumentasi yang logis, serta menggagas sistem komunikasi terbuka
secara strategis untuk mencari solusi.`;

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

  kontribusiRows: IpkRow[] = [...this.inovasiRows];
  penghargaanRows: IpkRow[] = [...this.inovasiRows];

  // =========================
  // MODAL: TAMBAH KOMPONEN
  // =========================
  modalTambahKomponenOpen = false;
  formTambahKomponen: FormGroup;

  parameterNkiOptions = [
    { value: 'NKI_1', label: 'Parameter 1' },
    { value: 'NKI_2', label: 'Parameter 2' },
  ];

  hakAksesOptions = [
    { value: 'ATASAN', label: 'Atasan' },
    { value: 'DIRI_SENDIRI', label: 'Diri Sendiri' },
    { value: 'REKAN', label: 'Rekan' },
  ];

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private fb: FormBuilder
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.defaultConfig = DefaultConfig;

    // init reactive form modal tambah komponen
    this.formTambahKomponen = this.fb.group({
      nomorUrut: ['', Validators.required],
      label: ['', Validators.required],
      bobot: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      parameterNki: ['', Validators.required],
      hakAksesPenilai: ['', Validators.required],
      statusAktif: ['', Validators.required], // boolean via [ngValue]
    });
  }

  ngOnInit(): void {}

  // helper control untuk template
  c(name: string) {
    return this.formTambahKomponen.get(name)!;
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

  // ====== handler tombol ======
  onEditInformasiUmum() {
    console.log('Edit Informasi Umum');
  }

  // buka modal tambah komponen
  onTambahKomponen() {
    this.modalTambahKomponenOpen = true;
  }

  closeTambahKomponen() {
    this.modalTambahKomponenOpen = false;
    this.formTambahKomponen.reset();
  }

  closeTambahKomponenOnBackdrop() {
    this.closeTambahKomponen();
  }

  submitTambahKomponen() {
    if (this.formTambahKomponen.invalid) {
      this.formTambahKomponen.markAllAsTouched();
      return;
    }

    const payload = this.formTambahKomponen.value;
    console.log('SUBMIT TAMBAH KOMPONEN', payload);

    // TODO: update state / call API untuk simpan komponen

    this.closeTambahKomponen();
  }

  onUbahKomponen(tipe: 'dtkp' | 'sikap') {
    console.log('Ubah Komponen', tipe);
  }

  onTambahButir(tipe: 'dtkp' | 'sikap') {
    console.log('Tambah Butir', tipe);
  }

  onUbahSubKomponen(tipe: 'dtkp' | 'sikap', item: AccordionItem) {
    console.log('Ubah Sub Komponen', tipe, item);
  }

  onTambahSubKomponen(tipe: 'dtkp' | 'sikap', item: AccordionItem) {
    console.log('Tambah Sub Komponen', tipe, item);
  }

  onUbahSection(item: AccordionItem) {
    console.log('Ubah section', item);
  }

  onTambahSection(item: AccordionItem) {
    console.log('Tambah butir untuk section', item);
  }
}
