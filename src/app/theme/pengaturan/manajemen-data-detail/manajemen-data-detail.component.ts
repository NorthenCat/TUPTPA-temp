import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-manajemen-data-detail',
  templateUrl: './manajemen-data-detail.component.html',
  styleUrls: ['./manajemen-data-detail.component.scss']
})
export class ManajemenDataDetailComponent implements OnInit, OnDestroy {
  @ViewChildren(DataTableDirective) public dtElements: QueryList<DataTableDirective>;

  public loadingTable = false;
  public loadingTableBasic = false;

  public detailData: any = { namaData: '-', namaViewQuery: '-' };

  public selectedIdStruktur: any = '';
  public selectedNamaOrganisasi: any = '';
  public selectedNamaUnit: any = '';

  public opsiIdStruktur: any[] = [];
  public opsiNamaOrganisasi: any[] = [];
  public opsiNamaUnit: any[] = [];

  public keyword = '';

  public dataTable: any[] = [];
  public allData: any[] = [];

  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      searching: false,
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      language: {
        info: 'Menampilkan _START_ - _END_ dari _TOTAL_ data',
        infoEmpty: 'Menampilkan 0 - 0 dari 0 data',
        zeroRecords: 'Data tidak ditemukan!',
        emptyTable: 'Data tidak ditemukan!',
        lengthMenu: '',
        search: 'Cari:',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;',
        }
      }
    };

    const nav = this.router.getCurrentNavigation();
    const stateData = nav && nav.extras && nav.extras.state ? (nav.extras.state as any).data : null;
    const qp = this.route.snapshot.queryParams;

    if (stateData) {
      this.detailData = stateData;
    } else if (qp && (qp.namaData || qp.namaViewQuery)) {
      this.detailData = {
        namaData: qp.namaData || '-',
        namaViewQuery: qp.namaViewQuery || '-'
      };
    }

    this.getData();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // helper supaya aman kalau ng-select balikin object atau value
  private getVal(sel: any): string {
    if (!sel) return '';
    if (typeof sel === 'object' && sel.value !== undefined) return String(sel.value);
    return String(sel);
  }

  // destroy datatable instance lalu render ulang 
  private rerender(): void {
    if (!this.dtElements || this.dtElements.length === 0) {
      this.dtTrigger.next();
      return;
    }

    this.dtElements.forEach((dtElement: DataTableDirective) => {
      if (dtElement.dtInstance) {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dtTrigger.next();
      }
    });
  }

  public applyFilter(): void {
    this.filterData();
    this.rerender();
  }

  public getData(): void {
    this.loadingTable = true;

    // dummy (nanti ganti API)
    const dummy = [
      { id_structure_organisasi: 158, nama_organisasi: 'STAFF STISI TELKOM', nama_unit: 'STISI TELKOM', status_posisi: 0 },
      { id_structure_organisasi: 226, nama_organisasi: 'STAFF URUSAN LOGISTIK (2019)', nama_unit: 'URUSAN LOGISTIK (2019)', status_posisi: 0 },
      { id_structure_organisasi: 347, nama_organisasi: 'STAFF FAKULTAS TEKNIK', nama_unit: 'FAKULTAS TEKNIK', status_posisi: 0 },
      { id_structure_organisasi: 636, nama_organisasi: 'STAFF URUSAN LOGISTIK & RUMAH TANGGA', nama_unit: 'URUSAN TEKNIK & RUMAH TANGGA', status_posisi: 0 }
    ];

    this.allData = dummy;

    this.buildFilterOptions();

    // pertama kali tampilkan semua / sesuai filter yang ada
    this.filterData();

    // render pertama
    this.dtTrigger.next();

    this.loadingTable = false;
  }

  private filterData(): void {
    const id = this.getVal(this.selectedIdStruktur);
    const org = this.getVal(this.selectedNamaOrganisasi).toLowerCase();
    const unit = this.getVal(this.selectedNamaUnit).toLowerCase();

    const key = (this.keyword || '').toLowerCase().trim();

    this.dataTable = this.allData.filter(x => {
      const matchId = !id || String(x.id_structure_organisasi) === id;
      const matchOrg = !org || String(x.nama_organisasi).toLowerCase() === org;
      const matchUnit = !unit || String(x.nama_unit).toLowerCase() === unit;

      const matchKeyword = !key || (
        String(x.id_structure_organisasi).toLowerCase().includes(key) ||
        String(x.nama_organisasi).toLowerCase().includes(key) ||
        String(x.nama_unit).toLowerCase().includes(key) ||
        String(x.status_posisi).toLowerCase().includes(key)
      );

      return matchId && matchOrg && matchUnit && matchKeyword;
    });
  }

  public onSearch(): void {
    // jalankan filter berdasarkan keyword + dropdown
    this.filterData();
    this.rerender();
  }


  public onSearchChange(val: any): void {
    const v = (val || '').toString().trim();

    if (!v) {
      this.keyword = '';
      this.filterData();
      this.rerender();
    }
  }


  private buildFilterOptions(): void {
    const uniqueByValue = (items: any[]) => {
      const map = new Map<string, any>();
      items.forEach(it => map.set(String(it.value), it));
      return Array.from(map.values());
    };

    this.opsiIdStruktur = uniqueByValue(
      this.allData.map(x => ({ value: String(x.id_structure_organisasi), label: String(x.id_structure_organisasi) }))
    );

    this.opsiNamaOrganisasi = uniqueByValue(
      this.allData.map(x => ({ value: String(x.nama_organisasi), label: String(x.nama_organisasi) }))
    );

    this.opsiNamaUnit = uniqueByValue(
      this.allData.map(x => ({ value: String(x.nama_unit), label: String(x.nama_unit) }))
    );

    this.opsiIdStruktur = [{ value: '', label: 'Semua ID' }, ...this.opsiIdStruktur];
    this.opsiNamaOrganisasi = [{ value: '', label: 'Semua Organisasi' }, ...this.opsiNamaOrganisasi];
    this.opsiNamaUnit = [{ value: '', label: 'Semua Unit' }, ...this.opsiNamaUnit];
  }
}
