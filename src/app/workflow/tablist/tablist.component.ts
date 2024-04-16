import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { RTree, RTreeRulesets, RulesetsList, SchemaDetails } from 'src/models/common-interfaces';
import { BREschemaService } from 'src/services/breschema.service';
import { CommonService } from 'src/services/common.service';
import { CONSTANTS } from 'src/services/constants.service';

interface Tabs {
	name: string,
	RTree: RTree[]
}

@Component({
	selector: 'app-tablist',
	templateUrl: './tablist.component.html',
	styleUrls: ['./tablist.component.scss']
})
export class TablistComponent {
	fileName = 'TabslistComponent';
	constants = CONSTANTS;
	showSource: boolean = false;
	@ViewChild('workflowsTab') defaultTab: ElementRef | undefined;
	@ViewChildren('dynamicTab') Tabs: QueryList<any> | undefined;
	@Input({ required: true }) schemaData?: SchemaDetails
	@Input({ required: true }) WorksFlows?: RulesetsList[] = [];
	private _schemaService = inject(BREschemaService);
	private _commonService = inject(CommonService);
	tabs: Tabs[] = [];
	FinalRulesetsList: RTreeRulesets = {}

	// Function to close dynamic Tab
	close(event: MouseEvent, toRemove: Tabs) {
		this.tabs = this.tabs.filter((id: Tabs) => id !== toRemove);
		this.defaultTab?.nativeElement.click();
		event.preventDefault();
		event.stopImmediatePropagation();
		this.showSource = false;
	}

	// Function to get ruleset details for particular selected ruleset
	// And open it in new tab
	async openRuledetailTabAndMakeAPIcall(ruleset: RulesetsList) {
		if (!ruleset.app || !ruleset.slice || !ruleset.class || !ruleset.name) {
			return;
		}
		try {
			let tabAlreadyExist = this.tabs.find(tab => tab.name === ruleset.name);
			this.showSource = false
			if (!tabAlreadyExist) {
				const data = await this._schemaService.buildRtree(ruleset.app, ruleset.slice, ruleset.class, ruleset.name, this.FinalRulesetsList);
				if (data instanceof Error) {
					throw data;
				}
				else if (data.length > 0) {
					this.tabs.push({
						name: ruleset.name,
						RTree: data
					});
				}
				this._commonService.hideLoader()
			}
			setTimeout(() => {
				this.autoDirectTab(ruleset);
			}, 100);
		} catch (err: any) {
			this._commonService.hideLoader()
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'openRuledetailTabAndMakeAPIcall',
				err: err
			});
		}
	}

	openNewTab(data: { name: string, RTree: RTree[] }) {
		console.log(data)
		let tabAlreadyExist = this.tabs.find(tab => tab.name === data.name);
		if (!tabAlreadyExist) {
			this.tabs.push({
				name: data.name,
				RTree: data.RTree
			});

		}
		setTimeout(() => {
			this.autoDirectTab(data);
		}, 100);
	}

	openRuleModal(setname: string, tabIndex: number): void {
		// Create a empty RTree data.
		let Rule: RTree = {
			setname,
			rulePattern: [],
			ruleActions: {
				tasks: [],
				properties: {}
			},
		}
		let updatedRule = this._commonService.openRuleModal(Rule, this.FinalRulesetsList, this.schemaData!, this.WorksFlows!, 0, 'add')
		updatedRule?.afterClosed().subscribe((res: RTree) => {
			if (res == undefined) {
				return
			}
			this.tabs[tabIndex].RTree.push(res)
		})
	}

	openWorkFlowModal(): void {
		// Create a empty RTree data.
		let Rule: RTree = {
			setname:'',
			rulePattern: [],
			ruleActions: {
				tasks: [],
				properties: {}
			},
		}
		let updatedRule = this._commonService.openRuleModal(Rule, this.FinalRulesetsList, this.schemaData!, this.WorksFlows!, 0, 'workflow')
		// updatedRule?.afterClosed().subscribe((res: RTree) => {
		// 	if (res == undefined) {
		// 		return
		// 	}
		// 	this.tabs[tabIndex].RTree.push(res)
		// })
	}

	updateRtree(Rtree: RTree, tabIndex: number, i: number) {
		this.tabs[tabIndex].RTree[i] = Rtree;
	}

	getConstraints(patternschema: any): string {
		let constraints = '';
		if ('valmin' in patternschema) {
			constraints += `Min  ${patternschema.valmin}`;
		}
		if ('valmax' in patternschema) {
			constraints += `${constraints ? ' - ' : ''}Max  ${patternschema.valmax}`;
		}
		if ('lenmin' in patternschema) {
			constraints += `${constraints ? ' - ' : ''}Min  ${patternschema.lenmin}`;
		}
		if ('lenmax' in patternschema) {
			constraints += `${constraints ? ' - ' : ''}Max  ${patternschema.lenmax}`;
		}
		return constraints || (patternschema.vals ? '' : 'No constraints');
	}

	autoDirectTab(event: any) {
		this.tabs.forEach((tab: any) => {
			if (tab.name == event.name) {
				this.Tabs?.forEach((tab: any) => {
					if (tab.nativeElement.id == `${event.name}-tab`) {
						tab.nativeElement.click()
					}
				})
			}
		})
	}
}
