import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sikap-kerja',
  templateUrl: './sikap-kerja.component.html',
  styleUrls: ['./sikap-kerja.component.scss']
})
export class SikapKerjaComponent implements OnInit {

  // ===== TAB ACTIVE =====
  public activeTab: 'target' | 'sikap' | 'inovasi' = 'sikap';

  // ===== PARAMS =====
  public pegawaiId: string = '';
  public penilaianId: string = '';

  // ===== LOADING =====
  public loadingPage: boolean = false;
  public roleContext: string = '';

  // ===== DATA PEGAWAI =====
  public pegawai: any = {
    nama: '-',
    nip: '-',
    lokasi: '-',
    periode: '-',
    deskripsi: '-'
  };

  // ===== NILAI FINAL PER ASPEK =====
  public nilaiHarmony: number | null = null;
  public nilaiExcellence: number | null = null;
  public nilaiIntegrity: number | null = null;

  // ===== DETAIL NILAI HARMONY =====
  public nilaiHarmonyKomunikasi: number | null = null;
  public nilaiHarmonyKolaborasi: number | null = null;
  public nilaiHarmonyKerjaSamaTim: number | null = null;
  public nilaiHarmonySoliditas: number | null = null;

  // ===== DETAIL NILAI EXCELLENCE =====
  public nilaiExcellenceRoleModel: number | null = null;
  public nilaiExcellenceTanggungJawab: number | null = null;
  public nilaiExcellenceEtikaProfesi: number | null = null;
  public nilaiExcellenceMenjagaCitraInstitusi: number | null = null;

  // ===== DETAIL NILAI INTEGRITY =====
  public nilaiIntegrityEtosKerja: number | null = null;
  public nilaiIntegrityMediatek: number | null = null;
  public nilaiIntegrityKerjaCerdas: number | null = null;
  public nilaiIntegrityInisiatif: number | null = null;
  public nilaiIntegrityDisiplin: number | null = null;

  // ===== ACCORDION SIKAP KERJA =====
  public expandedSikapSection: string = 'harmony';

