import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import * as Enums from './constants.service';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment.development';
import { RTree, RTreeRulesets, Rule } from 'src/models/common-interfaces';
import { RuleSetDetailResp } from 'src/models/request-response-inteface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BREschemaService {
  fileName: string = 'SchemaService'
  _httpService = inject(HttpService);
  _commonService = inject(CommonService);
  private _toastr = inject(ToastrService);
  constructor() { }

  getWorkflowSchemaList(): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRESchema_LIST_API,
        local_json_file: '',
        param_data: {},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getWorkflowSchemaList',
        msg: error
      });
    }
  }

  getWorkflowSchemaDetail(obj: any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRESchema_GET_API,
        local_json_file: '',
        param_data: obj,
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getWorkflowSchemaDetail',
        msg: error
      });
    }
  }

  getWorkflowList(payload:any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRERulesets_LIST_API,
        local_json_file: '',
        param_data: payload,
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getWorkflowList',
        msg: error
      });
    }
  }

  getWorkflowDetails(obj: any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRERulesets_GET_API,
        local_json_file: '',
        param_data: obj,
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'getWorkflowDetails',
        msg: error
      });
    }
  }

  createNewWorkflow(obj: any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRE_NEW_WORKFLOW,
        local_json_file: '',
        param_data: {data:obj},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'createNewWorkflow',
        msg: error
      });
    }
  }

  updateWorkflowRule(obj: any): any {
    try {
      let dataObj = {
        method: 'post',
        api_url: environment.apiUrl + Enums.CONSTANTS.BRERulesets_UPDATE_API,
        local_json_file: '',
        param_data: {data:obj},
        mapcol: false,
      };
      let resp = this._httpService.fetchData(dataObj);
      return resp;
    } catch (error) {
      this._commonService.log({
        fileName: this.fileName,
        functionName: 'updateWorkflowRule',
        msg: error
      });
    }
  }

  // Function to recurrsively fetch the details of a rule based on the provided parameters and create a RTree data structure.
  async buildRtree(app: string, slice: number, Sclass: string, Rname: string,FinalRulesetsList:RTreeRulesets): Promise<RTree[] | Error> {
		try {
			this._commonService.showLoader();
			let data = {
        data:{app,
        class: Sclass,
        slice,
        name: Rname}
				// params: new HttpParams().append('app', app).append('slice', slice).append('class', Sclass).append('name', Rname)
			};

			const res: RuleSetDetailResp = await this.getWorkflowDetails(data).toPromise();

			if (res.status === Enums.CONSTANTS.SUCCESS) {
				let rules: Rule[] = res.data.flowrules;
				let FinalRuleStruct: RTree[] = [];
        
        if(!FinalRulesetsList[res.data.name]){
          FinalRulesetsList[res.data.name] = res.data
        }
				
				for (const rule of rules) {
					let ruleObj: RTree = {
						setname: res.data.name,
						rulePattern: rule.rulepattern,
						ruleActions: rule.ruleactions
					};

					if (rule.ruleactions.thencall != null) {
						// recursive call when the response data contains thencall
						const thenRuleset = await this.buildRtree(app, slice, Sclass, rule.ruleactions.thencall,FinalRulesetsList);
						if (thenRuleset instanceof Error) {
							throw thenRuleset;
						}
						ruleObj.thenRuleset = thenRuleset;
					}
					if (rule.ruleactions.elsecall != null) {
						// recursive call when the response data contains elsecall
						const elseRuleset = await this.buildRtree(app, slice, Sclass, rule.ruleactions.elsecall,FinalRulesetsList);
						if (elseRuleset instanceof Error) {
							throw elseRuleset;
						}
						ruleObj.elseRuleset = elseRuleset;
					}

					FinalRuleStruct.push(ruleObj);
				}
				this._commonService.hideLoader();
				return FinalRuleStruct;
			} else {
				this._commonService.hideLoader();
				this._toastr.error(res?.message, Enums.CONSTANTS.ERROR);
				return new Error(res?.message);
			}
		} catch (error: any) {
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'buildRtree',
				err: error
			});
			return error;
		}
	}
}
