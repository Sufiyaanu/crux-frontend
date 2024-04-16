import { Injectable, inject } from '@angular/core';
import { CommonService } from './common.service';
import * as Enums from './constants.service';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RealmsliceService {
  fileName: string = 'RealmSliceService'
  _httpService = inject(HttpService);
  _commonService = inject(CommonService);

  constructor() { }

  getRealmSliceList(): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.Realm_Slice_LIST_API,
        local_json_file: '',
        param_data: {},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getRealmSliceList',
        msg: error
      });
    }
  }

  postRealmSliceNew(obj: any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.Realm_Slice_New_API,
        local_json_file: '',
        param_data: obj,
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'postRealmSliceNew',
        msg: error
      });
    }
  }

  getRealmSliceApps(payload:any): any {
    try {
      let dataObj = {
        method: 'get',
        api_url: environment.apiUrl + Enums.CONSTANTS.Realm_Slice_Apps_API + '/' + payload,
        local_json_file: '',
        param_data: {},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getRealmSliceApps',
        msg: error
      });
    }
  }

  realmSliceActivate(obj: any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.Realm_Slice_Activate_API,
        local_json_file: '',
        param_data: {data:obj},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'postRealmSliceNew',
        msg: error
      });
    }
  }

  realmSliceDeactivate(obj: any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.Realm_Slice_Deactivate_API,
        local_json_file: '',
        param_data: {data:obj},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'postRealmSliceNew',
        msg: error
      });
    }
  }
}
