import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppInfo, RealmSliceList, RulesetsList, SchemaDetails, SchemaList, SelectedData, SliceInfo } from 'src/models/common-interfaces';
import { ActivateRealmSliceResp, DeactivateRealmSliceResp, ReamlSliceListResp, RuleSetListResp, SchemaDetailResp, SchemaListResp } from 'src/models/request-response-inteface';
import { BREschemaService } from 'src/services/breschema.service';
import { CommonService } from 'src/services/common.service';
import { CONSTANTS } from 'src/services/constants.service';
import { RealmsliceService } from 'src/services/realmslice.service';

@Component({
  selector: 'app-workflow-schema',
  templateUrl: './workflow-schema.component.html',
  styleUrls: ['./workflow-schema.component.scss']
})
export class WorkflowSchemaComponent {
  fileName: string = 'SchemaComponent';
  private _schemaService = inject(BREschemaService);
  private _commonService = inject(CommonService);
  private _realmService = inject(RealmsliceService);
  private _toastr = inject(ToastrService);
  isRealmSliceActive: boolean = false;
  schemasList?: SchemaList[];
  appList?: AppInfo[];
  sliceList?: SliceInfo[];
  classList?: string[];
  selectedData: SelectedData = {
    app: null,
    slice: null,
    class: null,
  }
  schemaData?: SchemaDetails;
  WorksFlows?: RulesetsList[];

  ngOnInit() {
    this.getSchemaList();
  }

  getSchemaList() {
    try {
      this._commonService.showLoader();
      this._schemaService.getWorkflowSchemaList().subscribe((res: SchemaListResp) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          this._commonService.hideLoader();
          if (res?.data == null || res?.data == undefined || res?.data?.length == 0) {
            this._toastr.error(CONSTANTS.DATA_NOT_FOUND, CONSTANTS.ERROR);
            return
          }
          this.schemasList = res?.data;
          this.appList = this._commonService.getAppNamesFromList(res?.data);
          
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._toastr.error(err, CONSTANTS.ERROR)
        this._commonService.hideLoader();
      })
    } catch (error) {
      this._commonService.hideLoader();
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getSchemaList',
        err: error
      })
    }
  }

  getSliceList() {
    this.clearCache();
    this.clearSchemaData();
    if (this.schemasList && this.selectedData.app) {
      this.selectedData.slice = null
      this.sliceList = this._commonService.getSliceNumbersForSelectedApp(this.schemasList, this.selectedData.app)
    }
  }

  getClassList() {
    this.classList = undefined;
    this.clearSchemaData();
    this.getRealmSliceList();
    if (this.schemasList && this.selectedData.app && this.selectedData.slice) {
      this.selectedData.class = null
      this.classList = this._commonService.getClassNameForSelectedSchemaData(this.schemasList, this.selectedData.app, this.selectedData.slice)
    }
  }

  getDetails() {
    this.clearSchemaData();
    this.getSchemaDetails();
    this.getRulesetsList()
  }

  getSchemaDetails() {
    this.schemaData = undefined
    if (!this.schemasList || !this.selectedData.app || !this.selectedData.slice || !this.selectedData.class) {
      return;
    }
    try {
      let data = {
        data: {
          app: this.selectedData.app,
          class: this.selectedData.class,
          slice: this.selectedData.slice
        }
      }
      this._commonService.showLoader()
      this._schemaService.getWorkflowSchemaDetail(data).subscribe((res: SchemaDetailResp) => {
        if (res.status == CONSTANTS.SUCCESS) {
          this._commonService.hideLoader();
          if (res.data == null || res.data == undefined || this._commonService.isObjectEmpty(res.data)) {
            this._toastr.error(CONSTANTS.DATA_NOT_FOUND, CONSTANTS.ERROR);
            return
          }
          this.schemaData = res.data
          
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._toastr.error(err, CONSTANTS.ERROR)
        this._commonService.hideLoader()
      })
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getSchemaDetails',
        err: error
      })
    }
  }

  getRulesetsList() {
    this.WorksFlows = undefined
    if (!this.schemasList || !this.selectedData.app || !this.selectedData.slice || !this.selectedData.class) {
      return;
    }
    try {
      let data = {
        data: {
          app: this.selectedData.app,
          class: this.selectedData.class,
          slice: this.selectedData.slice
        }
      }
      this._commonService.showLoader();
      this._schemaService.getWorkflowList(data).subscribe((res: RuleSetListResp) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          this.WorksFlows = res?.data?.workflows;
          this._commonService.hideLoader();
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
          this._commonService.hideLoader();
        }
      }, (err: any) => {
        this._commonService.hideLoader()
        this._toastr.error(err, CONSTANTS.ERROR)
      })
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getRulesetsList',
        err: error
      })
    }
  }

  getRealmSliceList() {
    this.isRealmSliceActive = false;
    try {
      this._realmService.getRealmSliceList().subscribe((res: ReamlSliceListResp) => {
        if (res?.status == CONSTANTS.SUCCESS) {
          this.isRealmSliceActive = res?.data?.slices.filter((slice: RealmSliceList) => slice.id == this.selectedData.slice)[0].active;
        } else {
          this._toastr.error(res?.message, CONSTANTS.ERROR);
        }
      }, (err: any) => {
        this._toastr.error(err, CONSTANTS.ERROR)
      })
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getRealmsList',
        err: error
      })
    }
  }

  activateOrDeactiveRealSlice() {
    try {
      if (this.isRealmSliceActive) {
        this._realmService.realmSliceDeactivate({ id: this.selectedData.slice }).subscribe((res: DeactivateRealmSliceResp) => {
          if (res?.status == CONSTANTS.SUCCESS) {
            this.clearCache();
            this.clearSchemaData();
            this.selectedData.app = null;
            this._toastr.success(res?.message, CONSTANTS.SUCCESS);
          } else {
            this.isRealmSliceActive = !this.isRealmSliceActive
            this._toastr.error(res?.message, CONSTANTS.ERROR);
          }
        }, (err: any) => {
          this.isRealmSliceActive = !this.isRealmSliceActive
          this._toastr.error(err, CONSTANTS.ERROR)
        })
      } else {
        this._realmService.realmSliceActivate({ id: this.selectedData.slice }).subscribe((res: ActivateRealmSliceResp) => {
          if (res?.status == CONSTANTS.SUCCESS) {
            this.clearCache();
            this.clearSchemaData();
            this.selectedData.app = null;
            this._toastr.success(res?.message, CONSTANTS.SUCCESS);
          } else {
            this.isRealmSliceActive = !this.isRealmSliceActive
            this._toastr.error(res?.message, CONSTANTS.ERROR);
          }
        }, (err: any) => {
          this.isRealmSliceActive = !this.isRealmSliceActive
          this._toastr.error(err, CONSTANTS.ERROR)
        })
      }
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getRealmsList',
        err: error
      })
    }
  }

  clearCache() {
    this.sliceList = undefined;
    this.classList = undefined;
  }

  clearSchemaData() {
    this.schemaData = undefined;
    this.WorksFlows = undefined;
  }
}

