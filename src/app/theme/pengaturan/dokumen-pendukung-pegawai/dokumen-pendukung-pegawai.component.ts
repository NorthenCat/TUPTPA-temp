import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DefaultConfig } from 'src/app/app-config';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dokumen-pendukung-pegawai',
  templateUrl: './dokumen-pendukung-pegawai.component.html',
  styleUrls: ['./dokumen-pendukung-pegawai.component.scss']
})
export class DokumenPendukungPegawaiComponent implements OnInit, AfterViewInit, OnDestroy {
  public defaultConfig: any;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();

  public loadingTable = false;
  public dataTable: any[] = [];

  public selectedPeriode: any = '';
  public selectedStruktur: any = 'all';
  public selectedStatusUnggah: any = 'all';
  public keyword: string = '';

  public periodeOptions: any[] = [];
  public strukturOptions: any[] = [];
  public statusUnggahOptions: any[] = [
    { value: 'all', label: 'Semua Status' },
    { value: 'BELUM', label: 'Belum Unggah' },
    { value: 'SUDAH', label: 'Sudah Unggah' },
  ];

  private masterData: any[] = [];

  constructor(
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.defaultConfig = DefaultConfig;
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
          last: '&raquo;'
        }
      }
    };

    this.loadMasterData();
    this.buildMockMasterData();
  }

  ngAfterViewInit(): void {
    this.dataTable = this.applyFilterToMaster();
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    if (this.dtTrigger) this.dtTrigger.unsubscribe();
  }

  onApplyFilter(): void {
    this.getData();
  }

  getData(): void {
    this.loadingTable = true;

    // update data (ganti reference)
    const newData = this.applyFilterToMaster();
    this.dataTable = newData.slice(0);

    // rerender datatable dengan timing aman
    this.rerender();

    this.loadingTable = false;
  }

  private rerender(): void {
    const self = this;

    // kalau belum kebentuk instance, trigger 
    if (!this.dtElement || !this.dtElement.dtInstance) {
      Promise.resolve().then(() => {
        setTimeout(() => self.dtTrigger.next(), 0);
      });
      return;
    }

    this.dtElement.dtInstance.then((dtInstance: any) => {
      try {

        dtInstance.clear();
        dtInstance.destroy(); 
      } catch (e) {
        // ignore
      }

      // double tick supaya Angular sempat render <tr> baru dulu
      Promise.resolve().then(() => {
        setTimeout(() => {
          self.dtTrigger.next();
        }, 0);
      });
    });
  }

  // ========= master options =========
  loadMasterData(): void {
    this.periodeOptions = [
      { value: '2024-2', label: 'Genap 2024 - 2025' },
      { value: '2024-1', label: 'Ganjil 2024 - 2025' }
    ];

    this.strukturOptions = [
      { value: 'all', label: 'Semua Unit' },
      { value: 'FIK', label: 'FIK' },
      { value: 'FTE', label: 'FTE' },
      { value: 'FISIP', label: 'FISIP' }
    ];
  }

  private buildMockMasterData(): void {
    var base = [
      {
        templateName: 'TelU Point TPA',
        periode: '2024-2',
        unit: 'URUSAN AKADEMIK (FIK)',
        deskripsiPekerjaan: 'STAFF URUSAN AKADEMIK (FIK)'
      },
      {
        templateName: 'TelU Point TPA',
        periode: '2024-2',
        unit: 'URUSAN LABORATORIUM / BENGKEL / STUDIO (FIK)',
        deskripsiPekerjaan: 'URUSAN LABORATORIUM / BENGKEL / STUDIO (FIK)'
      },
      {
        templateName: 'TelU Point TPA',
        periode: '2024-1',
        unit: 'URUSAN AKADEMIK (FTE)',
        deskripsiPekerjaan: 'STAFF URUSAN AKADEMIK (FTE)'
      }
    ];

    var names = [
      'IWAN HERMAWAN', 'ISNAN PURNAMA', 'RUSMAN YUSUP', 'ANDI PRATAMA', 'BUDI SANTOSO',
      'CITRA LESTARI', 'DINA AYU', 'EKO SAPUTRA', 'FARHAN HAKIM', 'GITA NURHALIZA',
      'HADI WIJAYA', 'INDRA GUNAWAN', 'JOKO SUSILO', 'KARTIKA PUTRI', 'LUKMAN HAKIM'
    ];

    this.masterData = [];
    for (var i = 0; i < names.length; i++) {
      var pick = base[i % base.length];
      this.masterData.push({
        id: i + 1,
        templateName: pick.templateName,
        periode: pick.periode,
        nip: '93' + (670000 + i),
        nama: names[i],
        unit: pick.unit,
        deskripsiPekerjaan: pick.deskripsiPekerjaan,
        statusUnggah: (i % 3 === 0) ? 'SUDAH' : 'BELUM'
      });
    }
  }

  private applyFilterToMaster(): any[] {
    var kw = (this.keyword || '').toLowerCase().trim();
    var periodeSel = this.selectedPeriode;
    var strukturSel = this.selectedStruktur;
    var statusSel = this.selectedStatusUnggah;

    var filtered = this.masterData.filter(x => {
      var matchPeriode = !periodeSel || String(x.periode) === String(periodeSel);
      var matchStatus = (statusSel === 'all') || String(x.statusUnggah) === String(statusSel);

      var matchStruktur =
        !strukturSel ||
        strukturSel === 'all' ||
        (x.unit || '').toUpperCase().indexOf(String(strukturSel).toUpperCase()) !== -1;

      var matchKeyword =
        !kw ||
        (x.nama || '').toLowerCase().indexOf(kw) !== -1 ||
        String(x.nip || '').toLowerCase().indexOf(kw) !== -1 ||
        (x.templateName || '').toLowerCase().indexOf(kw) !== -1 ||
        (x.unit || '').toLowerCase().indexOf(kw) !== -1 ||
        (x.deskripsiPekerjaan || '').toLowerCase().indexOf(kw) !== -1 ||
        (this.getPeriodeLabel(x.periode) || '').toLowerCase().indexOf(kw) !== -1;
      return matchPeriode && matchStatus && matchStruktur && matchKeyword;
    });

    return filtered.map(val => {
      var foundPeriode = this.periodeOptions.find(p => String(p.value) === String(val.periode));
      var periodeLabel = foundPeriode ? foundPeriode.label : val.periode;

      var statusUnggahLabel = (val.statusUnggah === 'BELUM') ? 'Belum Unggah' : 'Sudah Unggah';

      return Object.assign({}, val, {
        periodeLabel: periodeLabel,
        statusUnggahLabel: statusUnggahLabel
      });
    });
  }

  private getPeriodeLabel(periodeValue: any): string {
    var found = this.periodeOptions.find(p => String(p.value) === String(periodeValue));
    return found ? found.label : String(periodeValue || '');
  }


  onEdit(data: any): void {
    Swal.fire({
      type: 'info',
      title: 'Aksi Ubah / Unggah',
      text: 'NIP ' + data.nip + ' - ' + data.nama,
      showCloseButton: true,
    });
  }

  onView(data: any): void {
    Swal.fire({
      title: 'Detail Dokumen Pendukung',
      html:
        '<div style="text-align:left;">' +
        '<div><b>Periode Template:</b> ' + data.templateName + ' - ' + data.periodeLabel + '</div>' +
        '<div><b>NIP:</b> ' + data.nip + '</div>' +
        '<div><b>Nama:</b> ' + data.nama + '</div>' +
        '<div><b>Unit:</b> ' + data.unit + '</div>' +
        '<div><b>Deskripsi Pekerjaan:</b> ' + data.deskripsiPekerjaan + '</div>' +
        '<div><b>Status Unggah:</b> ' + data.statusUnggahLabel + '</div>' +
        '</div>',
      showCloseButton: true,
    });
  }

  // dipanggil saat klik tombol search / tekan Enter
  onSearch(): void {
    this.keyword = (this.keyword || '').trim();
    this.getData();
  }

  // dipanggil setiap ngModel berubah
  onKeywordChange(): void {
    // kalau input dikosongkan, langsung reset tabel
    if (!this.keyword || this.keyword.trim() === '') {
      this.keyword = '';
      this.getData();
    }
  }

}
