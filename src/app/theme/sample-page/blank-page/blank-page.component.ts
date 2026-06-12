import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BroadcasterService } from 'src/app/_services/broadcaster.service';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/_services/app.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-blank-page',
  templateUrl: './blank-page.component.html',
  styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
  public positionOption: Array<any>; // Create property for option list
  public officeOption: Array<any>; // Create property for option list

  public formUsers: FormGroup; // Create FormGroup instance

  // notification property
  public toastData: any;
  public office: any;

  constructor(
    public broadcasterService: BroadcasterService,
    public translateService: TranslateService,
    public appService: AppService,
    private fb: FormBuilder
  ) {
    translateService.setDefaultLang(localStorage.getItem('lang'));
    broadcasterService.changeLangBroadcast$.subscribe(res => {
      translateService.setDefaultLang(res.lang);
    });
    this.officeOption = [
      {value: '0', label: 'Direktorat Pusat Teknologi Informasi'},
      {value: '1', label: 'Direktorat Admisi'},
      {value: '2', label: 'Direktorat Akademik'},
      {value: '3', label: 'Direktorat Kemahasiswaan'},
      {value: '4', label: 'Direktorat Sumber Daya Manusia'},
    ];
    this.positionOption = [
      {value: '1', label: 'Accountant'},
      {value: '2', label: 'Junior Technical Author'},
      {value: '3', label: 'Senior Javascript Developer'},
      {value: '4', label: 'Accountant'},
      {value: '5', label: 'Software Engineer'},
      {value: '6', label: 'Office Manager'},
      {value: '7', label: 'Systems Administrator'},
      {value: '8', label: 'Software Engineer'},
      {value: '9', label: 'Financial Controller'},
      {value: '10', label: 'Support Engineer'},
      {value: '11', label: 'Data Coordinator'},
      {value: '12', label: 'Customer Support'},
    ];
    this.formUsers = this.fb.group ({
      username: new FormControl('adityaz', Validators.required),
      password: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      age: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(99)
      ])
    });
  }

  get fu() { return this.formUsers.controls; }

  test() {
    console.log(this.fu);
  }

  ngOnInit() {}

  resetForm() {
    this.formUsers.reset();
  }

}
