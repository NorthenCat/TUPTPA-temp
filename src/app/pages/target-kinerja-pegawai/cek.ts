import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-target-kinerja-pegawai',
  templateUrl: './target-kinerja-pegawai.component.html',
  styleUrls: ['./target-kinerja-pegawai.component.scss']
})
export class TargetKinerjaPegawaiComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;

  // MAIN
  public dtOptions: DataTables.Settings[] = [];
  public dtTrigger: Subject<any> = new Subject<any>();

  // STATUS
  public dtOptionsStatus: DataTables.Settings = {};
  public dtTriggerStatus: Subject<any> = new Subject<any>();

  public loadingPage = false;

  public activeTab: 'target' | 'sikap' | 'inovasi' = 'target';
  public keyword = '';

  public pegawai = {
    nama: 'ANNISA HUMAIRO S.Kom',
    nip: '23990062',
    lokasi: 'URUSAN PENGEMBANGAN PRODUK TI NON-AKADEMIK',
    periode: 'TelU Point TPA Genap 2024-2025',
    deskripsi: 'STAFF'
  };

  public objektifText = '';
  public isObjektifEdit = false;

  public statusPenilai: any[] = [
    { nama: 'Desirae Kenter', targetApproved: true, realisasiApproved: true },
    { nama: 'Maren Carder', targetApproved: false, realisasiApproved: false },
    { nama: 'Miracle Geidt', targetApproved: false, realisasiApproved: true }
  ];

  public rawData: any[] = [];
  public dataTable: any[] = [];
  public averageScore = 100;

  // ===================== DELETE MODAL (SOLUSI 2 / PURE) =====================
  public showDeleteModal = false;
  public loadingDelete = false;
  public deletingRow: any = null;
  public showDeleteConfirm = false;
  public showDeleteSuccess = false;
  // ==========================================================================

  //==================== ROLE =====================
  

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService
  ) {
    this.translateService.setDefaultLang(localStorage.getItem('lang') || 'id');
    this.broadcasterService.changeLangBroadcast$.subscribe(res => {
      this.translateService.setDefaultLang(res.lang);
    });
  }

  ngOnInit(): void {
    this.initDataTableMain();
    this.initStatusTable();
    this.loadData();

    setTimeout(() => {
      this.dtTriggerStatus.next();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.dtTrigger) this.dtTrigger.unsubscribe();
    if (this.dtTriggerStatus) this.dtTriggerStatus.unsubscribe();
  }

  // ===================== DATATABLE CONFIG =====================
  private initDataTableMain(): void {
    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 10,
      destroy: true,
      searching: false,
      lengthChange: false,
      ordering: false,
      info: true,
      language: {
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
        zeroRecords: 'Data tidak ditemukan!',
        emptyTable: 'Data tidak ditemukan!',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;'
        }
      }
    };
  }

  private initStatusTable(): void {
    this.dtOptionsStatus = {
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 10,
      destroy: true,
      searching: false,
      lengthChange: false,
      ordering: false,
      info: true,
      language: {
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
        zeroRecords: '',
        emptyTable: '',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;'
        }
      }
    };
  }

  // ===================== LOAD DATA =====================
  private loadData(): void {
    this.loadingPage = true;

    var dummy = [
      {
        id: '1',
        deskripsi:
          'Melakukan Perancangan antarmuka aplikasi baik baru atau perubahan pada aplikasi sesuai permintaan pengembangan aplikasi.',
        satuan: '%',
        ukuran: '>=',
        referensi: 'Sarmut',
        expanded: false,
        tw1: { target: 100, realisasi: 100, score: 100 },
        tw2: { target: 100, realisasi: 100, score: 100 },
        tw3: { target: 100, realisasi: 100, score: 100 },
        tw4: { target: 100, realisasi: 100, score: 100 }
      },
      {
        id: '2',
        deskripsi: 'Melakukan Development Antarmuka Aplikasi berdasarkan Permintaan Pengembangan Aplikasi.',
        satuan: '%',
        ukuran: '>=',
        referensi: 'SLA',
        expanded: false,
        tw1: { target: 0, realisasi: 0, score: 0 },
        tw2: { target: 0, realisasi: 0, score: 0 },
        tw3: { target: 0, realisasi: 0, score: 0 },
        tw4: { target: 0, realisasi: 0, score: 0 }
      }
    ];

    setTimeout(() => {
      this.rawData = dummy;
      this.dataTable = dummy.slice();

      setTimeout(() => {
        this.dtTrigger.next();
        this.loadingPage = false;
      }, 0);
    }, 100);
  }

  // ===================== EXPAND (child row DataTables) =====================
  public toggleExpand(row: any): void {
    row.expanded = !row.expanded;
    if (!this.dtElements || !this.dtElements.length) return;

    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dt: any) => {
        var node = (dt && dt.table && dt.table().node) ? dt.table().node() : null;
        var id = (node && node.id) ? node.id : '';
        if (id !== 'dtMainTable') return;

        var selector = '[data-rowid="' + row.id + '"]';
        var dtRow = dt.row(selector);
        if (!dtRow) return;

        if (row.expanded) {
          dtRow.child(this.buildDetailHtml(row), 'tpa-child-row').show();
        } else {
          dtRow.child.hide();
        }
      });
    });
  }

  private buildDetailHtml(row: any): string {
    return `
      <div class="tpa-child-wrap">
        <div class="tpa-tw-grid2">
          <div class="tpa-tw-grid2__head"></div>
          <div class="tpa-tw-grid2__head text-center">TW1</div>
          <div class="tpa-tw-grid2__head text-center">TW2</div>
          <div class="tpa-tw-grid2__head text-center">TW3</div>
          <div class="tpa-tw-grid2__head text-center">TW4</div>

          <div class="tpa-tw-grid2__label">Target</div>
          <div class="text-center">${row.tw1.target}</div>
          <div class="text-center">${row.tw2.target}</div>
          <div class="text-center">${row.tw3.target}</div>
          <div class="text-center">${row.tw4.target}</div>

          <div class="tpa-tw-grid2__label">Realisasi</div>
          <div class="text-center">${row.tw1.realisasi}</div>
          <div class="text-center">${row.tw2.realisasi}</div>
          <div class="text-center">${row.tw3.realisasi}</div>
          <div class="text-center">${row.tw4.realisasi}</div>

          <div class="tpa-tw-grid2__label">Evidence Realisasi</div>
          <div class="text-center"><button type="button" class="btn btn-outline-primary btn-sm tpa-evidence-btn"><i class="ph-duotone ph-upload-simple"></i></button></div>
          <div class="text-center"><button type="button" class="btn btn-outline-primary btn-sm tpa-evidence-btn"><i class="ph-duotone ph-upload-simple"></i></button></div>
          <div class="text-center"><button type="button" class="btn btn-outline-primary btn-sm tpa-evidence-btn"><i class="ph-duotone ph-upload-simple"></i></button></div>
          <div class="text-center"><button type="button" class="btn btn-outline-primary btn-sm tpa-evidence-btn"><i class="ph-duotone ph-upload-simple"></i></button></div>

          <div class="tpa-tw-grid2__label">Score</div>
          <div class="text-center">${row.tw1.score}</div>
          <div class="text-center">${row.tw2.score}</div>
          <div class="text-center">${row.tw3.score}</div>
          <div class="text-center">${row.tw4.score}</div>
        </div>
      </div>
    `;
  }

  // ===================== SEARCH (MAIN) =====================
  public onSearch(): void {
    var k = (this.keyword || '').trim().toLowerCase();

    var rows = (this.rawData || []).filter(x => {
      var d = (x.deskripsi || '').toLowerCase();
      var r = (x.referensi || '').toLowerCase();
      return !k || d.indexOf(k) !== -1 || r.indexOf(k) !== -1;
    });

    this.rerenderMain(rows);
  }

  public onKeywordChange(): void {
    if ((this.keyword || '').trim() === '') {
      this.onSearch();
    }
  }

  private rerenderMain(rows: any[]): void {
    this.dataTable = rows || [];

    if (!this.dtElements || !this.dtElements.length) {
      setTimeout(() => this.dtTrigger.next(), 0);
      return;
    }

    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dt: any) => {
        var node = (dt && dt.table && dt.table().node) ? dt.table().node() : null;
        var id = (node && node.id) ? node.id : '';
        if (id !== 'dtMainTable') return;

        dt.destroy();
        setTimeout(() => this.dtTrigger.next(), 0);
      });
    });
  }

  // ===================== OBJEKTIF =====================
  public onEditObjektif(): void {
    this.isObjektifEdit = true;
  }

  public onCancelObjektif(): void {
    this.isObjektifEdit = false;
  }

  public onSaveObjektif(): void {
    if (!this.objektifText || this.objektifText.trim().length < 5) {
      this.toast('Gagal', 'Objektif minimal 5 karakter.', 'error');
      return;
    }
    this.isObjektifEdit = false;
    this.toast('Sukses', 'Objektif tersimpan.', 'success');
  }

  // ===================== ACTIONS DUMMY =====================
  public downloadSKI(): void { this.toast('Info', 'Download SKI (dummy)', 'info'); }
  public openTambahTkp(): void { this.toast('Info', 'Open modal tambah TKP (dummy)', 'info'); }
  public simpanDraftDTKP(): void { this.toast('Info', 'Simpan Draft DTKP (dummy)', 'info'); }
  public ajukanDTKP(): void { this.toast('Info', 'Ajukan DTKP (dummy)', 'info'); }

  public onEditRow(row: any): void {
    var id = (row && row.id) ? row.id : '-';
    this.toast('Info', 'Edit row: ' + id, 'info');
  }

  // ===================== DELETE (PURE MODAL) =====================
  public onDeleteRow(row: any): void {
    this.openDeleteConfirm(row);
  }

  public openDeleteConfirm(row: any): void {
    this.deletingRow = row || null;
    this.loadingDelete = false;
    this.showDeleteModal = true; 
    this.showDeleteSuccess = false;
  }

  public closeDeleteConfirm(): void {
    if (this.loadingDelete) return;
    this.showDeleteModal = false;
    this.deletingRow = null;
  }

  public confirmDelete(): void {
    if (!this.deletingRow) return;

    this.loadingDelete = true;

    // Simulasi call API delete
    setTimeout(() => {
      const id = this.deletingRow && this.deletingRow.id ? this.deletingRow.id : null;

      // HAPUS DATA DI SINI (setelah API sukses)
      if (id) {
        this.rawData = (this.rawData || []).filter(x => x && x.id !== id);
      }

      // refresh table (ikut keyword sekarang)
      this.onSearch();

      // tutup confirm, buka success
      this.loadingDelete = false;
      this.showDeleteConfirm = false;
      this.showDeleteSuccess = true;
    }, 400);
  }

  /** tutup modal sukses */
public closeDeleteSuccess(): void {
  this.showDeleteSuccess = false;
  this.deletingRow = null;

  // optional toast (kalau mau)
  this.toast('Sukses', 'Data berhasil dihapus.', 'success');
}

/** klik backdrop: biasanya ignore (karena modalnya static) */
public onBackdropClick(): void {}
  // ===================== TOAST =====================
  private toast(title: string, msg: string, type: 'success' | 'error' | 'info'): void {
    this.broadcasterService.notifBroadcast(true, {
      title: title,
      msg: msg,
      timeout: 4000,
      theme: 'bootstrap',
      position: 'top-right',
      type: type
    });
  }
}
