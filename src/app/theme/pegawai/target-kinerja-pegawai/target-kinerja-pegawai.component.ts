import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { OauthService } from 'src/app/_services/oauth.service';
import { TupTpaService } from 'src/app/_services/tup-tpa.service';
//cek push 

type AccessContext =
  | 'OWN_DATA'
  | 'STAFF_DATA'; 

type RoleTpa =
  | 'PENILAI_1'
  | 'PENILAI_2'
  | 'SDM_PENILAI_1'
  | 'SDM_PENILAI_2'
  | 'PEGAWAI';

type KondisiKey =
  | 'KONDISI_1'
  | 'KONDISI_2'
  | 'KONDISI_3'
  | 'KONDISI_4'
  | 'KONDISI_5'
  | 'KONDISI_6'
  | 'KONDISI_7'
  | 'KONDISI_8'
  | 'KONDISI_9'
  | 'KONDISI_10'
  | 'KONDISI_11'
  | 'KONDISI_12'
  | 'KONDISI_13'
  | 'KONDISI_14'
  | 'KONDISI_15'
  | 'KONDISI_16'
  | 'KONDISI_17'
  | 'KONDISI_18'
  | 'KONDISI_19'
  | 'KONDISI_20';

type MatrixValue = 'aktif' | 'tidak aktif';

interface ActionState {
  show: boolean;
  disabled: boolean;
}

interface FooterActions {
  approveTarget: ActionState;
  reviseTarget: ActionState;
  resetTarget: ActionState;
  approveRealisasi: ActionState;
  reviseRealisasi: ActionState;
  resetRealisasi: ActionState;
}

type FooterButtonKey =
  | 'approveTarget'
  | 'reviseTarget'
  | 'resetTarget'
  | 'approveRealisasi'
  | 'reviseRealisasi'
  | 'resetRealisasi';

type FooterRoleConfig = Record<FooterButtonKey, MatrixValue>;

interface FooterKondisiConfig {
  PENILAI_1: FooterRoleConfig;
  PENILAI_2: FooterRoleConfig;
  SDM_PENILAI_1: FooterRoleConfig;
  SDM_PENILAI_2: FooterRoleConfig;
}

interface PageUiConfig {
  editObjektif: boolean;
  tambahTkp: boolean;
  editDtkp: boolean;
  hapusDtkp: boolean;
  viewEvidence: boolean;
}

const DISABLED_ALL: FooterRoleConfig = {
  approveTarget: 'tidak aktif',
  reviseTarget: 'tidak aktif',
  resetTarget: 'tidak aktif',
  approveRealisasi: 'tidak aktif',
  reviseRealisasi: 'tidak aktif',
  resetRealisasi: 'tidak aktif'
};

