import { OauthService } from 'src/app/_services/oauth.service';
import { Injectable } from '@angular/core';



export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const Admin = {
  id: 3,
  title: 'Admin',
  type: 'item',
  url: '/sample-page-admin',
  classes: 'nav-item',
  icon: 'icofont icofont-paper'
};

const Approval = {
  id: 4,
  title: 'Approval',
  type: 'item',
  url: '/berita-acara-approval',
  classes: 'nav-item',
  icon: 'icofont icofont-law-document'
};

const Vendor = {
  id: 5,
  title: 'Vendor',
  type: 'item',
  url: '/vendor',
  classes: 'nav-item',
  icon: 'icofont icofont-law-document'
};

const ListVendor = {
  id: 6,
  title: 'List Vendor',
  type: 'item',
  url: '/list-vendor',
  classes: 'nav-item',
  icon: 'ph-duotone ph-house-line f-20'
};

const ManajemenTemplate = {
  id: 7,
  title: 'Manajemen Template',
  type: 'item',
  url: '/manajemen-template',
  classes: 'nav-item',
  icon: 'ph-duotone ph-file-text f-20'
};

const AgendaPenilaian = {
  id: 8,
  title: 'Agenda Penilaian',
  type: 'item',
  url: '/agenda-penilaian',
  classes: 'nav-item',
  icon: 'ph-duotone ph-list-checks f-20'
};

const DetailPenilaianPegawai = {
  id: 9,
  title: 'Detail Penilaian Pegawai',
  type: 'item',
  url: '/detail-penilaian-pegawai',
  classes: 'nav-item',
};

const EditPenilaianPegawai = {
  id: 10,
  title: 'Edit Penilaian Pegawai',
  type: 'item',
  url: '/edit-penilaian-pegawai',
  classes: 'nav-item',
};

const MasukkanNku = {
  id: 11,
  title: 'Masukkan NKU',
  type: 'item',
  url: '/masukkan-nku',
  classes: 'nav-item',
  icon: 'ph-duotone ph-note-pencil f-20'
};

const Pengaturan = {
  id: 11,
  title: 'Pengaturan',
  type: 'collapse',
  url: '/pengaturan',
  classes: 'nav-item',
  icon: 'ph-duotone ph-gear f-20',
  children: [
    {
      id: 'manajemen-sumber-data',
      title: 'Manajemen Sumber Data',
      type: 'item',
      url: '/pengaturan/manajemen-sumber-data'
    },
    {
      id: 'dokumen-pendukung-pegawai',
      title: 'Daftar Dokumen Pendukung Pegawai',
      type: 'item',
      url: '/pengaturan/dokumen-pendukung-pegawai'
    }
  ]
};

const SdmPenilaiSatu = {
  id: 12,
  title: 'Data Atasan dan Pegawai',
  type: 'item',
  url: '/sdm-penilai-satu',
  classes: 'nav-item',
  icon: 'ph-duotone ph-user-list f-20'
};

const pegawai = {
  id: 13,
  title: 'Data Atasan dan Pegawai',
  type: 'item',
  url: '/pegawai',
  classes: 'nav-item',
  icon: 'ph-duotone ph-user-list f-20'
};

const PenilaiSatuAtasanLangsung = {
  id: 12,
  title: 'Data Atasan dan Pegawai',
  type: 'item',
  url: '/penilai-satu-atasan-langsung',
  classes: 'nav-item',
  icon: 'ph-duotone ph-user-list f-20'
};

const DataNki = {
  id: 14,
  title: 'Bangkitkan NKI',
  type: 'item',
  url: '/data-nki',
  classes: 'nav-item',
  icon: 'ph-duotone ph-chart-bar f-20'
};

const NavigationItems = [
  {
    id: 0,
    title: 'Menu',
    type: 'group',
    icon: 'ph-duotone ph-house-line f-20',
    children: [
      {
        id: 'home',
        title: 'HOME.dashboard',
        type: 'item',
        url: '/home',
        classes: 'nav-item',
        icon: 'ph-duotone ph-house-line f-20'
      },
      {
        id: 'sample-page',
        title: 'ROOT.sample_page',
        type: 'collapse',
        classes: 'nav-item',
        icon: 'ph-duotone ph-app-window f-20',
        children: [
          {
            id: 'component',
            title: 'ROOT.component',
            type: 'item',
            url: '/sample-page/component'
          },
          {
            id: 'form-table',
            title: 'ROOT.form_table',
            type: 'item',
            url: '/sample-page/form-table'
          },
          {
            id: 'not-found',
            title: 'ROOT.not_found',
            type: 'item',
            url: '/sample-page/blank-page'
          }
        ]
      },
      {
        id: 'disabled-menu',
        title: 'Disabled Menu',
        type: 'item',
        url: 'javascript:',
        classes: 'nav-item disabled',
        icon: 'feather icon-power',
        external: true
      }
    ]
  },
  {
    id: 1,
    title: 'Pegawai',
    type: 'group',
    icon: 'ph-duotone ph-house-line f-20',
    children: [

    ]
  }
];

@Injectable()
export class NavigationItem {
  public items = [];
  constructor(
    private oauthService: OauthService
  ) { }

  public addOrReplace(item) {
    if (this.items.indexOf(item) === -1) {
      this.items.push(item);
      NavigationItems[0]['children'].push(item);
    }
  }

  public addOrReplace2(item) {
    if (this.items.indexOf(item) === -1) {
      this.items.push(item);
      NavigationItems[1]['children'].push(item);
    }
  }

  public get() {
    // this.addOrReplace(Vendor);
    this.addOrReplace(ManajemenTemplate);
    this.addOrReplace(AgendaPenilaian);
    this.addOrReplace(MasukkanNku);
    this.addOrReplace(Pengaturan);
    this.addOrReplace(PenilaiSatuAtasanLangsung);
    this.addOrReplace(DataNki);


    // if (this.oauthService.checkScope('attendance-pic-unit') || this.oauthService.checkScope('training-user-approval')) {
    //   this.addOrReplace2(pegawai);
    // }

    this.addOrReplace2(pegawai);

    if (this.oauthService.checkScope('superadmin-credit-payment')) {
      this.addOrReplace2(ListVendor)
    }

    if (this.oauthService.checkScope('rotation-user-approval')) {
      this.addOrReplace(Approval);
    }

    return NavigationItems;
  }
}
