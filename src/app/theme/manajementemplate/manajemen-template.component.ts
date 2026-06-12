import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TupTpaService } from 'src/app/_services/tup-tpa.service';
import { OauthService } from 'src/app/_services/oauth.service';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

export interface TemplateRow {
  id?: string;
  nama: string;
  periode?: string;
  aktif: boolean;
  jumlahKomponen: number;
  createdAt: string;
  dibuatOleh: string;
}

@Component({
  selector: 'app-manajemen-template',
  templateUrl: './manajemen-template.component.html',
  styleUrls: ['./manajemen-template.component.scss'],
})
export class ManajemenTemplateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public defaultConfig: any;

  /* ===== DataTables  ===== */
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  private dtApi: DataTables.Api = null;

  /* ===== Shared modal ===== */
  @ViewChild('modalDefault', { static: false }) modalDefault: any;
  loadingTable = false;
  loadingModal = false;

  /* ===== Table Data ===== */
  rows: TemplateRow[] = [];
  searchTerm = '';

  /* ===== Form ===== */
  form: FormGroup;

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private fb: FormBuilder,
    private router: Router,
    private tupTpaService: TupTpaService,
    private oauthService: OauthService
  ) {
    this.translateService.setDefaultLang(localStorage.getItem('lang') || 'id');
    this.broadcasterService.changeLangBroadcast$.subscribe((res: any) => {
      this.translateService.setDefaultLang(res.lang);
    });

    this.defaultConfig = DefaultConfig;

    this.form = this.fb.group({
      namaPeriode: ['', Validators.required],
      tglMulai: ['', [Validators.required, this.dateDmyValidator()]],
      tglAkhir: ['', [Validators.required, this.dateDmyValidator()]],
      tmt: ['', [Validators.required, this.dateDmyValidator()]],
      statusAktif: [null, Validators.required],
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

    this.loadTemplateList();
  }

  private loadTemplateList(): void {
    this.loadingTable = true;

    this.tupTpaService.getTpaPeriod().subscribe(
      (res: any) => {
        if (res && res.success && Array.isArray(res.data)) {
          this.rows = res.data.map((item: any) => this.mapPeriodToRow(item));
        } else {
          this.rows = [];
        }
        this.loadingTable = false;
        this.rerender();
      },
      () => {
        this.rows = [];
        this.loadingTable = false;
        this.rerender();
        this.broadcasterService.notifBroadcast(true, {
          title: 'Gagal',
          msg: 'Gagal memuat data template.',
          timeout: 5000,
          theme: 'bootstrap',
          position: 'top-right',
          type: 'error',
        });
      }
    );
  }

  private mapPeriodToRow(item: any): TemplateRow {
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

    return {
      id: item && item.id != null ? String(item.id) : '',
      nama: (item && item.name) || '-',
      periode:
        startDate && endDate
          ? `${this.formatDisplayDate(startDate)} - ${this.formatDisplayDate(endDate)}`
          : '-',
      aktif: (item && item.active_status) === 1,
      jumlahKomponen: 16,
      createdAt:
        item && item.created_at != null ? String(item.created_at) : '-',
      dibuatOleh:
        item && (item.updated_by || item.created_by) != null ? String(item.updated_by || item.created_by) : '-',
    };
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

  ngAfterViewInit(): void {
    // Trigger setelah view siap
    setTimeout(() => {
      this.dtTrigger.next();
      this.bindDtInstance();
    }, 0);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtApi = null;
  }

  /* ===== Ambil & simpan instance DataTables aktif ===== */
  private bindDtInstance(): void {
    if (!this.dtElements || this.dtElements.length === 0) return;

    const first = this.dtElements.first;
    if (!first) return;

    first.dtInstance.then((dt: DataTables.Api) => {
      this.dtApi = dt;
    });
  }

  /* ===== rerender (dipakai setelah rows berubah) ===== */
  private rerender(): void {
    if (!this.dtElements || this.dtElements.length === 0) return;

    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();

        // init ulang table
        this.dtTrigger.next();

        // bind ulang instance baru supaya search tetap hidup
        setTimeout(() => {
          this.bindDtInstance();
        }, 0);
      });
    });
  }

  /* ===== Modal ===== */
  openModal(): void {
    this.form.reset({ statusAktif: null });
    if (this.modalDefault && this.modalDefault.show) {
      this.modalDefault.show();
    }
  }

  closeModal(): void {
    if (this.modalDefault && this.modalDefault.hide) {
      this.modalDefault.hide();
    }
  }

  t(name: string) {
    return this.form.get(name);
  }

  private convertToApiDateTime(dmy: string, isEnd: boolean = false): string {
    if (!dmy) return '';
    const parts = dmy.split('/');
    if (parts.length !== 3) return '';
    const dd = parts[0];
    const mm = parts[1];
    const yyyy = parts[2];
    const timeStr = isEnd ? '23:59:59.000' : '00:00:00.000';
    return `${yyyy}-${mm}-${dd} ${timeStr}`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingModal = true;
    const f = this.form.value;
    const profile = this.oauthService.retrieveProfile();
    const createdBy = profile ? (profile.username || profile.fullname || profile.numberid || 'guest') : 'guest';

    const body = {
      name: f.namaPeriode,
      start_date: this.convertToApiDateTime(f.tglMulai, false),
      end_date: this.convertToApiDateTime(f.tglAkhir, true),
      created_by: createdBy,
      active_status: f.statusAktif ? 1 : 0
    };

    this.tupTpaService.addTpaPeriod(body).subscribe(
      (res: any) => {
        this.loadingModal = false;
        this.broadcasterService.notifBroadcast(true, {
          title: 'Sukses',
          msg: 'Template periode penilaian berhasil ditambahkan.',
          timeout: 5000,
          theme: 'bootstrap',
          position: 'top-right',
          type: 'success',
        });
        this.closeModal();
        this.loadTemplateList();
      },
      (err: any) => {
        this.loadingModal = false;
        console.error('Error adding template period:', err);
        this.broadcasterService.notifBroadcast(true, {
          title: 'Gagal',
          msg: 'Gagal menambahkan template periode penilaian.',
          timeout: 5000,
          theme: 'bootstrap',
          position: 'top-right',
          type: 'error',
        });
      }
    );
  }

  /* ===== Navigation atau tombol aksi ===== */
  onDetail(row: TemplateRow): void {
    this.router.navigate(['/detail-penilaian-pegawai', row.id]);
  }

  onEdit(row: TemplateRow): void {
    this.router.navigate(['/edit-penilaian-pegawai', row.id]);
  }

  /* ===== Date helpers ===== */
  private dateDmyValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value || '').toString().trim();
      if (!v) return null;

      const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
      if (!m) return { dmy: true };

      const dd = +m[1];
      const mm = +m[2];
      const yyyy = +m[3];

      const d = new Date(yyyy, mm - 1, dd);
      return d.getFullYear() === yyyy &&
        d.getMonth() === mm - 1 &&
        d.getDate() === dd
        ? null
        : { dmy: true };
    };
  }

  onNativeDateChange(
    controlName: 'tglMulai' | 'tglAkhir' | 'tmt',
    event: Event
  ): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    const parts = input.value.split('-');
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];

    const ctrl = this.form.get(controlName);
    if (ctrl) {
      ctrl.setValue(d + '/' + m + '/' + y);
      ctrl.markAsTouched();
    }
  }

  openNativePicker(el: HTMLInputElement): void {
    const anyEl: any = el;
    if (anyEl && anyEl.showPicker) anyEl.showPicker();
    else {
      el.focus();
      el.click();
    }
  }

  onSearchChange(): void {
    this.onDtSearch(this.searchTerm);
  }

  /* ===== SEARCH ===== */
  onDtSearch(term: string): void {
    const q = (term || '').trim();

    // kalau instance belum kebentuk, bind dulu
    if (!this.dtApi) {
      this.bindDtInstance();
      return;
    }

    this.dtApi.search(q).draw();
  }
}
