import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rekap-performasi',
  templateUrl: './rekap-performasi.component.html',
  styleUrls: ['./rekap-performasi.component.scss']
})
export class RekapPerformasiComponent implements OnInit {

  public rowData: any;

  // Static mockup data based on design
  public detailPenilaian = [
    {
      komponen: 'Proposal Kerja DTKP',
      porsi: '40%',
      atasanLangsung: '11800030-1 REZA PRAMITA',
      atasanTidakLangsung: '',
      nilai: 100,
      nilaiPorsi: 40.00
    },
    {
      komponen: 'Sikap Kerja',
      porsi: '60%',
      atasanLangsung: '11800030-1 REZA PRAMITA',
      atasanTidakLangsung: '94720034-1 DENI WAHYU',
      nilai: 78,
      nilaiPorsi: 44.28
    }
  ];

  public scores = {
    totalNkiMurni: 2.62,
    nilaiKerjaUnit: 2.62,
    totalNkiAkhir: 2.62,
    kelebihanPoint: 2.62
  };

  constructor(private router: Router, private location: Location) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state['data']) {
      this.rowData = navigation.extras.state['data'];
    }
  }

  ngOnInit(): void {
    if (!this.rowData) {
      // If user navigates directly without state, we can fallback to history state if available
      this.rowData = history.state.data;
    }
  }

  goBack(): void {
    this.location.back();
  }

}
