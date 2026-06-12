import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DefaultConfig } from 'src/app/app-config';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface AgendaRow {
  id: string;
  namaKonten: string;
  tanggalDibuat: string;
  dibuatOleh: string;
  status: boolean;
}

type StepDateField = 'start' | 'end';

interface AgendaStepUi {
  key: string;
  label: string;
  startIso?: string;
  endIso?: string;
  startDisplay?: string;
  endDisplay?: string;
}

@Component({
  selector: 'app-agenda-penilaian',
  templateUrl: './agenda-penilaian.component.html',
  styleUrls: ['./agenda-penilaian.component.scss'],
})
export class AgendaPenilaianComponent implements OnInit, OnDestroy {
  public defaultConfig: any;

  /* ===================== DATATABLES ===================== */
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<void> = new Subject<void>();
  private dtInitialized: boolean = false;

  loadingTableBasic: boolean = false;

  /* ===================== FILTER + SEARCH ===================== */
  selectedPeriode: any = null;
  selectedPeriodeValue: string = 'all';

  periodeOptions: any[] = [
    { value: 'all', label: 'Semua Periode' },
    { value: 'p1', label: 'TelU Point TPA Genap 2022–2023 | 31-05-2023 s.d. 30-09-2024' },
    { value: 'p2', label: 'TelU Point TPA Genap 2024–2025 | 01-01-2024 s.d. 31-12-2025' },
  ];

  // input model
  searchTerm: string = '';
  // keyword yang dipakai utk filter (baru berubah saat Enter / klik tombol)
  private appliedSearchTerm: string = '';

  /* ===================== DATA ===================== */
  rowsAll: AgendaRow[] = [];
  rows: AgendaRow[] = [];

  /* ===================== MODAL TAMBAH AGENDA ===================== */
  @ViewChild('modalLarge', { static: true }) public modalLarge: any;
  loadingModal: boolean = false;
  formAgenda: FormGroup;

  agendaSteps: AgendaStepUi[] = [
    { key: 'preprocessing', label: 'Preprocessing' },
    { key: 'verif-data', label: 'Verifikasi Data Atasan dan Pegawai' },
    { key: 'penilaian-umpan-balik', label: 'Penilaian dan Masukkan Umpan Balik' },
    { key: 'umpan-balik-pegawai', label: 'Masukkan Umpan Balik Pegawai' },
    { key: 'persetujuan-atasan', label: 'Persetujuan Atasan' },
    { key: 'selesai', label: 'Selesai' },
  ];

  get fa() { return this.formAgenda.controls; }

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private router: Router,
    private fb: FormBuilder
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang') || 'id');
    broadcasterService.changeLangBroadcast$.subscribe((res: any) => {
      translateService.setDefaultLang(res.lang);
    });

    this.defaultConfig = DefaultConfig;