  // ===== FEEDBACK / RESULT =====
  public feedbackAtasan: string = '';
  public hasilTotalNilai: number = 0;
  public hasilRataRata: string = '0.00';
  public hasilPredikat: string = 'Unggul';
  public feedbackAtasanResult: string = 'belum ada feedback dari atasan';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcasterService: BroadcasterService,
    public translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('id');
  }

  ngOnInit(): void {
    this.pegawaiId = this.route.snapshot.paramMap.get('pegawaiId') || '';
    this.penilaianId = this.route.snapshot.paramMap.get('penilaianId') || '';

    this.roleContext = (this.route.snapshot && this.route.snapshot.data)
      ? (this.route.snapshot.data['roleContext'] || '')
      : '';

    var st: any = window.history && window.history.state ? window.history.state : null;

    if (st && st.pegawai) {
      this.pegawai.nama = st.pegawai.nama || '-';
      this.pegawai.nip = st.pegawai.nip || '-';
      this.pegawai.lokasi = st.pegawai.lokasi || '-';
      this.pegawai.periode = st.pegawai.periode || '-';
      this.pegawai.deskripsi = st.pegawai.deskripsi || '-';

      sessionStorage.setItem('tpa_pegawai_header', JSON.stringify(this.pegawai));
    } else {
      var savedPegawai = sessionStorage.getItem('tpa_pegawai_header');
      if (savedPegawai) {
        this.pegawai = JSON.parse(savedPegawai);
      }
    }
  }

  // ===== TAB NAVIGATION =====
  goToTab(tab: 'target' | 'sikap' | 'inovasi'): void {
    this.activeTab = tab;

    let segment = '';

    if (tab === 'target') {
      segment = 'target-kinerja';
    }

    if (tab === 'sikap') {
      segment = 'sikap-kerja';
    }

    if (tab === 'inovasi') {
      segment = 'ipk';
    }

    this.router.navigate(
      [
        '../..',
        segment,
        this.penilaianId
      ],
      { relativeTo: this.route }
    );
  }

  // ===== ACCORDION ACTION =====
  toggleSikapSection(section: string): void {
    if (this.expandedSikapSection === section) {
      this.expandedSikapSection = '';
    } else {
      this.expandedSikapSection = section;
    }
  }

  isSikapSectionExpanded(section: string): boolean {
    return this.expandedSikapSection === section;
  }

  // ===== HELPER HITUNG RATA-RATA =====
  private hitungRataRataNilai(values: Array<number | null>): number | null {
    var total = 0;
    var count = 0;

    for (var i = 0; i < values.length; i++) {
      if (values[i] !== null && values[i] !== undefined) {
        total = total + Number(values[i]);
        count++;
      }
    }

    if (count > 0) {
      return Math.round(total / count);
    }

    return null;
  }

  // ===== HARMONY ACTION =====
  onHarmonyNilaiChange(): void {
    this.nilaiHarmony = this.hitungRataRataNilai([
      this.nilaiHarmonyKomunikasi,
      this.nilaiHarmonyKolaborasi,
      this.nilaiHarmonyKerjaSamaTim,
      this.nilaiHarmonySoliditas
    ]);

    this.updateResultSummary();
  }

  // ===== EXCELLENCE ACTION =====
  onExcellenceNilaiChange(): void {
    this.nilaiExcellence = this.hitungRataRataNilai([
      this.nilaiExcellenceRoleModel,
      this.nilaiExcellenceTanggungJawab,
      this.nilaiExcellenceEtikaProfesi,
      this.nilaiExcellenceMenjagaCitraInstitusi
    ]);

    this.updateResultSummary();
  }

  // ===== INTEGRITY ACTION =====
  onIntegrityNilaiChange(): void {
    this.nilaiIntegrity = this.hitungRataRataNilai([
      this.nilaiIntegrityEtosKerja,
      this.nilaiIntegrityMediatek,
      this.nilaiIntegrityKerjaCerdas,
      this.nilaiIntegrityInisiatif,
      this.nilaiIntegrityDisiplin
    ]);

    this.updateResultSummary();
  }

  // ===== RESULT SUMMARY SEMENTARA =====
  private updateResultSummary(): void {
    var total = 0;
    var count = 0;

    if (this.nilaiHarmony !== null) {
      total = total + Number(this.nilaiHarmony);
      count++;
    }

    if (this.nilaiExcellence !== null) {
      total = total + Number(this.nilaiExcellence);
      count++;
    }

    if (this.nilaiIntegrity !== null) {
      total = total + Number(this.nilaiIntegrity);
      count++;
    }

    this.hasilTotalNilai = total;

    if (count > 0) {
      var rataRata = total / count;
      this.hasilRataRata = rataRata.toFixed(2);
      this.hasilPredikat = this.getPredikat(Math.round(rataRata));
    } else {
      this.hasilRataRata = '0.00';
      this.hasilPredikat = '-';
    }
  }

  private getPredikat(nilai: number): string {
    if (nilai > 90 && nilai <= 100) {
      return 'Unggul';
    }

    if (nilai > 80 && nilai <= 90) {
      return 'Ditunjukkan dengan baik sekali';
    }

    if (nilai > 70 && nilai <= 80) {
      return 'Ditunjukkan dengan baik';
    }

    if (nilai > 60 && nilai <= 70) {
      return 'Cukup ditunjukkan';
    }

    return 'Belum menunjukkan / kurang';
  }

  // ===== ACTION BUTTONS =====
  onCancel(): void {
    this.nilaiHarmony = null;
    this.nilaiExcellence = null;
    this.nilaiIntegrity = null;

    this.nilaiHarmonyKomunikasi = null;
    this.nilaiHarmonyKolaborasi = null;
    this.nilaiHarmonyKerjaSamaTim = null;
    this.nilaiHarmonySoliditas = null;

    this.nilaiExcellenceRoleModel = null;
    this.nilaiExcellenceTanggungJawab = null;
    this.nilaiExcellenceEtikaProfesi = null;
    this.nilaiExcellenceMenjagaCitraInstitusi = null;

    this.nilaiIntegrityEtosKerja = null;
    this.nilaiIntegrityMediatek = null;
    this.nilaiIntegrityKerjaCerdas = null;
    this.nilaiIntegrityInisiatif = null;
    this.nilaiIntegrityDisiplin = null;

    this.feedbackAtasan = '';
    this.hasilTotalNilai = 0;
    this.hasilRataRata = '0.00';
    this.hasilPredikat = 'Unggul';

    this.toast('Info', 'Perubahan dibatalkan.', 'info');
  }

  onSave(): void {
    if (this.nilaiHarmony == null || this.nilaiExcellence == null || this.nilaiIntegrity == null) {
      this.toast('Gagal', 'Harap isi nilai untuk semua aspek Harmony, Excellence, dan Integrity.', 'error');
      return;
    }

    const payload = {
      pegawaiId: this.pegawaiId,
      penilaianId: this.penilaianId,

      harmony: this.nilaiHarmony,
      excellence: this.nilaiExcellence,
      integrity: this.nilaiIntegrity,

      detail: {
        harmony: {
          komunikasi: this.nilaiHarmonyKomunikasi,
          kolaborasi: this.nilaiHarmonyKolaborasi,
          kerjaSamaTim: this.nilaiHarmonyKerjaSamaTim,
          soliditas: this.nilaiHarmonySoliditas
        },
        excellence: {
          roleModel: this.nilaiExcellenceRoleModel,
          tanggungJawab: this.nilaiExcellenceTanggungJawab,
          etikaProfesi: this.nilaiExcellenceEtikaProfesi,
          menjagaCitraInstitusi: this.nilaiExcellenceMenjagaCitraInstitusi
        },
        integrity: {
          etosKerja: this.nilaiIntegrityEtosKerja,
          mediatek: this.nilaiIntegrityMediatek,
          kerjaCerdas: this.nilaiIntegrityKerjaCerdas,
          inisiatif: this.nilaiIntegrityInisiatif,
          disiplin: this.nilaiIntegrityDisiplin
        }
      },

      feedback: this.feedbackAtasan || ''
    };

    console.log('PAYLOAD SIKAP KERJA:', payload);

    this.toast('Sukses', 'Penilaian Sikap Kerja berhasil disimpan (dummy).', 'success');
  }

  // ===== TOAST =====
  private toast(title: string, msg: string, type: 'success' | 'error' | 'info'): void {
    this.broadcasterService.notifBroadcast(true, {
      title,
      msg,
      timeout: 4000,
      theme: 'bootstrap',
      position: 'top-right',
      type
    });
  }
}