const FOOTER_BUTTON_MATRIX: Record<KondisiKey, FooterKondisiConfig> = {
  KONDISI_1: {
    PENILAI_1: { ...DISABLED_ALL },
    PENILAI_2: { ...DISABLED_ALL },
    SDM_PENILAI_1: { ...DISABLED_ALL },
    SDM_PENILAI_2: { ...DISABLED_ALL }
  },

  KONDISI_2: {
    PENILAI_1: { ...DISABLED_ALL },
    PENILAI_2: { ...DISABLED_ALL },
    SDM_PENILAI_1: { ...DISABLED_ALL },
    SDM_PENILAI_2: { ...DISABLED_ALL }
  },

  KONDISI_3: {
    PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_4: {
    PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_5: {
    PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_6: {
    PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_7: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_8: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_9: {
    PENILAI_1: { ...DISABLED_ALL },
    PENILAI_2: { ...DISABLED_ALL },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_10: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_11: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_12: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_13: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_14: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_15: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_16: {
    PENILAI_1: { ...DISABLED_ALL },
    PENILAI_2: { ...DISABLED_ALL },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'aktif'
    }
  },

  KONDISI_17: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_18: {
    PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_19: {
    PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  },

  KONDISI_20: {
    PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_1: {
      approveTarget: 'aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    },
    SDM_PENILAI_2: {
      approveTarget: 'tidak aktif',
      reviseTarget: 'tidak aktif',
      resetTarget: 'tidak aktif',
      approveRealisasi: 'tidak aktif',
      reviseRealisasi: 'tidak aktif',
      resetRealisasi: 'tidak aktif'
    }
  }
};

const PAGE_UI_MATRIX: Record<KondisiKey, PageUiConfig> = {
  KONDISI_1: { editObjektif: false, tambahTkp: false, editDtkp: false, hapusDtkp: false, viewEvidence: false },
  KONDISI_2: { editObjektif: true, tambahTkp: true, editDtkp: false, hapusDtkp: false, viewEvidence: false },
  KONDISI_3: { editObjektif: true, tambahTkp: true, editDtkp: true, hapusDtkp: true, viewEvidence: false },
  KONDISI_4: { editObjektif: true, tambahTkp: true, editDtkp: true, hapusDtkp: true, viewEvidence: false },
  KONDISI_5: { editObjektif: true, tambahTkp: true, editDtkp: true, hapusDtkp: true, viewEvidence: false },
  KONDISI_6: { editObjektif: true, tambahTkp: true, editDtkp: true, hapusDtkp: true, viewEvidence: false },
  KONDISI_7: { editObjektif: false, tambahTkp: false, editDtkp: false, hapusDtkp: false, viewEvidence: false },
  KONDISI_8: { editObjektif: false, tambahTkp: false, editDtkp: false, hapusDtkp: false, viewEvidence: false },
  KONDISI_9: { editObjektif: false, tambahTkp: false, editDtkp: true, hapusDtkp: false, viewEvidence: false },
  KONDISI_10: { editObjektif: false, tambahTkp: false, editDtkp: true, hapusDtkp: false, viewEvidence: true },
  KONDISI_11: { editObjektif: false, tambahTkp: false, editDtkp: true, hapusDtkp: false, viewEvidence: true },
  KONDISI_12: { editObjektif: false, tambahTkp: false, editDtkp: true, hapusDtkp: false, viewEvidence: true },
  KONDISI_13: { editObjektif: false, tambahTkp: false, editDtkp: true, hapusDtkp: false, viewEvidence: true },
  KONDISI_14: { editObjektif: false, tambahTkp: false, editDtkp: false, hapusDtkp: false, viewEvidence: true },
  KONDISI_15: { editObjektif: false, tambahTkp: false, editDtkp: false, hapusDtkp: false, viewEvidence: true },
  KONDISI_16: { editObjektif: false, tambahTkp: false, editDtkp: false, hapusDtkp: false, viewEvidence: true },
  KONDISI_17: { editObjektif: false, tambahTkp: false, editDtkp: false, hapusDtkp: false, viewEvidence: true },
  KONDISI_18: { editObjektif: false, tambahTkp: false, editDtkp: true, hapusDtkp: false, viewEvidence: true },
  KONDISI_19: { editObjektif: false, tambahTkp: false, editDtkp: true, hapusDtkp: true, viewEvidence: true },
  KONDISI_20: { editObjektif: true, tambahTkp: true, editDtkp: true, hapusDtkp: true, viewEvidence: true }
};

@Component({
  selector: 'app-pegawai-target-kinerja-pegawai',
  templateUrl: './target-kinerja-pegawai.component.html',
  styleUrls: ['./target-kinerja-pegawai.component.scss']
})
export class PegawaiTargetKinerjaPegawaiComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  @ViewChild('modalTambahTkp', { static: true }) public modalTambahTkp: any;
  @ViewChild('modalEditTkp', { static: true }) public modalEditTkp: any;
  @ViewChild('dtFilterHost', { static: false }) dtFilterHostRef!: ElementRef;

  public activeTab: 'target' | 'sikap' | 'inovasi' = 'target';

  //class utk role
  public accessContext: AccessContext = 'OWN_DATA';
  public loggedInEmployeeId: string = '';

  public pegawaiId: string = '';
  public penilaianId: string = '';

  public keyword: string = '';
  public isSearching: boolean = true;

  public loadingModalTkp: boolean = false;
  public loadingModalTambah: boolean = false;

  //toggle detail 
  private expandClickHandler: any = null;

  //api GetActiveTKP
  public activeTkpResponse: any = null;
  public activeTkpPagination: any = null;

  //api inserttkp
  public selectedEmployeeDataPeriodId: string = '';

  //api GetDetailTKP
  public selectedTkpId: string = '';
  public detailTkpResponse: any = null;
  public detailTkpHeader: any = null; //simpan object detail parentnya
  public activeTkpHeader: any = null;

  public rowsTkp: any[] = [];
  public pagedRowsTkp: any[] = [];
  public pageTkp: number = 1;
  public pageSizeTkp: number = 1;
  public totalPagesTkp: number = 1;
  public pagesTkp: number[] = [];
  public pageInfoTkp: any = { start: 0, end: 0, total: 0 };

  public optionsSatuan: any[] = [
    { value: '%', label: '%' },
    { value: 'Dokumen', label: 'Dokumen' },
    { value: 'Unit', label: 'Unit' }
  ];

  public optionsUkuran: any[] = [
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: '=', label: '=' }
  ];

  public optionsReferensi: any[] = [
    { value: 'Sarmut', label: 'Sarmut' },
    { value: 'SKI', label: 'SKI' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  public optionsMatrix: any[] = [
    { value: '1', label: 'Matrix 1' }
  ];

  public readonly MIN_TKP = 8;
  public readonly MAX_TKP = 20;

  public showDeleteActiveRowConfirm: boolean = false;
  private activeRowToDelete: any = null;

  public loadingModalEditTkp: boolean = false;
  public editingRowId: string = '';

  public editTkp: any = {
    id: '',
    deskripsi: '',
    satuan: '',
    ukuran: '',
    referensi: '',
    final_score: '',

    evidenceReferenceFile: null,
    evidenceReferenceName: '',

    evidenceTargetFile: null,
    evidenceTargetName: '',

    evidenceAchievementFile: null,
    evidenceAchievementName: '',

    targetTw1: '',
    targetTw2: '',
    targetTw3: '',
    targetTw4: '',

    achievementTw1: '',
    achievementTw2: '',
    achievementTw3: '',
    achievementTw4: ''
  };

  public showDeleteConfirm: boolean = false;
  public showDeleteSuccess: boolean = false;
  public loadingDelete: boolean = false;
  private deletingRow: any = null;

  dtOptions: DataTables.Settings[] = [];
  dtTrigger: Subject<any> = new Subject<any>();

  loadingPage = false;

  public employeeDetail: any = null;
  public isLoadingEmployee: boolean = false;

  public isEditDisabled = false;
  public isSaveCancelVisible = false;
  public isTambahTkpDisabled: boolean = false;

  roleTpa!: RoleTpa;
  public roleContext: string = '';
  public isPenilaiAtasan: boolean = false;

  currentKondisi: KondisiKey = 'KONDISI_1';
  actions: FooterActions = this.getAllButtonsDisabled();

  /** True jika ada minimal satu aksi sekunder untuk dropdown "Aksi Lainnya". */
  get showAksiLainnyaDropdown(): boolean {
    const a = this.actions;
    return (
      a.reviseTarget.show ||
      a.resetTarget.show ||
      a.approveRealisasi.show ||
      a.reviseRealisasi.show ||
      a.resetRealisasi.show
    );
  }

  pegawai = {
    nama: '-',
    nip: '-',
    lokasi: '-',
    periode: '-',
    deskripsi: '-'
  };

  objektifText = '';
  isObjektifEdit = false;

  rawData: any[] = [];
  dataTable: any[] = [];
  pagedMainTable: any[] = [];
  mainPage: number = 1;
  mainPageSize: number = 10;
  mainTotalPages: number = 1;
  mainPages: number[] = [];
  mainPageInfo: any = { start: 0, end: 0, total: 0 };
  averageScore = 100;
  tpaPeriods: any[] = [];
  selectedTpaPeriodId: string = 'default';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public translateService: TranslateService,
    private broadcasterService: BroadcasterService,
    private oauthService: OauthService,
    private tupTpaService: TupTpaService
  ) {
    this.translateService.setDefaultLang('id');
  }

  loadTpaPeriods(): void {
    this.tupTpaService.getTpaPeriod().subscribe(
      (res: any) => {
        if (res && res.success && Array.isArray(res.data)) {
          this.tpaPeriods = res.data;
          if (this.penilaianId && this.penilaianId !== 'default') {
            this.selectedTpaPeriodId = this.penilaianId;
          } else {
            this.selectedTpaPeriodId = 'default';
          }
        }
      },
      (err: any) => {
        console.error('Gagal memuat periode TPA:', err);
      }
    );
  }

  onPeriodChange(event: any): void {
    this.selectedTpaPeriodId = event.target.value;
    console.log('Periode TPA terpilih:', this.selectedTpaPeriodId);
  }

  goToTab(tab: 'target' | 'sikap' | 'inovasi') {
    this.activeTab = tab;

    let segment = '';
    if (tab === 'target') segment = 'target-kinerja';
    if (tab === 'sikap') segment = 'sikap-kerja';
    if (tab === 'inovasi') segment = 'ipk';

    this.router.navigate(
      ['../..', segment, this.penilaianId],
      {
        relativeTo: this.route,
        state: {
          pegawai: this.pegawai
        }
      }
    );
  }

  public onSearch(): void {
    var kw = (this.keyword || '').trim().toLowerCase();

    if (!kw) {
      this.resetSearch();
      return;
    }

    this.isSearching = true;

    var filtered = (this.rawData || []).filter((r: any) => {
      var desc = (r && r.deskripsi) ? String(r.deskripsi).toLowerCase() : '';
      return desc.indexOf(kw) !== -1;
    });

    this.dataTable = filtered.slice();
    this.rerenderMainTable();
  }

  public onKeywordChange(): void {
    var kw = (this.keyword || '').trim();
    if (kw.length === 0) {
      this.resetSearch();
    }
  }

  private resetSearch(): void {
    this.isSearching = false;
    this.dataTable = (this.rawData || []).slice();
    this.rerenderMainTable();
  }

  //api GetActive TKP (method)
  private mapActiveTkpItemToRow(item: any): any {
    return {
      id: item && item.id ? item.id : '',
      tpaEmployeeDataPeriodId: item && item.tpa_employee_data_period_id ? item.tpa_employee_data_period_id : null,
      employeeId: item && item.employee_id ? item.employee_id : '',
      tpaContentPeriodId: item && item.tpa_content_period_id ? item.tpa_content_period_id : null,
      activeStatus: item && item.active_status ? item.active_status : '',
      createdBy: item && item.created_by ? item.created_by : null,
      updatedBy: item && item.updated_by ? item.updated_by : null,
      createdAt: item && item.created_at ? item.created_at : '',
      updatedAt: item && item.updated_at ? item.updated_at : '',

      deskripsi: item && item.objective ? item.objective : '',
      satuan: '',
      ukuran: '',
      referensi: '',
      targetTw1: '',
      targetTw2: '',
      targetTw3: '',
      targetTw4: '',
      realisasiTw1: '',
      realisasiTw2: '',
      realisasiTw3: '',
      realisasiTw4: '',
      evidenceRealisasi12File: null,
      evidenceRealisasi12Name: '',
      evidenceRealisasi34File: null,
      evidenceRealisasi34Name: '',
      expanded: false
    };
  }

  private loadActiveTkp(): void {
    var employeeId = '';
    var self = this;

    this.loadingPage = true;
    self.selectedEmployeeDataPeriodId = '';

    if (this.roleContext === 'PEGAWAI') {
      employeeId = this.pegawai && this.pegawai.nip ? this.pegawai.nip : '';
    } else {
      employeeId = this.pegawaiId || (this.pegawai && this.pegawai.nip ? this.pegawai.nip : '');
    }

    this.tupTpaService.getActiveTkp(employeeId, 1).subscribe(
      function (res: any) {
        var list = [];
        var firstItem = null;
        var firstTkpId = '';

        self.activeTkpResponse = res;
        self.activeTkpPagination = res && res.data ? res.data : null;

        if (res && res.data && Array.isArray(res.data.data)) {
          list = res.data.data;
        }

        if (list.length > 0) {
          firstItem = list[0];
        }

        if (!firstItem) {
          self.activeTkpHeader = null;
          self.selectedTkpId = '';
          self.selectedEmployeeDataPeriodId = '';
          self.objektifText = '';
          self.rawData = [];
          self.dataTable = [];
          self.rerenderMainTable();
          self.updateKondisiByTargetCount();
          self.loadingPage = false;
          return;
        }

        self.activeTkpHeader = firstItem;
        self.selectedEmployeeDataPeriodId = firstItem.tpa_employee_data_period_id
          ? String(firstItem.tpa_employee_data_period_id)
          : '';
        firstTkpId = firstItem.id ? String(firstItem.id) : '';
        self.selectedTkpId = firstTkpId;
        self.objektifText = firstItem.objective ? firstItem.objective : '';

        self.rawData = [self.mapActiveHeaderToFallbackRow(firstItem)];
        self.dataTable = self.rawData.slice();
        self.rerenderMainTable();
        self.updateKondisiByTargetCount();

        if (firstTkpId) {
          self.loadDetailTkp(firstTkpId);
        } else {
          self.loadingPage = false;
        }
      },
      function (err: any) {
        console.error('[GetActiveTKP] error', err);
        self.activeTkpResponse = null;
        self.activeTkpPagination = null;
        self.activeTkpHeader = null;
        self.selectedTkpId = '';
        self.selectedEmployeeDataPeriodId = '';
        self.objektifText = '';
        self.rawData = [];
        self.dataTable = [];
        self.rerenderMainTable();
        self.loadingPage = false;
        self.toast('Gagal', 'Data target kinerja gagal dimuat.', 'error');
      }
    );
  }
  //ini

  //API GetDetailTKP
  private mapDetailTkpItemToRow(item: any): any {
    var getValue = function (v: any): any {
      if (v === null || v === undefined) return '';
      if (typeof v === 'string' || typeof v === 'number') return v;

      if (typeof v === 'object') {
        if (v['value'] !== undefined && v['value'] !== null) return v['value'];
        if (v['target'] !== undefined && v['target'] !== null) return v['target'];
        if (v['achievement'] !== undefined && v['achievement'] !== null) return v['achievement'];
        if (v['realisasi'] !== undefined && v['realisasi'] !== null) return v['realisasi'];
        if (v['score'] !== undefined && v['score'] !== null) return v['score'];
        if (v['amount'] !== undefined && v['amount'] !== null) return v['amount'];
        if (v['qty'] !== undefined && v['qty'] !== null) return v['qty'];
        if (v['total'] !== undefined && v['total'] !== null) return v['total'];
        if (v['result'] !== undefined && v['result'] !== null) return v['result'];
        if (v['data'] !== undefined && v['data'] !== null) return v['data'];
      }

      return '';
    };

    var targets: any = item && item.targets ? item.targets : {};
    var achievements: any = item && item.achievements ? item.achievements : {};

    return {
      id: item && item.id ? item.id : this.generateUuid(),

      deskripsi: item && item.key_result ? item.key_result : '',
      satuan: item && item.matrix_id ? String(item.matrix_id) : '',
      ukuran: item && item.measurement ? item.measurement : '',
      referensi: item && item.reference ? item.reference : '',
      final_score: item && item.final_score ? item.final_score : '',

      targetTw1: getValue(targets[0] !== undefined ? targets[0] : targets['1']),
      targetTw2: getValue(targets[1] !== undefined ? targets[1] : targets['2']),
      targetTw3: getValue(targets[2] !== undefined ? targets[2] : targets['3']),
      targetTw4: getValue(targets[3] !== undefined ? targets[3] : targets['4']),

      achievementTw1: getValue(achievements[0] !== undefined ? achievements[0] : achievements['1']),
      achievementTw2: getValue(achievements[1] !== undefined ? achievements[1] : achievements['2']),
      achievementTw3: getValue(achievements[2] !== undefined ? achievements[2] : achievements['3']),
      achievementTw4: getValue(achievements[3] !== undefined ? achievements[3] : achievements['4']),

      evidenceReferenceFile: null,
      evidenceReferenceName: this.extractFileName(item && item.evidence_reference ? item.evidence_reference : ''),

      evidenceTargetFile: null,
      evidenceTargetName: this.extractFileName(item && item.evidence_target ? item.evidence_target : ''),

      evidenceAchievementFile: null,
      evidenceAchievementName: this.extractFileName(item && item.evidence_achievement ? item.evidence_achievement : ''),

      expanded: false,
      raw: item
    };
  }

  private extractFileName(path: any): string {
    var s = this.safeText(path);
    if (!s) return '';
    var parts = s.split('/');
    return parts.length > 0 ? parts[parts.length - 1] : s;
  }

  /* kalau details ada isi -> pakai details
    kalau kosong -> jangan timpa fallback row */
  private loadDetailTkp(tpaTkpId: string): void {
    var self = this;

    if (!tpaTkpId) {
      this.loadingPage = false;
      return;
    }

    this.tupTpaService.getDetailTkp(tpaTkpId).subscribe(
      function (res: any) {
        var detailList = [];

        self.detailTkpResponse = res;
        self.detailTkpHeader = res && res.data ? res.data : null;

        if (res && res.data && res.data.objective) {
          self.objektifText = res.data.objective;
        }

        if (res && res.data && Array.isArray(res.data.details)) {
          detailList = res.data.details;
        }

        if (detailList.length > 0) {
          self.rawData = detailList.map(function (item: any) {
            return self.mapDetailTkpItemToRow(item);
          });
          self.dataTable = self.rawData.slice();
          self.rerenderMainTable();
          self.updateKondisiByTargetCount();
        }

        self.loadingPage = false;
      },
      function (err: any) {
        console.error('[GetDetailTKP] error', err);
        // fallback dari GetActiveTKP tetap dipertahankan
        self.loadingPage = false;
      }
    );
  }

  private mapActiveHeaderToFallbackRow(item: any): any {
    return {
      id: item && item.id ? String(item.id) : this.generateUuid(),
      deskripsi: item && item.objective ? item.objective : '',
      satuan: '',
      ukuran: '',
      referensi: '',
      targetTw1: '',
      targetTw2: '',
      targetTw3: '',
      targetTw4: '',
      realisasiTw1: '',
      realisasiTw2: '',
      realisasiTw3: '',
      realisasiTw4: '',
      evidenceRealisasi12File: null,
      evidenceRealisasi12Name: '',
      evidenceRealisasi34File: null,
      evidenceRealisasi34Name: '',
      expanded: false,
      isFallbackFromActiveTkp: true
    };
  }
  //ini

  //api insertkp
  private createTkpIfNeeded(callback: Function): void {
    var self = this;
    var payload: any = {};

    if (this.selectedTkpId) {
      callback();
      return;
    }

    if (!this.selectedEmployeeDataPeriodId) {
      this.toast('Gagal', 'tpa_employee_data_period_id tidak ditemukan.', 'error');
      return;
    }

    payload = {
      tpa_employee_data_period_id: this.selectedEmployeeDataPeriodId,
      employee_id: this.pegawai && this.pegawai.nip ? this.pegawai.nip : this.pegawaiId,
      objective: this.objektifText || '',
      tpa_content_period_id: this.activeTkpHeader && this.activeTkpHeader.tpa_content_period_id
        ? this.activeTkpHeader.tpa_content_period_id
        : 1
    };

    this.tupTpaService.insertTkp(payload).subscribe(
      function (res: any) {
        if (res && res.data && res.data.id) {
          self.selectedTkpId = String(res.data.id);
          callback();
        } else {
          self.toast('Gagal', 'Insert TKP gagal.', 'error');
        }
      },
      function (err: any) {
        console.error('[InsertTKP] error', err);
        console.error('[InsertTKP] error body', err && err.error ? err.error : null);
        self.toast('Gagal', 'Insert TKP gagal.', 'error');
      }
    );
  }

  //ini

  //role untuk pembatasan akses
  private resolveAccessContext(): void {
    var profile = this.oauthService.retrieveProfile();
    var loggedInId = profile && profile.numberid ? String(profile.numberid) : '';
    var viewedEmployeeId = this.pegawai && this.pegawai.nip ? String(this.pegawai.nip) : '';

    this.loggedInEmployeeId = loggedInId;

    if (loggedInId && viewedEmployeeId && loggedInId === viewedEmployeeId) {
      this.accessContext = 'OWN_DATA';
    } else {
      this.accessContext = 'STAFF_DATA';
    }

    console.log('[TPA][AccessContext]', {
      loggedInEmployeeId: this.loggedInEmployeeId,
      viewedEmployeeId: viewedEmployeeId,
      accessContext: this.accessContext,
      roleContext: this.roleContext,
      roleTpa: this.roleTpa
    });
  }
  //ini
  private createEmptyTkpRow(): any {
    return {
      __uuid: this.generateUuid(),

      key_result: '',
      matrix_id: '1',
      measurement: '',
      reference: '',
      final_score: '',

      targetTw1: '',
      targetTw2: '',
      targetTw3: '',
      targetTw4: '',

      achievementTw1: '',
      achievementTw2: '',
      achievementTw3: '',
      achievementTw4: '',

      evidenceReferenceFile: null,
      evidenceReferenceName: '',

      evidenceTarget12File: null,
      evidenceTarget12Name: '',
      evidenceTarget34File: null,
      evidenceTarget34Name: '',

      evidenceAchievementFile: null,
      evidenceAchievementName: ''
    };
  }

  private generateUuid(): string {
    return 'tkp_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  }

  public openTambahTkp(): void {
    if (this.isTambahTkpButtonDisabled()) return;

    if (!this.rowsTkp || this.rowsTkp.length === 0) {
      this.rowsTkp = [this.createEmptyTkpRow()];
    }

    this.pageTkp = 1;
    this.rebuildPagingTkp();
    this.modalTambahTkp.show();
  }

  public closeTambahTkp(): void {
    this.modalTambahTkp.hide();
  }

  public closeTambahTkpHard(): void {
    if (this.modalTambahTkp) this.modalTambahTkp.hide();

    this.rowsTkp = [];
    this.pagedRowsTkp = [];
    this.pageTkp = 1;
    this.totalPagesTkp = 1;
    this.pagesTkp = [];
    this.pageInfoTkp = { start: 0, end: 0, total: 0 };

    this.rowsTkp = [this.createEmptyTkpRow()];
    this.rebuildPagingTkp();
  }

  public addRowTkp(): void {
    const count = (this.rowsTkp || []).length;

    if (count >= 20) {
      this.toast('Info', 'Maksimal 20 target kinerja.', 'info');
      return;
    }

    this.rowsTkp.push(this.createEmptyTkpRow());
    this.totalPagesTkp = Math.ceil(this.rowsTkp.length / this.pageSizeTkp) || 1;
    this.pageTkp = this.totalPagesTkp;
    this.rebuildPagingTkp();
  }

  public goToPageTkp(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPagesTkp) page = this.totalPagesTkp;

    this.pageTkp = page;
    this.rebuildPagingTkp();
  }

  private rebuildPagingTkp(): void {
    const total = (this.rowsTkp || []).length;
    this.totalPagesTkp = Math.ceil(total / this.pageSizeTkp) || 1;

    this.pagesTkp = [];
    for (let i = 1; i <= this.totalPagesTkp; i++) {
      this.pagesTkp.push(i);
    }

    const startIndex = (this.pageTkp - 1) * this.pageSizeTkp;
    const endIndex = startIndex + this.pageSizeTkp;

    this.pagedRowsTkp = (this.rowsTkp || []).slice(startIndex, endIndex);

    this.pageInfoTkp = {
      start: total === 0 ? 0 : startIndex + 1,
      end: Math.min(endIndex, total),
      total: total
    };
  }

  public triggerUploadEvidenceReference(row: any): void {
    var el = document.getElementById('fileEvidenceReference_' + row.__uuid) as HTMLInputElement;
    if (el) el.click();
  }

  public triggerUploadEvidenceTarget(row: any, slot: 'TW12' | 'TW34'): void {
    var inputId = slot === 'TW12'
      ? 'fileEvidenceTarget12_' + row.__uuid
      : 'fileEvidenceTarget34_' + row.__uuid;

    var el = document.getElementById(inputId) as HTMLInputElement;
    if (el) el.click();
  }

  public triggerUploadEvidenceAchievement(row: any): void {
    var el = document.getElementById('fileEvidenceAchievement_' + row.__uuid) as HTMLInputElement;
    if (el) el.click();
  }

  public onEvidenceReferenceSelected(event: any, row: any): void {
    var file = event && event.target && event.target.files ? event.target.files[0] : null;
    if (!file) return;

    row.evidenceReferenceFile = file;
    row.evidenceReferenceName = file.name;

    if (event && event.target) {
      event.target.value = '';
    }
  }

  public onEvidenceTargetSelected(event: any, row: any, slot: 'TW12' | 'TW34'): void {
    var file = event && event.target && event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (slot === 'TW12') {
      row.evidenceTarget12File = file;
      row.evidenceTarget12Name = file.name;
    } else {
      row.evidenceTarget34File = file;
      row.evidenceTarget34Name = file.name;
    }

    if (event && event.target) {
      event.target.value = '';
    }
  }

  public onEvidenceAchievementSelected(event: any, row: any): void {
    var file = event && event.target && event.target.files ? event.target.files[0] : null;
    if (!file) return;

    row.evidenceAchievementFile = file;
    row.evidenceAchievementName = file.name;

    if (event && event.target) {
      event.target.value = '';
    }
  }

  //helper inserttkpdetail
  private isTambahTkpRowValid(row: any): boolean {
    if (!row) return false;
    if (!row.key_result || String(row.key_result).trim() === '') return false;
    if (!row.measurement || String(row.measurement).trim() === '') return false;
    if (!row.reference || String(row.reference).trim() === '') return false;
    if (!row.matrix_id || String(row.matrix_id).trim() === '') return false;
    //if (!row.final_score || String(row.final_score).trim() === '') return false;

    if (this.isEvidenceAchievementRequired()) {
      if (!row.evidenceAchievementFile && !row.evidenceAchievementName) {
        return false;
      }
    }

    return true;
  }

  //builder form data
  private buildInsertTkpDetailFormData(row: any): FormData {
    var formData = new FormData();

    formData.append('tpa_tkp_id', this.selectedTkpId);
    formData.append('key_result', row && row.key_result ? String(row.key_result) : '');
    formData.append('final_score', row && row.final_score ? String(row.final_score) : '0');
    formData.append('matrix_id', row && row.matrix_id ? String(row.matrix_id) : '');
    formData.append('measurement', row && row.measurement ? String(row.measurement) : '');
    formData.append('reference', row && row.reference ? String(row.reference) : '');
    formData.append('created_by', '1');

    formData.append('targets[1]', row && row.targetTw1 ? String(row.targetTw1) : '');
    formData.append('targets[2]', row && row.targetTw2 ? String(row.targetTw2) : '');
    formData.append('targets[3]', row && row.targetTw3 ? String(row.targetTw3) : '');
    formData.append('targets[4]', row && row.targetTw4 ? String(row.targetTw4) : '');

    formData.append('achievements[1]', row && row.achievementTw1 ? String(row.achievementTw1) : '');
    formData.append('achievements[2]', row && row.achievementTw2 ? String(row.achievementTw2) : '');
    formData.append('achievements[3]', row && row.achievementTw3 ? String(row.achievementTw3) : '');
    formData.append('achievements[4]', row && row.achievementTw4 ? String(row.achievementTw4) : '');

    if (row && row.evidenceReferenceFile) {
      formData.append('evidence_reference', row.evidenceReferenceFile);
    }

    if (row && row.evidenceTargetFile) {
      formData.append('evidence_target', row.evidenceTargetFile);
    } else if (row && row.evidenceTarget12File) {
      formData.append('evidence_target', row.evidenceTarget12File);
    } else if (row && row.evidenceTarget34File) {
      formData.append('evidence_target', row.evidenceTarget34File);
    }

    if (row && row.evidenceAchievementFile) {
      formData.append('evidence_achievement', row.evidenceAchievementFile);
    }

    return formData;
  }

  public triggerUploadEvidenceRealisasi(row: any, slot: 'TW12' | 'TW34'): void {
    var inputId = (slot === 'TW12')
      ? ('fileEvidenceReal12_' + row.__uuid)
      : ('fileEvidenceReal34_' + row.__uuid);

    var el = document.getElementById(inputId) as HTMLInputElement;
    if (el) {
      el.click();
    } else {
      this.toast('Gagal', 'Input file tidak ditemukan (cek id evidence realisasi).', 'error');
    }
  }

  public onEvidenceRealisasiSelected(event: any, row: any, slot: 'TW12' | 'TW34'): void {
    var file = null;

    if (event && event.target && event.target.files && event.target.files.length > 0) {
      file = event.target.files[0];
    }

    if (!file) return;

    if (slot === 'TW12') {
      row.evidenceRealisasi12File = file;
      row.evidenceRealisasi12Name = file.name;
    } else {
      row.evidenceRealisasi34File = file;
      row.evidenceRealisasi34Name = file.name;
    }

    if (event && event.target) {
      event.target.value = '';
    }
  }

  private getActiveModalRow(): any | null {
    if (!this.pagedRowsTkp || this.pagedRowsTkp.length === 0) return null;
    return this.pagedRowsTkp[0];
  }

  public openDeleteActiveRowTkp(): void {
    if ((this.rowsTkp || []).length <= this.MIN_TKP) {
      this.toast('Info', 'Minimal harus ada ' + this.MIN_TKP + ' target.', 'info');
      return;
    }

    const row = this.getActiveModalRow();
    if (!row) {
      this.toast('Info', 'Tidak ada data aktif untuk dihapus.', 'info');
      return;
    }

    this.activeRowToDelete = row;
    this.showDeleteActiveRowConfirm = true;
  }

  public closeDeleteActiveRowTkp(): void {
    this.showDeleteActiveRowConfirm = false;
    this.activeRowToDelete = null;
  }

  public confirmDeleteActiveRowTkp(): void {
    if (!this.activeRowToDelete) return;

    if ((this.rowsTkp || []).length <= this.MIN_TKP) {
      this.toast('Info', 'Minimal harus ada ' + this.MIN_TKP + ' target.', 'info');
      this.closeDeleteActiveRowTkp();
      return;
    }

    const uuid = String(this.activeRowToDelete.__uuid || '');
    if (!uuid) {
      this.toast('Gagal', 'ID row tidak ditemukan. Pastikan row punya __uuid.', 'error');
      this.closeDeleteActiveRowTkp();
      return;
    }

    this.rowsTkp = (this.rowsTkp || []).filter(r => String(r.__uuid) !== uuid);
    this.fixPagingAfterRowsChange();

    this.toast('Sukses', 'Target aktif berhasil dihapus.', 'success');
    this.closeDeleteActiveRowTkp();
  }

  private fixPagingAfterRowsChange(): void {
    const total = (this.rowsTkp || []).length;

    this.totalPagesTkp = Math.ceil(total / this.pageSizeTkp) || 1;

    if (this.pageTkp > this.totalPagesTkp) this.pageTkp = this.totalPagesTkp;
    if (this.pageTkp < 1) this.pageTkp = 1;

    this.rebuildPagingTkp();
  }

  public saveTambahTkp(): void {
    var self = this;

    this.createTkpIfNeeded(function () {
      var rows = self.rowsTkp || [];
      var total = rows.length;

      if (total === 0) {
        self.toast('Gagal', 'Tidak ada data target untuk disimpan.', 'error');
        return;
      }

      for (var i = 0; i < rows.length; i++) {
        if (!self.isTambahTkpRowValid(rows[i])) {
          self.toast('Gagal', 'Lengkapi field wajib pada target nomor ' + (i + 1) + '.', 'error');
          return;
        }
      }

      self.loadingModalTkp = true;
      self.loadingModalTambah = true;

      var submitIndex = function (index: number): void {
        if (index >= rows.length) {
          self.loadingModalTkp = false;
          self.loadingModalTambah = false;

          self.toast('Sukses', 'Semua target kinerja berhasil ditambahkan.', 'success');
          self.closeTambahTkpHard();

          if (self.selectedTkpId) {
            self.loadDetailTkp(self.selectedTkpId);
          }

          return;
        }

        var formData = self.buildInsertTkpDetailFormData(rows[index]);

        self.tupTpaService.insertTkpDetail(formData).subscribe(
          function (res: any) {
            submitIndex(index + 1);
          },
          function (err: any) {
            console.error('[InsertTKPDetail] error row ' + (index + 1), err);
            console.error('[InsertTKPDetail] error body', err && err.error ? err.error : null);

            self.loadingModalTkp = false;
            self.loadingModalTambah = false;

            self.toast('Gagal', 'Simpan target nomor ' + (index + 1) + ' gagal.', 'error');
          }
        );
      };

      submitIndex(0);
    });
  }

  public openEditTkp(row: any, event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.isEditDtkpDisabled()) return;
    if (!row) return;

    this.editingRowId = String(row.id || '');

    this.editTkp = {
      id: row.id || '',
      deskripsi: row.deskripsi || '',
      satuan: row.satuan || '',
      ukuran: row.ukuran || '',
      referensi: row.referensi || '',
      final_score: row.final_score || '',

      evidenceReferenceFile: null,
      evidenceReferenceName: row.evidenceReferenceName || '',

      evidenceTargetFile: null,
      evidenceTargetName: row.evidenceTargetName || '',

      evidenceAchievementFile: null,
      evidenceAchievementName: row.evidenceAchievementName || '',

      evidenceRealisasi12File: null,
      evidenceRealisasi12Name: row.evidenceAchievementName || '',

      evidenceRealisasi34File: null,
      evidenceRealisasi34Name: row.evidenceAchievementName || '',

      targetTw1: row.targetTw1 || '',
      targetTw2: row.targetTw2 || '',
      targetTw3: row.targetTw3 || '',
      targetTw4: row.targetTw4 || '',

      achievementTw1: row.achievementTw1 || '',
      achievementTw2: row.achievementTw2 || '',
      achievementTw3: row.achievementTw3 || '',
      achievementTw4: row.achievementTw4 || '',

      realisasiTw1: row.achievementTw1 || '',
      realisasiTw2: row.achievementTw2 || '',
      realisasiTw3: row.achievementTw3 || '',
      realisasiTw4: row.achievementTw4 || ''
    };

    this.modalEditTkp.show();
  }
  public onEditEvidenceTargetChange(event: any): void {
    var file = null;
    if (event && event.target && event.target.files && event.target.files.length) {
      file = event.target.files[0];
    }
    if (!file) return;

    this.editTkp.evidenceTargetFile = file;
    this.editTkp.evidenceTargetName = file.name;
  }

  public onEditEvidenceRealisasi12Change(event: any): void {
    var file = null;
    if (event && event.target && event.target.files && event.target.files.length) {
      file = event.target.files[0];
    }
    if (!file) return;

    this.editTkp.evidenceRealisasi12File = file;
    this.editTkp.evidenceRealisasi12Name = file.name;

    this.editTkp.evidenceAchievementFile = file;
    this.editTkp.evidenceAchievementName = file.name;
  }

  public onEditEvidenceRealisasi34Change(event: any): void {
    var file = null;
    if (event && event.target && event.target.files && event.target.files.length) {
      file = event.target.files[0];
    }
    if (!file) return;

    this.editTkp.evidenceRealisasi34File = file;
    this.editTkp.evidenceRealisasi34Name = file.name;

    this.editTkp.evidenceAchievementFile = file;
    this.editTkp.evidenceAchievementName = file.name;
  }

  public triggerEditEvidenceRealisasi(slot: 'TW12' | 'TW34'): void {
    var id = (slot === 'TW12') ? 'fileEditEvidenceReal12' : 'fileEditEvidenceReal34';
    var el = document.getElementById(id) as HTMLInputElement;
    if (el) el.click();
  }

  public downloadOrPreviewEvidence(slot: 'TW12' | 'TW34'): void {
    console.log('downloadOrPreviewEvidence', slot);
  }

  public downloadEvidenceEdit(slot: 'TW12' | 'TW34'): void {
    console.log('downloadEvidenceEdit', slot);
  }

  public closeEditTkp(): void {
    if (this.modalEditTkp) this.modalEditTkp.hide();
    this.editingRowId = '';
  }

  public saveEditTkp(): void {

    if (this.isEvidenceAchievementRequired()) {
      if (
        !this.editTkp.evidenceAchievementFile &&
        !this.editTkp.evidenceAchievementName &&
        !this.editTkp.evidenceRealisasi12File &&
        !this.editTkp.evidenceRealisasi12Name &&
        !this.editTkp.evidenceRealisasi34File &&
        !this.editTkp.evidenceRealisasi34Name
      ) {
        this.toast('Gagal', 'Evidence Achievement wajib diupload.', 'error');
        return;
      }
    }

    if (!this.editingRowId) {
      this.toast('Gagal', 'Data edit tidak ditemukan.', 'error');
      return;
    }

    if (!this.editTkp.deskripsi || String(this.editTkp.deskripsi).trim() === '') {
      this.toast('Gagal', 'Deskripsi wajib diisi.', 'error');
      return;
    }

    this.loadingModalEditTkp = true;

    var idx = -1;
    for (var i = 0; i < (this.dataTable || []).length; i++) {
      if (String(this.dataTable[i].id) === String(this.editingRowId)) {
        idx = i;
        break;
      }
    }

    if (idx < 0) {
      this.loadingModalEditTkp = false;
      this.toast('Gagal', 'Data tidak ditemukan.', 'error');
      return;
    }

    var updated = { ...this.dataTable[idx] };

    updated.deskripsi = this.editTkp.deskripsi;
    updated.satuan = this.editTkp.satuan;
    updated.ukuran = this.editTkp.ukuran;
    updated.referensi = this.editTkp.referensi;
    updated.final_score = this.editTkp.final_score;

    updated.targetTw1 = this.editTkp.targetTw1;
    updated.targetTw2 = this.editTkp.targetTw2;
    updated.targetTw3 = this.editTkp.targetTw3;
    updated.targetTw4 = this.editTkp.targetTw4;

    updated.achievementTw1 = this.editTkp.realisasiTw1 || this.editTkp.achievementTw1;
    updated.achievementTw2 = this.editTkp.realisasiTw2 || this.editTkp.achievementTw2;
    updated.achievementTw3 = this.editTkp.realisasiTw3 || this.editTkp.achievementTw3;
    updated.achievementTw4 = this.editTkp.realisasiTw4 || this.editTkp.achievementTw4;

    if (this.editTkp.evidenceReferenceFile) {
      updated.evidenceReferenceFile = this.editTkp.evidenceReferenceFile;
      updated.evidenceReferenceName = this.editTkp.evidenceReferenceName;
    }

    if (this.editTkp.evidenceTargetFile) {
      updated.evidenceTargetFile = this.editTkp.evidenceTargetFile;
      updated.evidenceTargetName = this.editTkp.evidenceTargetName;
    }

    if (this.editTkp.evidenceAchievementFile) {
      updated.evidenceAchievementFile = this.editTkp.evidenceAchievementFile;
      updated.evidenceAchievementName = this.editTkp.evidenceAchievementName;
    } else if (this.editTkp.evidenceRealisasi12File) {
      updated.evidenceAchievementFile = this.editTkp.evidenceRealisasi12File;
      updated.evidenceAchievementName = this.editTkp.evidenceRealisasi12Name;
    } else if (this.editTkp.evidenceRealisasi34File) {
      updated.evidenceAchievementFile = this.editTkp.evidenceRealisasi34File;
      updated.evidenceAchievementName = this.editTkp.evidenceRealisasi34Name;
    }

    this.dataTable[idx] = updated;
    this.rawData = this.dataTable.slice();

    this.rerenderMainTable();

    this.loadingModalEditTkp = false;
    this.toast('Sukses', 'Perubahan berhasil disimpan.', 'success');
    this.closeEditTkp();
  }

  public openDelete(row: any, event?: any): void {
    if (event) { event.preventDefault(); event.stopPropagation(); }

    if (this.isHapusDtkpDisabled()) {
      this.toast('Info', 'Belum bisa menghapus pada kondisi ini.', 'info');
      return;
    }

    this.deletingRow = row;
    this.showDeleteSuccess = false;
    this.showDeleteConfirm = true;
  }

  public closeDeleteConfirm(): void {
    if (this.loadingDelete) return;
    this.showDeleteConfirm = false;
    this.deletingRow = null;
  }

  public closeDeleteSuccess(): void {
    this.showDeleteSuccess = false;
    this.deletingRow = null;
  }

  public onBackdropClick(): void {
    if (this.showDeleteConfirm) this.closeDeleteConfirm();
    else if (this.showDeleteSuccess) this.closeDeleteSuccess();
  }

  public confirmDelete(): void {
    var self = this;

    if (!this.deletingRow || !this.deletingRow.id) {
      return;
    }

    this.loadingDelete = true;

    var id = String(this.deletingRow.id);

    this.tupTpaService.deleteTkpDetail(id).subscribe(
      function (res: any) {
        if (res && res.success) {
          self.showDeleteConfirm = false;
          self.deletingRow = null;

          if (self.selectedTkpId) {
            self.loadDetailTkp(self.selectedTkpId);
          }

          self.showDeleteSuccess = true;
        } else {
          console.error('[DeleteTKPDetail] gagal', res);
          self.toast('Gagal', 'Hapus data gagal.', 'error');
        }

        self.loadingDelete = false;
      },
      function (err: any) {
        console.error('[DeleteTKPDetail] error', err);

        self.loadingDelete = false;
        self.toast('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
      }
    );
  }

  private detectRole(): RoleTpa {
    const roleContext = (this.route.snapshot && this.route.snapshot.data)
      ? (this.route.snapshot.data['roleContext'] || '')
      : '';

    console.log('[TPA][detectRole] roleContext =', roleContext);
    console.log('[TPA][detectRole] url =', this.router.url);

    // 1. Prioritas dari route data
    if (roleContext === 'SDM_PENILAI_1') return 'SDM_PENILAI_1';
    if (roleContext === 'SDM_PENILAI_2') return 'SDM_PENILAI_2';
    if (roleContext === 'PENILAI_1') return 'PENILAI_1';
    if (roleContext === 'PENILAI_2') return 'PENILAI_2';
    if (roleContext === 'PEGAWAI') return 'PEGAWAI';

    // legacy
    if (roleContext === 'PENILAI1_ATASAN') return 'PENILAI_1';
    if (roleContext === 'PENILAI2_ATASAN') return 'PENILAI_2';

    // 2. Fallback dari URL
    const url = (this.router.url || '').toLowerCase();

    // PENTING: cek sdm dulu, baru penilai
    if (url.includes('/sdm-penilai-satu')) return 'SDM_PENILAI_1';
    if (url.includes('/sdm-penilai-dua')) return 'SDM_PENILAI_2';
    if (url.includes('/penilai-satu')) return 'PENILAI_1';
    if (url.includes('/penilai-dua')) return 'PENILAI_2';

    // default
    return 'PENILAI_1';
  }

  private updateKondisiByTargetCount(): void {
    const count = (this.dataTable || []).length;

    if (this.currentKondisi === 'KONDISI_1') return;
    if (this.currentKondisi !== 'KONDISI_2' && this.currentKondisi !== 'KONDISI_3') return;

    if (count >= 8 && count <= 20) {
      this.currentKondisi = 'KONDISI_3';
    } else {
      this.currentKondisi = 'KONDISI_2';
    }

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
  }

  ngOnInit(): void {
    (window as any).tpaComp = this;
    
    this.loadTpaPeriods();

    this.pegawaiId = this.route.snapshot.paramMap.get('pegawaiId') || '';
    this.penilaianId = this.route.snapshot.paramMap.get('penilaianId') || '';

    //untuk role 
    this.roleTpa = this.detectRole();
    this.resolveAccessContext();
    this.isPenilaiAtasan = (this.roleTpa === 'PENILAI_1' || this.roleTpa === 'PENILAI_2');

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

    this.initDataTableMain();

    this.roleContext = (this.route.snapshot && this.route.snapshot.data)
      ? (this.route.snapshot.data['roleContext'] || '')
      : '';

    if (this.roleContext === 'PEGAWAI') {
      const profile = this.oauthService.retrieveProfile();
      this.pegawai = {
        nama: profile && profile.fullname ? profile.fullname : 'Loading...',
        nip: profile && profile.numberid ? profile.numberid : '-',
        lokasi: '-',
        periode: '-',
        deskripsi: '-'
      };

      // Panggil API getEmployeeDetail untuk mengisi data pegawai
      this.loadEmployeeDetail();

      this.optionsSatuan = [
        { value: '%', label: '%' }
      ];

      this.optionsUkuran = [
        { value: '>=', label: '>=' }
      ];

      this.optionsReferensi = [
        { value: 'Sarmut', label: 'Sarmut' },
        { value: 'SLA', label: 'SLA' },
        { value: 'prosedur', label: 'prosedur' }
      ];
    }

    this.loadInitialTableData();

    this.roleTpa = this.detectRole();
    this.isPenilaiAtasan = (this.roleTpa === 'PENILAI_1' || this.roleTpa === 'PENILAI_2');

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();

    (window as any).tpaComp = this;
    console.log('[TPA] mounted', this);
    console.log('roleContext=', this.roleContext, 'roleTpa=', this.roleTpa, 'isPenilaiAtasan=', this.isPenilaiAtasan);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
      this.bindExpandButtonDelegation();
    }, 0);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();

    if (this.expandClickHandler) {
      document.removeEventListener('click', this.expandClickHandler, true);
      this.expandClickHandler = null;
    }
  }

  private syncObjektifByKondisi(): void {
    if (this.currentKondisi === 'KONDISI_1') {
      this.isObjektifEdit = true;
      this.isSaveCancelVisible = true;
      this.isEditDisabled = true;
      return;
    }

    this.isObjektifEdit = false;
    this.isSaveCancelVisible = false;
    this.isEditDisabled = this.isEditObjektifDisabled();
  }

  private mountDtFilterToTopbar(): void {
    const host = this.dtFilterHostRef ? (this.dtFilterHostRef.nativeElement as HTMLElement) : null;
    const filterEl = document.querySelector('#dtMainTable_wrapper .dataTables_filter') as HTMLElement;

    if (!host) return;
    if (!filterEl) return;
    if (host.contains(filterEl)) return;

    host.appendChild(filterEl);
  }

  private initDataTableMain(): void {
    this.dtOptions[1] = ({
      paging: false,
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      searching: false,
      ordering: false,
      lengthChange: false,
      info: false,
      dom: 'rt',
      language: {
        emptyTable: 'Data tidak ditemukan',
        zeroRecords: 'Data tidak ditemukan',
        info: 'Rows per page: _START_ - _END_',
        infoEmpty: 'Rows per page: 0 - 0',
        infoFiltered: '',
        paginate: {
          first: '&laquo;',
          previous: '&lsaquo;',
          next: '&rsaquo;',
          last: '&raquo;'
        }
      },
      initComplete: () => {
        setTimeout(() => this.mountDtFilterToTopbar(), 0);
      },
      drawCallback: () => {
        setTimeout(() => this.mountDtFilterToTopbar(), 0);
      }
    } as any);
  }

  private rerenderMainTable(): void {
    this.rebuildMainPaging();
    this.removeManualChildRows();

    if (!this.dtElement) {
      this.dtTrigger.next();
      setTimeout(() => this.mountDtFilterToTopbar(), 100);
      return;
    }

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      try {
        dtInstance.rows().every(function () {
          if (this.child && this.child.isShown && this.child.isShown()) {
            this.child.hide();
          }
        });
      } catch (e) {
        console.error('hide child row error', e);
      }

      try {
        dtInstance.destroy();
      } catch (e) {
        console.error('destroy datatable error', e);
      }

      setTimeout(() => {
        this.removeManualChildRows();
        this.dtTrigger.next();
        setTimeout(() => this.mountDtFilterToTopbar(), 100);
      }, 0);
    });
  }

  public goToMainPage(page: number): void {
    if (page < 1) page = 1;
    if (page > this.mainTotalPages) page = this.mainTotalPages;

    this.mainPage = page;
    this.rebuildMainPaging();
    this.removeManualChildRows();

    for (var i = 0; i < (this.dataTable || []).length; i++) {
      this.dataTable[i].expanded = false;
    }
  }

  private rebuildMainPaging(): void {
    var total = (this.dataTable || []).length;

    this.mainTotalPages = Math.ceil(total / this.mainPageSize) || 1;

    if (this.mainPage > this.mainTotalPages) this.mainPage = this.mainTotalPages;
    if (this.mainPage < 1) this.mainPage = 1;

    var startIndex = (this.mainPage - 1) * this.mainPageSize;
    var endIndex = startIndex + this.mainPageSize;

    this.pagedMainTable = (this.dataTable || []).slice(startIndex, endIndex);

    this.mainPages = [];
    for (var i = 1; i <= this.mainTotalPages; i++) {
      this.mainPages.push(i);
    }

    this.mainPageInfo = {
      start: total === 0 ? 0 : startIndex + 1,
      end: Math.min(endIndex, total),
      total: total
    };
  }

  private mapModalRowToMainRow(modalRow: any): any {
    return {
      id: this.generateUuid(),
      deskripsi: modalRow.deskripsi,
      satuan: modalRow.satuan,
      ukuran: modalRow.ukuran,
      referensi: modalRow.referensi,
      targetTw1: modalRow.targetTw1,
      targetTw2: modalRow.targetTw2,
      targetTw3: modalRow.targetTw3,
      targetTw4: modalRow.targetTw4,
      realisasiTw1: modalRow.realisasiTw1,
      realisasiTw2: modalRow.realisasiTw2,
      realisasiTw3: modalRow.realisasiTw3,
      realisasiTw4: modalRow.realisasiTw4,
      evidenceRealisasi12File: modalRow.evidenceRealisasi12File,
      evidenceRealisasi12Name: modalRow.evidenceRealisasi12Name,
      evidenceRealisasi34File: modalRow.evidenceRealisasi34File,
      evidenceRealisasi34Name: modalRow.evidenceRealisasi34Name,
      expanded: false
    };
  }

  public toggleExpand(row: any, event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!row) return;

    for (var i = 0; i < this.dataTable.length; i++) {
      if (this.dataTable[i] !== row) {
        this.dataTable[i].expanded = false;
      }
    }

    row.expanded = !row.expanded;
  }

  private safeText(v: any): string {
    return (v === null || v === undefined) ? '' : String(v);
  }

  private buildExpandHtml(row: any): string {
    var targetTw1 = this.safeText(row ? row.targetTw1 : '');
    var targetTw2 = this.safeText(row ? row.targetTw2 : '');
    var targetTw3 = this.safeText(row ? row.targetTw3 : '');
    var targetTw4 = this.safeText(row ? row.targetTw4 : '');

    var achievementTw1 = this.safeText(row ? row.achievementTw1 : '');
    var achievementTw2 = this.safeText(row ? row.achievementTw2 : '');
    var achievementTw3 = this.safeText(row ? row.achievementTw3 : '');
    var achievementTw4 = this.safeText(row ? row.achievementTw4 : '');

    var evidenceTargetName = this.safeText(row ? row.evidenceTargetName : '');
    var evidenceAchievementName = this.safeText(row ? row.evidenceAchievementName : '');

    return [
      '<div class="tkp-panel-outer">',
        '<div class="tkp-panel">',
          '<div class="tkp-panel__grid">',
            '<div></div>',
            '<div class="tkp-panel__head text-center">TW1</div>',
            '<div class="tkp-panel__head text-center">TW2</div>',
            '<div class="tkp-panel__head text-center">TW3</div>',
            '<div class="tkp-panel__head text-center">TW4</div>',

            '<div class="tkp-panel__label">Target</div>',
            '<div class="text-center">' + targetTw1 + '</div>',
            '<div class="text-center">' + targetTw2 + '</div>',
            '<div class="text-center">' + targetTw3 + '</div>',
            '<div class="text-center">' + targetTw4 + '</div>',

            '<div class="tkp-panel__label">Achievement</div>',
            '<div class="text-center">' + achievementTw1 + '</div>',
            '<div class="text-center">' + achievementTw2 + '</div>',
            '<div class="text-center">' + achievementTw3 + '</div>',
            '<div class="text-center">' + achievementTw4 + '</div>',

            '<div class="tkp-panel__label">Evidence Target</div>',
            '<div class="tkp-panel__evidence tkp-panel__evidence--span2">',
              '<button type="button" class="btn btn-outline-primary btn-sm w-100" disabled>',
                '<i class="ph-duotone ph-download-simple mr-1"></i> ',
                (evidenceTargetName ? evidenceTargetName : 'Tidak ada file'),
              '</button>',
            '</div>',
            '<div class="tkp-panel__evidence tkp-panel__evidence--span2">',
              '<button type="button" class="btn btn-outline-primary btn-sm w-100" disabled>',
                '<i class="ph-duotone ph-download-simple mr-1"></i> ',
                (evidenceTargetName ? evidenceTargetName : 'Tidak ada file'),
              '</button>',
            '</div>',

            '<div class="tkp-panel__label">Evidence Achievement</div>',
            '<div class="tkp-panel__evidence tkp-panel__evidence--span2">',
              '<button type="button" class="btn btn-outline-primary btn-sm w-100" disabled>',
                '<i class="ph-duotone ph-download-simple mr-1"></i> ',
                (evidenceAchievementName ? evidenceAchievementName : 'Tidak ada file'),
              '</button>',
            '</div>',
            '<div class="tkp-panel__evidence tkp-panel__evidence--span2">',
              '<button type="button" class="btn btn-outline-primary btn-sm w-100" disabled>',
                '<i class="ph-duotone ph-download-simple mr-1"></i> ',
                (evidenceAchievementName ? evidenceAchievementName : 'Tidak ada file'),
              '</button>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  private getDtMain(): any {
    if (!this.dtElement) {
      return null;
    }
    return this.dtElement;
  }

  public toggleExpandDT(row: any, event?: any): void {
    var self = this;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!row) return;

    console.log('[1] CLICK MASUK', row);

    var trEl: any = null;

    if (event && event.currentTarget) {
      trEl = (event.currentTarget as HTMLElement).closest('tr');
    }

    console.log('[2] trEl', trEl);

    if (!trEl) {
      console.error('[EXPAND] tr tidak ditemukan');
      return;
    }

    if (row.expanded) {
      this.removeManualChildRows();
      row.expanded = false;
      return;
    }

    this.removeManualChildRows();

    for (var i = 0; i < (this.dataTable || []).length; i++) {
      this.dataTable[i].expanded = false;
    }

    var html = this.buildExpandHtml(row);

    var childTr = document.createElement('tr');
    childTr.className = 'tpa-child-row-manual';

    var childTd = document.createElement('td');
    childTd.colSpan = trEl.children ? trEl.children.length : 8;
    childTd.innerHTML = html;

    childTr.appendChild(childTd);

    if (trEl.parentNode) {
      trEl.parentNode.insertBefore(childTr, trEl.nextSibling);
    }

    row.expanded = true;

    console.log('[3] manual child row inserted');
  }

  private removeManualChildRows(): void {
    var rows = document.querySelectorAll('#dtMainTable tbody tr.tpa-child-row-manual');

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row && row.parentNode) {
        row.parentNode.removeChild(row);
      }
    }
  }

  public testExpandClick(row: any, event?: any): void {
    console.log('[TEST EXPAND CLICK MASUK]', row);
    alert('expand click masuk');
  }

  private bindExpandButtonDelegation(): void {
    var self = this;

    if (this.expandClickHandler) return;

    this.expandClickHandler = function (event: any) {
      var target = event && event.target ? event.target as HTMLElement : null;
      var btn: any = null;
      var rowId = '';
      var row = null;

      if (!target) return;

      btn = target.closest ? target.closest('.js-tkp-expand') : null;
      if (!btn) return;

      rowId = btn.getAttribute('data-rowid') || '';

      for (var i = 0; i < (self.dataTable || []).length; i++) {
        if (String(self.dataTable[i].id) === String(rowId)) {
          row = self.dataTable[i];
          break;
        }
      }

      if (!row) {
        console.error('[bindExpandButtonDelegation] row tidak ditemukan', rowId);
        return;
      }

      self.toggleExpandDT(row, event);
    };

    document.addEventListener('click', this.expandClickHandler, true);
  }

  private getAllButtonsDisabled(): FooterActions {
    const a = { show: true, disabled: true };
    return {
      approveTarget: { ...a },
      reviseTarget: { ...a },
      resetTarget: { ...a },
      approveRealisasi: { ...a },
      reviseRealisasi: { ...a },
      resetRealisasi: { ...a }
    };
  }

  private applyFooterButtonMatrix(): void {
    this.actions = this.getAllButtonsDisabled();

    const kondisiObj = FOOTER_BUTTON_MATRIX[this.currentKondisi];
    if (!kondisiObj) return;

    const config = kondisiObj[this.roleTpa];
    if (!config) return;

    (Object.keys(this.actions) as Array<keyof FooterActions>).forEach((key) => {
      this.actions[key].show = true;
      this.actions[key].disabled = config[key] !== 'aktif';
    });
  }

  private getPageUiConfig(): PageUiConfig {
    return PAGE_UI_MATRIX[this.currentKondisi];
  }

  private applyPageUiState(): void {
    const ui = this.getPageUiConfig();
    this.isTambahTkpDisabled = !ui.tambahTkp;
    this.isEditDisabled = !ui.editObjektif;
  }

  private loadEmployeeDetail(): void {
    const profile = this.oauthService.retrieveProfile();
    const employeeId = profile && profile.numberid ? String(profile.numberid) : '';
    if (!employeeId) return;

    this.isLoadingEmployee = true;

    this.tupTpaService.getEmployeeDetail(employeeId).subscribe({
      next: (res: any) => {
        this.employeeDetail = res && res.data ? res.data : null;

        if (this.employeeDetail) {
          this.pegawai = {
            nama: this.employeeDetail.employee_name || '-',
            nip: this.employeeDetail.employee_id || '-',
            lokasi: this.employeeDetail.directorate || '-',
            periode: this.employeeDetail.content_period_name || '-',
            deskripsi: this.employeeDetail.organization_structure_name || '-'
          };

          sessionStorage.setItem('tpa_pegawai_header', JSON.stringify(this.pegawai));
          
          // Trigger loading active target data with the correct NIP
          this.loadActiveTkp();
        }

        this.isLoadingEmployee = false;
      },
      error: (err: any) => {
        console.error('[GetEmployeeDetail] error', err);
        this.isLoadingEmployee = false;
        this.toast('Gagal', 'Gagal mengambil detail pegawai.', 'error');
      }
    });
  }

  private loadInitialTableData(): void {
    this.rawData = [];
    this.dataTable = [];

    this.updateKondisiByTargetCount();
    this.loadingPage = false;
    this.loadActiveTkp();
  }

  approveTargetDtkp(): void {
    if (this.actions.approveTarget.disabled) return;

    this.toast('Sukses', 'Simulasi: Target DTKP disetujui.', 'success');

    if (this.roleTpa === 'PENILAI_1' || this.roleTpa === 'SDM_PENILAI_1') {
      this.currentKondisi = 'KONDISI_7';
    } else {
      this.currentKondisi = 'KONDISI_9';
    }

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();
  }

  reviseTargetDtkp(): void {
    if (this.actions.reviseTarget.disabled) return;

    this.toast('Info', 'Simulasi: Revisi DTKP.', 'info');

    if (this.roleTpa === 'PENILAI_1' || this.roleTpa === 'SDM_PENILAI_1') {
      this.currentKondisi = 'KONDISI_6';
    } else {
      this.currentKondisi = 'KONDISI_8';
    }

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();
  }

  resetTargetDtkp(): void {
    if (this.actions.resetTarget.disabled) return;

    this.toast('Info', 'Simulasi: Reset Status Target.', 'info');

    if (this.roleTpa === 'SDM_PENILAI_1') {
      this.currentKondisi = 'KONDISI_20';
    } else {
      this.currentKondisi = 'KONDISI_19';
    }

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();
  }

  approveRealisasiDtkp(): void {
    if (this.actions.approveRealisasi.disabled) return;

    this.toast('Sukses', 'Simulasi: Realisasi DTKP disetujui.', 'success');

    if (this.roleTpa === 'PENILAI_1' || this.roleTpa === 'SDM_PENILAI_1') {
      this.currentKondisi = 'KONDISI_14';
    } else {
      this.currentKondisi = 'KONDISI_16';
    }

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();
  }

  reviseRealisasiDtkp(): void {
    if (this.actions.reviseRealisasi.disabled) return;

    this.toast('Info', 'Simulasi: Revisi Realisasi.', 'info');

    if (this.roleTpa === 'PENILAI_1' || this.roleTpa === 'SDM_PENILAI_1') {
      this.currentKondisi = 'KONDISI_13';
    } else {
      this.currentKondisi = 'KONDISI_15';
    }

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();
  }

  resetRealisasiDtkp(): void {
    if (this.actions.resetRealisasi.disabled) return;

    this.toast('Info', 'Simulasi: Reset Status Realisasi.', 'info');

    if (this.roleTpa === 'SDM_PENILAI_1') {
      this.currentKondisi = 'KONDISI_18';
    } else {
      this.currentKondisi = 'KONDISI_17';
    }

    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();
  }

  public onEditObjektif(): void {
    if (this.isEditObjektifDisabled()) return;

    this.isObjektifEdit = true;
    this.isSaveCancelVisible = true;
  }

  public onCancelObjektif(): void {
    if (this.currentKondisi === 'KONDISI_1') {
      this.objektifText = '';
      return;
    }

    this.isObjektifEdit = false;
    this.isSaveCancelVisible = false;
  }

  public onSaveObjektif(): void {
    const words = (this.objektifText || '')
      .trim()
      .split(/\s+/)
      .filter(w => !!w);

    if (words.length < 5) {
      this.toast('Gagal', 'Objektif minimal 5 kata.', 'error');
      return;
    }

    const profile = this.oauthService.retrieveProfile();
    const employeeId = profile && profile.numberid ? String(profile.numberid) : '';

    const tpaEmployeeDataPeriodId = this.employeeDetail
      ? (this.employeeDetail.tpa_employee_data_period_id ||
         this.employeeDetail.id ||
         this.employeeDetail.tpa_employee_period_id ||
         this.employeeDetail.employee_data_period_id)
      : null;

    const createdByRaw = profile
      ? (profile.id || profile.numberid || profile.user_id || profile.employee_id || 123)
      : 123;
    const createdBy = typeof createdByRaw === 'number'
      ? createdByRaw
      : (!isNaN(Number(createdByRaw)) ? Number(createdByRaw) : createdByRaw);

    const body = {
      tpa_employee_data_period_id: tpaEmployeeDataPeriodId ? Number(tpaEmployeeDataPeriodId) : null,
      employee_id: employeeId,
      objective: this.objektifText || '',
      tpa_content_period_id: this.selectedTpaPeriodId && this.selectedTpaPeriodId !== 'default'
        ? Number(this.selectedTpaPeriodId)
        : 1,
      created_by: createdBy
    };

    var self = this;
    this.loadingPage = true;

    this.tupTpaService.insertTkp(body as any).subscribe(
      (res: any) => {
        self.loadingPage = false;
        if (res && res.success) {
          self.toast('Sukses', 'Objektif berhasil disimpan.', 'success');
          self.isObjektifEdit = false;
          self.isSaveCancelVisible = false;

          if (self.roleContext === 'PEGAWAI') {
            self.currentKondisi = 'KONDISI_2';
          } else {
            self.currentKondisi = 'KONDISI_2';
          }
          self.applyFooterButtonMatrix();
          self.applyPageUiState();
          self.syncObjektifByKondisi();
          self.updateKondisiByTargetCount();

          self.loadActiveTkp();
        } else {
          self.toast('Gagal', (res && res.message) ? res.message : 'Gagal menyimpan objektif.', 'error');
        }
      },
      (err: any) => {
        self.loadingPage = false;
        console.error('[insertTkp] error', err);
        self.toast('Gagal', 'Terjadi kesalahan saat menyimpan objektif.', 'error');
      }
    );
  }

  public isRoleAtasan(): boolean {
    return this.roleTpa === 'PENILAI_1' || this.roleTpa === 'PENILAI_2';
  }

  public canShowEditObjektifButton(): boolean {
    return true;
  }

  public isEditObjektifDisabled(): boolean {
    var ui = this.getPageUiConfig();

    if (!ui || !ui.editObjektif) {
      return true;
    }

    if (this.roleContext === 'DOSEN' && this.accessContext === 'OWN_DATA') {
      return true;
    }

    return false;
  }

  get isObjektifValid(): boolean {
    return !!this.objektifText && this.objektifText.trim().length > 0;
  }

  simpanDraftDtkp(): void {
    if ((this.dataTable || []).length < 8) return;
    this.toast('Sukses', 'Draft DTKP berhasil disimpan.', 'success');
  }

  ajukanDtkp(): void {
    if ((this.dataTable || []).length < 8) return;
    this.toast('Sukses', 'DTKP berhasil diajukan.', 'success');
  }

  public canShowTambahTkpButton(): boolean {
    var ui = this.getPageUiConfig();
    return !!(ui && ui.tambahTkp);
  }

  public isTambahTkpButtonDisabled(): boolean {
    var ui = this.getPageUiConfig();

    if (!ui || !ui.tambahTkp) {
      return true;
    }

    // DOSEN tidak boleh SELF
    if (this.roleContext === 'DOSEN' && this.accessContext === 'OWN_DATA') {
      return true;
    }

    // PEGAWAI (self) boleh tambah
    if (this.roleTpa === 'PEGAWAI') {
      return false;
    }

    // PENILAI juga boleh (kalau kondisi allow)
    if (
      this.roleTpa === 'PENILAI_1' ||
      this.roleTpa === 'PENILAI_2' ||
      this.roleTpa === 'SDM_PENILAI_1' ||
      this.roleTpa === 'SDM_PENILAI_2'
    ) {
      return false;
    }

    return true;
  }

  public canShowEditDtkpButton(): boolean {
    var ui = this.getPageUiConfig();
    return !!(ui && ui.editDtkp);
  }

  public isEditDtkpDisabled(): boolean {
    var ui = this.getPageUiConfig();

    if (!ui || !ui.editDtkp) {
      return true;
    }

    if (this.roleContext === 'DOSEN' && this.accessContext === 'OWN_DATA') {
      return true;
    }

    if (this.roleTpa === 'PEGAWAI') {
      return false;
    }

    if (
      this.roleTpa === 'PENILAI_1' ||
      this.roleTpa === 'PENILAI_2' ||
      this.roleTpa === 'SDM_PENILAI_1' ||
      this.roleTpa === 'SDM_PENILAI_2'
    ) {
      return false;
    }

    return true;
  }

  public canShowHapusDtkpButton(): boolean {
    var ui = this.getPageUiConfig();
    return !!(ui && ui.hapusDtkp);
  }

  public isHapusDtkpDisabled(): boolean {
    var ui = this.getPageUiConfig();

    if (!ui || !ui.hapusDtkp) {
      return true;
    }

    if (this.roleTpa === 'PEGAWAI') {
      return false;
    }

    if (this.roleTpa === 'PENILAI_1' || this.roleTpa === 'PENILAI_2') {
      return false;
    }

    if (this.roleTpa === 'SDM_PENILAI_1' || this.roleTpa === 'SDM_PENILAI_2') {
      return false;
    }

    return true;
  }

  public canViewEvidenceButton(): boolean {
    var ui = this.getPageUiConfig();
    return !!(ui && ui.viewEvidence);
  }

  public isViewEvidenceDisabled(): boolean {
    var ui = this.getPageUiConfig();

    if (!ui || !ui.viewEvidence) {
      return true;
    }

    return false;
  }

  //helper untuk kondisi dimana target sudah disetujui oleh 2 assessor, maka referensi dan target tidak bisa diubah, sedangkan achievement harus diisi dan bisa diubah
  public isTargetApprovedByTwoAssessor(): boolean {
    if (
      this.currentKondisi === 'KONDISI_9' ||
      this.currentKondisi === 'KONDISI_10' ||
      this.currentKondisi === 'KONDISI_11' ||
      this.currentKondisi === 'KONDISI_12' ||
      this.currentKondisi === 'KONDISI_13' ||
      this.currentKondisi === 'KONDISI_14' ||
      this.currentKondisi === 'KONDISI_15' ||
      this.currentKondisi === 'KONDISI_16' ||
      this.currentKondisi === 'KONDISI_17' ||
      this.currentKondisi === 'KONDISI_18'
    ) {
      return true;
    }

    return false;
  }

  public isEvidenceReferenceDisabled(): boolean {
    return this.isTargetApprovedByTwoAssessor();
  }

  public isEvidenceTargetDisabled(): boolean {
    return this.isTargetApprovedByTwoAssessor();
  }

  public isEvidenceAchievementDisabled(): boolean {
    return !this.isTargetApprovedByTwoAssessor();
  }

  public isEvidenceAchievementRequired(): boolean {
    return this.isTargetApprovedByTwoAssessor();
  }
 

  public downloadSKI(): void {
    this.toast('Info', 'Simulasi: Download SKI.', 'info');
  }

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

  private debugKondisi(label: string): void {
    console.log('[TPA]', label, {
      roleTpa: this.roleTpa,
      kondisi: this.currentKondisi,
      jumlahTarget: (this.dataTable || []).length,
      actions: this.actions,
      pageUi: this.getPageUiConfig()
    });
  }

  public setKondisiDev(k: KondisiKey): void {
    this.currentKondisi = k;
    this.applyFooterButtonMatrix();
    this.applyPageUiState();
    this.syncObjektifByKondisi();

    console.log('[TPA] setKondisiDev ->', k, {
      roleTpa: this.roleTpa,
      actions: this.actions,
      pageUi: this.getPageUiConfig()
    });

    this.toast('Info', 'Simulasi: ' + k, 'info');
  }
}