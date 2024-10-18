import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';
import { ComboboxService } from 'src/app/services/combobox.service';
import { swalError, swalInfo, swalSuccess } from 'src/app/utils/alert';
import { filterAutocomplete } from 'src/app/utils/autocomplete';
import { NewItemComponent } from '../business-obj-definition/new-item/new-item.component';

@Component({
  selector: 'app-business-object-structure',
  templateUrl: './business-object-structure.component.html',
  styleUrls: ['./business-object-structure.component.scss']
})
export class BusinessObjectStructureComponent {

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private businessService: BusinessService,
    private comboboxService: ComboboxService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.getTable(1);
    this.getComboboxData();

    this.generateForm();
    this.keyUpBODefinition();

  }

  definitionFormGroup!: FormGroup;

  generateForm() {
    this.definitionFormGroup = this.fb.group({
      id: [this.UpdateData?.id || 0, [Validators.required]],
      project_name: [this.UpdateData?.project_name || '', [Validators.required]],
      business_object_id: [this.UpdateData?.business_object_id || '', [Validators.required]],
      business_attribute_id: [this.UpdateData?.business_attribute_id || '', [Validators.required]],
      business_attribute_name: [this.UpdateData?.business_attribute_name || '', [Validators.required]],
      business_attribute_definition: [this.UpdateData?.business_attribute_definition || '', [Validators.required]],
      information_sensitivity_classification: [this.UpdateData?.information_sensitivity_classification || '', [Validators.required]],
      information_sensitivity_type: [this.UpdateData?.information_sensitivity_type || '', [Validators.required]],
      information_protection_method: [this.UpdateData?.information_protection_method || '', [Validators.required]],
      business_data_type: [this.UpdateData?.business_data_type || '', [Validators.required]],
      business_attribute_length: [this.UpdateData?.business_attribute_length || 0, [Validators.required]],
      business_attribute_scale: [this.UpdateData?.business_attribute_scale || 0, [Validators.required]],
      is_business_key: [this.UpdateData?.is_business_key || 0, [Validators.required, Validators.min(1)]],
      is_business_date: [this.UpdateData?.is_business_date || 0, [Validators.required, Validators.min(1)]],
      is_mandatory: [this.UpdateData?.is_mandatory || 0, [Validators.required, Validators.min(1)]],
      is_active: [this.UpdateData?.is_active || 0, [Validators.required, Validators.min(1)]],
      version: 0,
      active: true,
      created_by: [this.UpdateData ? this.UpdateData.created_by : '', [Validators.required]],
      date_created: [this.UpdateData ? formatDate(this.UpdateData.date_created, 'yyyy-MM-dd', 'en') : formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]],
      remarks: this.UpdateData ? this.UpdateData.remarks : '',
    });
  }

  get FF(): { [key: string]: AbstractControl } {
    return this.definitionFormGroup.controls;
  }

  filteredOptionsClient?: Observable<any[]>;
  filteredOptionsBOIds?: Observable<any[]>;
  filteredOptionsBOAttributeIds?: Observable<any[]>;
  filteredOptionsBusiness_attribute_name?: Observable<any[]>;
  filteredOptionsInformation_sensitivity_classification?: Observable<any[]>;
  filteredOptionsInformation_sensitivity_type?: Observable<any[]>;
  filteredOptonsInformation_protection_method?: Observable<any[]>;
  filteredOptionsBusiness_data_type?: Observable<any[]>;

  filteredOptionsremarks?: Observable<any[]>;
  filteredOptioncreated_by?: Observable<any[]>;

  boNames: any[] = [];
  projectNames: any[] = [];
  boIds: any[] = [];
  boAttributeIds: any[] = [];
  businessAttrNames: any[] = [];
  infoSensitivityClassifications: any[] = [];
  infoSensitivityTypes: any[] = [];
  infoProtectionMethods: any[] = [];
  bussDataTypes: any[] = [];
  isBusinessKeys: any[] = [];
  isBusinessDates: any[] = [];
  isMandatorys: any[] = [];
  isActives: any[] = [];
  createdByList: any[] = [];
  remarks: any[] = [];

  keyUpBODefinition() {
    this.filteredOptionsClient = this.FF['project_name'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.projectNames) : this.projectNames))
    );

    this.filteredOptionsBOIds = this.FF['business_object_id'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.boIds) : this.boIds))
    );

    this.filteredOptionsBOAttributeIds = this.FF['business_attribute_id'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.boAttributeIds) : this.boAttributeIds))
    );

    this.filteredOptionsBusiness_attribute_name = this.FF['business_attribute_name'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.businessAttrNames) : this.businessAttrNames))
    );

    this.filteredOptionsInformation_sensitivity_classification = this.FF['information_sensitivity_classification'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.infoSensitivityClassifications) : this.infoSensitivityClassifications))
    );

    this.filteredOptionsInformation_sensitivity_type = this.FF['information_sensitivity_type'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.infoSensitivityTypes) : this.infoSensitivityTypes))
    );

    this.filteredOptonsInformation_protection_method = this.FF['information_protection_method'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.infoProtectionMethods) : this.infoProtectionMethods))
    );

    this.filteredOptionsBusiness_data_type = this.FF['business_data_type'].valueChanges.pipe(
      startWith(''),
      map((client) => (client ? filterAutocomplete(client, this.bussDataTypes) : this.bussDataTypes))
    );

  }

  getComboboxData() {
    // this.businessService.getBusinessRule().subscribe({
    //   next: res => {
    //     res.data.map((dt: any) => {
    //       !this.businessRules.some(item => item.value === dt.rule) ? this.businessRules.push({ value: dt.rule }) : '';
    //     })

    //     let rule_id = String(Number(res.data[res.data.length - 1]?.rule_id.substring(9)) + 1);

    //     let last_rule_id = (rule_id.length == 1 ? this.FF['business_object_id'].value + 'BR000' : (rule_id.length == 2 ? this.FF['business_object_id'].value + 'BR00' : (rule_id.length == 3 ? this.FF['business_object_id'].value + 'BR0' : ''))) + rule_id
    //     let BOD_last_value = res.data.length ? last_rule_id : this.FF['business_object_id'].value + 'BR' + "0001";
    //     console.log()
    //     this.BRF['rule_id'].setValue(BOD_last_value);
    //   },
    //   error: err => console.log(err)
    // });

    this.businessService.getBusiness_term().subscribe({
      next: res => {
        res.data.map((dt: any) => {
          !this.boNames.some(item => item.value === dt.business_term) ? this.boNames.push({ value: dt.business_term }) : '';
          !this.businessAttrNames.some(item => item.value === dt.business_term) ? this.businessAttrNames.push({ value: dt.business_term }) : '';
        });
      },
      error: err => console.log(err)
    });


    this.comboboxService.getSensitivity_classification().subscribe({
      next: res => {
        res.data.map((dt: any) => this.infoSensitivityClassifications.push({ value: dt.sensitivity_classification }))
      },
      error: err => console.log(err)
    });

    this.comboboxService.getSensitivity_reason_code().subscribe({
      next: res => {
        res.data.map((dt: any) => this.infoSensitivityTypes.push({ value: dt.sensitivity_reason_code }))
      },
      error: err => console.log(err)
    });

    this.businessService.getBusinessObjectDefinition().subscribe({
      next: res => {
        res.data.map((dt: any) => {
          !this.projectNames.some(item => item.value === dt.project_name) ? (dt.project_name ? this.projectNames.push({ value: dt.project_name }) : '') : '';
          !this.boIds.some(item => item.value === dt.business_object_id) ? (dt.business_object_id ? this.boIds.push({ value: dt.business_object_id }) : '') : '';
          !this.remarks.some(item => item.value === dt.remarks) ? (dt.remarks ? this.remarks.push({ value: dt.remarks }) : '') : '';
          !this.createdByList.some(item => item.value === dt.created_by) ? (dt.created_by ? this.createdByList.push({ value: dt.created_by }) : '') : '';
        })
      },
      error: err => console.log(err)
    });

    // this.comboboxService.getCountry_codes().subscribe({
    //   next: res => {
    //     res.data.map((dt: any) => {
    //       !this.countryCodes.some(item => item.value === dt.Country_Codes) ? this.countryCodes.push({ value: dt.Country_Codes }) : '';
    //     })
    //   },
    //   error: err => console.log(err)
    // });

    // this.comboboxService.getAsset_type().subscribe({
    //   next: res => {
    //     res.data.map((dt: any) => {
    //       this.assetsTypes.push({ value: dt.asset_type_code });
    //     })
    //   },
    //   error: err => console.log(err)
    // });


    // this.comboboxService.getSensitivity_classification().subscribe({
    //   next: res => {
    //     res.data.map((dt: any) => this.sensitivityClassifications.push({ value: dt.sensitivity_classification }))
    //   },
    //   error: err => console.log(err)
    // });

    this.isBusinessKeys = this.isBusinessDates = this.isMandatorys = this.isActives = [
      {
        key: 1,
        value: 'Yes'
      },
      {
        key: 2,
        value: 'No'
      },
    ]

    this.infoProtectionMethods = [
      {
        key: 'Encrypter',
        value: 'Encrypter'
      },
      {
        key: 'Masked',
        value: 'Masked'
      },
    ]

    this.bussDataTypes = [
      {
        key: 'AlphaNumeric',
        value: 'AlphaNumeric'
      },
      {
        key: 'AlphaOnly',
        value: 'AlphaOnly'
      },
      {
        key: 'WholeNumber',
        value: 'WholeNumber'
      },
      {
        key: 'FractionalNumber',
        value: 'FractionalNumber'
      },
      {
        key: 'Boolean',
        value: 'Boolean'
      },
      {
        key: 'Memo',
        value: 'Memo'
      },

    ]


  }

  UpdateData: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  activeRow: any = -1;
  highlightRowDataDtOwner: any;

  pageEvent!: PageEvent;
  length?: number;
  pageSize!: number;
  pageSizeOptions: number[] = [20, 30, 40];
  @ViewChild('commonPagDtOwner') commonPaginator!: MatPaginator;

  displayedColumn: any = {
    columns: [
      'business_unit_owner',
      'business_function',
      'role',
      '#',
    ],
    columnsTranslates: ['Business Unit Owner', 'Business Function', 'Role', '#']
  };

  isActive = (index: number) => { return this.activeRow === index };

  highlight( index: number, id: number, row: any): void {
      if (!this.isActive(index)) {
        row != this.highlightRowDataDtOwner ? this.highlightRowDataDtOwner = row : this.highlightRowDataDtOwner = '';
        this.activeRow = index;
        this.UpdateData = row;
        this.generateForm();
      }
      else {
        this.UpdateData = row;
        this.generateForm();
        this.activeRow = -1;
        this.highlightRowDataDtOwner = '';
      }
  }

  onChangePage(event: PageEvent) {
  }

  handleDelete(id: number) {

  }

  initialBOD_ID = 0;
  getTable(index: number) {
    // this.businessService.getBusinessObjectDefinition().subscribe({
    //   next: res => {
    //       let BOD_ID = String(Number(res.data[res.data.length - 1]?.business_object_id.substring(3)) + 1);
    //       let BOD_last_value = res.data.length ? (BOD_ID.length == 1 ? 'BOD000' : (BOD_ID.length == 2 ? 'BOD00' : (BOD_ID.length == 3 ? 'BOD00' : 'BOD0'))) + BOD_ID : "BOD0001";
    //       this.FF['business_object_id'].setValue(BOD_last_value)
    //       this.initialBOD_ID = this.FF['business_object_id'].value;
    //   },
    //   error: err => console.log(err)
    // })
  }


  item_dialogRef?: MatDialogRef<NewItemComponent>;

  addListValue(name: string) {
    this.item_dialogRef = this.dialog.open(NewItemComponent,
      {
        // disableClose: true,
        hasBackdrop: true,
        width: '45%',
        height: 'auto',
        autoFocus: false,
        data: {
          inputName: name
        }
      })

    this.item_dialogRef.afterClosed().subscribe({
      next: res => {
        this.getComboboxData();
      }
    })
  }

  isFormValid = true;
  handleSaveForm() {
    if (this.definitionFormGroup.valid) {
      this.isFormValid = true;

      this.FF['business_object_id'].value != this.FF['business_attribute_definition'].value ?
        (
          !this.UpdateData ? this.saveForm() : this.updateForm(),
          this.dataSource.paginator = this.commonPaginator
        )
        : swalInfo("BO id and Business attribute definition can't be the same!")

      this.keyUpBODefinition();
    }
    else this.isFormValid = false;
  }

  updateForm() {
    let model = {
      data: this.definitionFormGroup.value,
      conditions: {
        id: this.UpdateData.id
      }
    }

    this.businessService.updateBusinessObjectDefinition(model).subscribe({
      next: res => {
        swalSuccess('Updated successfully!');
        this.getTable(0);
      },
      error: err => swalError("Something went wrong"),
    })
  }

  saveForm() {
    this.businessService.saveBusinessObjectDefinition(this.definitionFormGroup.value).subscribe({
      next: res => {
        swalSuccess("Saved successfully.");
        this.getTable(0);
      },
      error: err => swalError("Something went wrong"),
    });
  }


}