    this.formAgenda = this.fb.group({
      periode: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
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
        search: 'Cari:',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;',
        },
      },
    };

    this.loadDummyData();

    // default periode
    this.selectedPeriodeValue = 'all';
    this.selectedPeriode = this.periodeOptions[0];

    // tampil awal
    this.rows = this.rowsAll.slice();

    // init DT sekali
    this.initDatatableOnce();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  /* ===================== FILTER PERIODE ===================== */
  private getPeriodeValue(raw: any): string {
    if (!raw) return 'all';
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'object' && raw.value != null) return String(raw.value);
    return 'all';
  }

  onPeriodeChange(val: any): void {
    this.selectedPeriodeValue = this.getPeriodeValue(val);
  }

  // dipanggil dari tombol "Terapkan"
  applyPeriodeFilter(): void {
    this.getData();
  }

  /* ===================== SEARCH ===================== */
  // dipanggil saat Enter / klik tombol search
  onSearch(): void {
    this.appliedSearchTerm = (this.searchTerm || '').trim();
    this.getData();
  }

  // hanya untuk behavior: kalau input kosong, data balik otomatis
  onSearchTermChange(): void {
    const v = (this.searchTerm || '').trim();
    if (v === '') {
      this.appliedSearchTerm = '';
      this.getData();
    }
  }

  getData(): void {
    this.loadingTableBasic = true;

    const newData = this.applyFilterToMaster();
    this.rows = newData.slice();

    this.rerenderDatatable();

    this.loadingTableBasic = false;
  }

  /* ===================== NORMALIZE SEARCH ===================== */
  private normalizeText(v: string): string {
    // samakan dash unicode '-'
    // buang spasi berlebih, lowercase
    // contoh: "2022 – 2023" => "2022-2023"
    return (v || '')
      .toLowerCase()
      .replace(/[–—−]/g, '-')        // en dash, em dash, minus
      .replace(/\s+/g, ' ')          // collapse spaces
      .replace(/\s*-\s*/g, '-')      // "2022 - 2023" -> "2022-2023"
      .trim();
  }

  private applyFilterToMaster(): AgendaRow[] {
    const kw = this.normalizeText(this.appliedSearchTerm);
    const p = this.selectedPeriodeValue;

    // 1) filter periode
    let filtered = this.rowsAll.filter((r) => {
      if (!p || p === 'all') return true;

      const namaNorm = this.normalizeText(r.namaKonten || '');

      // contoh implementasi sementara (sesuaikan ke rule real kalau sudah ada)
      if (p === 'p1') return namaNorm.includes('2022-2023');
      if (p === 'p2') return namaNorm.includes('2024-2025');

      return true;
    });

    // 2) filter search keyword (baru aktif setelah Enter / klik)
    if (kw) {
      filtered = filtered.filter((r) => {
        const statusText = r.status ? 'aktif' : 'tidak aktif';

        const nama = this.normalizeText(r.namaKonten || '');
        const tgl = this.normalizeText(r.tanggalDibuat || '');
        const oleh = this.normalizeText(r.dibuatOleh || '');
        const st = this.normalizeText(statusText);

        return (
          nama.includes(kw) ||
          tgl.includes(kw) ||
          oleh.includes(kw) ||
          st.includes(kw)
        );
      });
    }

    return filtered;
  }

  /* ===================== DATATABLES HELPERS ===================== */
  private initDatatableOnce(): void {
    if (this.dtInitialized) return;
    this.dtInitialized = true;

    setTimeout(() => {
      this.dtTrigger.next();
    }, 0);
  }

  private rerenderDatatable(): void {
    if (!this.dtInitialized) {
      this.initDatatableOnce();
      return;
    }

    if (!this.dtElement) {
      setTimeout(() => this.dtTrigger.next(), 0);
      return;
    }

    this.dtElement.dtInstance.then((dtInstance: any) => {
      try {
        dtInstance.destroy();
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        this.dtTrigger.next();
      }, 0);
    });
  }

  /* ===================== TABLE ACTIONS ===================== */
  onActionClick(action: string, row: AgendaRow): void {
    let msg = 'Aksi dijalankan.';
    if (action === 'edit') msg = 'Klik tombol Edit (dummy).';
    if (action === 'view') msg = 'Klik tombol Detail (dummy).';

    this.broadcasterService.notifBroadcast(true, {
      title: 'Info',
      msg,
      timeout: 3500,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'info',
    });
  }

  /* ===================== MODAL HANDLERS ===================== */
  openAgendaModal(): void {
    this.formAgenda.reset();
    this.resetAgendaStepsDates();
    if (this.modalLarge) this.modalLarge.show();
  }

  closeAgendaModal(): void {
    if (this.modalLarge) this.modalLarge.hide();
  }

  submitAgenda(): void {
    if (this.formAgenda.invalid) {
      this.broadcasterService.notifBroadcast(true, {
        title: 'Gagal',
        msg: 'Periode wajib dipilih.',
        timeout: 4000,
        theme: 'bootstrap',
        position: 'top-right',
        type: 'error',
      });
      return;
    }

    const payload = {
      periode: this.formAgenda.value.periode,
      steps: this.agendaSteps.map((s) => ({
        key: s.key,
        startDate: s.startIso || null,
        endDate: s.endIso || null,
      })),
    };

    console.log('payload submit agenda:', payload);

    this.broadcasterService.notifBroadcast(true, {
      title: 'Sukses',
      msg: 'Agenda berhasil disimpan (dummy).',
      timeout: 4000,
      theme: 'bootstrap',
      position: 'top-right',
      type: 'success',
    });

    this.closeAgendaModal();
  }

  openNativePicker(el: HTMLInputElement): void {
    const anyEl: any = el as any;
    if (anyEl && typeof anyEl.showPicker === 'function') {
      anyEl.showPicker();
      return;
    }
    el.focus();
    el.click();
  }

  onStepDateChange(index: number, field: StepDateField, ev: Event): void {
    const input = ev.target as HTMLInputElement;
    let iso = input && input.value ? input.value : '';
    iso = (iso || '').trim();
    if (!iso) return;

    const display = this.isoToDDMMYYYY(iso);

    if (field === 'start') {
      this.agendaSteps[index].startIso = iso;
      this.agendaSteps[index].startDisplay = display;
    } else {
      this.agendaSteps[index].endIso = iso;
      this.agendaSteps[index].endDisplay = display;
    }
  }

  private isoToDDMMYYYY(iso: string): string {
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  private resetAgendaStepsDates(): void {
    this.agendaSteps = this.agendaSteps.map((s) => ({
      key: s.key,
      label: s.label,
      startIso: undefined,
      endIso: undefined,
      startDisplay: undefined,
      endDisplay: undefined,
    }));
  }

  /* ===================== DUMMY DATA ===================== */
  private loadDummyData(): void {
    this.rowsAll = [
      {
        id: '1',
        namaKonten: 'TelU Point TPA Genap 2024 – 2025',
        tanggalDibuat: '2023-12-04 09:33:15',
        dibuatOleh: 'UTAMI KUSUMA DEWI',
        status: true,
      },
      {
        id: '2',
        namaKonten: 'TelU Point TPA Genap 2022 – 2023',
        tanggalDibuat: '2023-12-04 09:33:15',
        dibuatOleh: 'MAULANA REZI RAMADHANA',
        status: false,
      },
      {
        id: '3',
        namaKonten: 'TelU Point TPA Genap 2022 – 2023',
        tanggalDibuat: '2023-12-04 09:33:15',
        dibuatOleh: 'MAULANA REZI RAMADHANA',
        status: false,
      },
    ];
  }
}
