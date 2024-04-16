import { Component, Inject, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Property, RTree, RTreeRulesets, Rule, RuleActions, RulePatternTerm, RuleSet, RulesetsList, SchemaDetails, SchemaPatternAttr } from 'src/models/common-interfaces';
import { OperatorsUnicode, AttrDataTypes, CONSTANTS } from 'src/services/constants.service';
import { checkConstraints } from 'src/customValidators/rule.contraints.service';
import { BREschemaService } from 'src/services/breschema.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/services/common.service';
import { RulesetUpdateResp } from 'src/models/request-response-inteface';
@Component({
    selector: 'app-rule-modal',
    templateUrl: './rule-modal.component.html',
    styleUrls: ['./rule-modal.component.scss']
})
export class RuleModalComponent {
    private _schemaService = inject(BREschemaService);
    private _toastr = inject(ToastrService);
    private _commonService = inject(CommonService);
    fileName = 'RuleModalComponent'
    isEdit: boolean = false;
    action: 'edit' | 'add' | 'workflow' = 'edit';
    index?: number;
    Rule?: RTree;
    RulesetsList: RTreeRulesets = {}
    Ruleset?: RuleSet;
    workFlow?: RulesetsList[];
    updatedThen?: RTree[]
    updatedElse?: RTree[]
    RuleForm: FormGroup = this.formBuilder.group({
        slice: [0, [Validators.required]],
        app: ['', [Validators.required]],
        class: ['', [Validators.required]],
        name: ['', [Validators.required]],
        is_internal: [false, [Validators.required]],
        flowrules: this.formBuilder.array([])
    });

    OperatorsUnicode: { [key: string]: string } = OperatorsUnicode;
    operators = ['eq', 'gt', 'lt', 'ge', 'le', 'ne']
    SchemaData?: SchemaDetails;

    constructor(@Inject(MAT_DIALOG_DATA) public data:
        { rule: RTree, Ruleset: RuleSet, rulesetsList: RTreeRulesets, schemaData: SchemaDetails, workFlows: RulesetsList[], index: number, action: 'edit' | 'add' | 'workflow' },
        private dialog: MatDialogRef<RuleModalComponent>,
        private formBuilder: FormBuilder) {

        if (data) {
            this.Rule = data.rule
            this.updatedThen = data.rule.thenRuleset
            this.updatedElse = data.rule.elseRuleset
            this.RulesetsList = data.rulesetsList
            this.Ruleset = data.Ruleset
            this.SchemaData = data.schemaData
            this.workFlow = data.workFlows
            this.index = data.index;
            this.action = data.action;
            if (data.action == 'add' || data.action == 'workflow') {
                this.patchSchemaValues()
                this.isEdit = true;
            }
            this.patchRuleValues();
        }
    }

    getFlowRulesAtIndex(index: number) {
        let fR = this.RuleForm.get('flowrules') as FormArray;
        return fR.at(index) as FormGroup;
    }

    getRulePatternAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('rulepattern') as FormArray;
    }

    getTasksAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('tasks') as FormArray;
    }

    getPropertiesnAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('properties') as FormArray;
    }

    getIsDoneAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('isDone');
    }

    getThenCallAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('thencall');
    }

    getElseCallAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('elsecall');
    }

    getRemoveThenAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('removeThen');
    }

    getRemoveElseAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('removeElse');
    }

    getWillReturnAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('return');
    }

    getWillExitAt(index: number) {
        return this.getFlowRulesAtIndex(index).get('ruleactions')?.get('exit');
    }

    get flowrules() {
        return this.RuleForm.get('flowrules') as FormArray;
    }

    addFlowRules() {
        const flowrule = this.formBuilder.group({
            rulepattern: this.formBuilder.array<RulePatternTerm>([]),
            ruleactions: this.formBuilder.group({
                tasks: [[], [Validators.required]],
                properties: this.formBuilder.array<{ name: string, val: string }>([]),
                thencall: [''],
                elsecall: [''],
                exit: [false],
                return: [false],
                isDone: [false],
                removeThen: [false],
                removeElse: [false]
            })
        });
        this.flowrules.push(flowrule)
    }

    addPatterns(index: number = 0, attrname?: string, op?: string, attrval?: any) {
        const rPattern = this.formBuilder.group({
            attr: [attrname ?? '', [Validators.required]],
            op: [op ?? '', [Validators.required]],
            val: [attrval ?? '', [Validators.required, checkConstraints(this.SchemaData!)]]
        });

        this.getRulePatternAt(index).push(rPattern);
    }

    addPropeties(flowRuleIndex: number, name?: string, val?: string) {
        const rProperties = this.formBuilder.group({
            name: [name ?? '', [Validators.required]],
            val: [val ?? '', [Validators.required]]
        });
        this.getPropertiesnAt(flowRuleIndex).push(rProperties)
    }

    removeRulePatternByIndex(flowRuleIndex: number, index: number) {
        this.getRulePatternAt(flowRuleIndex).removeAt(index);
    }

    removePropertiesByIndex(flowRuleIndex: number, index: number) {
        this.getPropertiesnAt(flowRuleIndex).removeAt(index);
    }

    removeFlowRulesByIndex(flowRuleIndex: number) {
        this.flowrules.removeAt(flowRuleIndex);
    }

    patchSchemaValues() {
        if (this.SchemaData == undefined) {
            return;
        }

        this.RuleForm.patchValue({
            slice: this.SchemaData?.slice,
            app: this.SchemaData?.app,
            class: this.SchemaData?.class
        })
    }

    patchRuleValues() {
        if (this.Rule == undefined || this.Ruleset == undefined) {
            return;
        }

        this.addFlowRules();

        this.exitChangeHandler(0);

        this.Rule.rulePattern.forEach((pattern: RulePatternTerm) => {
            const attrval = this.getSchemaDetailsByAttrName(pattern.attr)?.valtype == AttrDataTypes.typeTs ? new Date(pattern.attr) : pattern.val
            this.addPatterns(0, pattern.attr, pattern.op, attrval);
        })
        this.RuleForm.patchValue({
            slice: this.SchemaData?.slice,
            app: this.SchemaData?.app,
            class: this.SchemaData?.class,
            name: this.Ruleset.name,
            is_internal: this.Ruleset.is_internal,
            flowrules: [
                {
                    ruleactions: {
                        tasks: this.Rule.ruleActions.tasks,
                        thencall: this.Rule.ruleActions.thencall,
                        elsecall: this.Rule.ruleActions.elsecall,
                        exit: this.Rule.ruleActions.exit,
                        return: this.Rule.ruleActions.return
                    }
                }
            ]
        })

        Object.entries(this.Rule.ruleActions.properties).forEach(([key, value]) => {
            this.addPropeties(0, key, value)
            if (key == 'done') {
                this.getIsDoneAt(0)?.patchValue(true);
                this.getTasksAt(0)?.disable();
                this.getPropertiesnAt(0)?.disable();
                this.getThenCallAt(0)?.disable();
                this.getElseCallAt(0)?.disable();
                this.getRemoveThenAt(0)?.disable();
                this.getRemoveElseAt(0)?.disable();
            }
        })
    }

    isAttrNameUsed(attributeName: string, flowRuleIndex: number, i: number) {
        return this.getRulePatternAt(flowRuleIndex).value.some((pattern: RulePatternTerm, index: number) => pattern.attr == attributeName && index != i)
    }

    isOperatorUsed(attributeName: string, op: string, flowRuleIndex: number, i: number) {
        return this.getRulePatternAt(flowRuleIndex).value.some((pattern: RulePatternTerm, index: number) => pattern.attr == attributeName && pattern.op == op && index != i)
    }

    getAttributesNamesByIndex(flowRuleIndex: number, index: number) {
        const attrNameList: string[] = []
        this.SchemaData?.patternschema.forEach((attribute: SchemaPatternAttr) => {
            if (((attribute.valtype == AttrDataTypes.typeBool || attribute.valtype == AttrDataTypes.typeEnum) && this.isAttrNameUsed(attribute.attr, flowRuleIndex, index)) || this.isOperatorUsed(attribute.attr, 'eq', flowRuleIndex, index)) {
                return;
            }
            attrNameList.push(attribute.attr)
        })

        return attrNameList
    }

    getOperatorsList(flowRuleIndex: number, index: number) {
        let schemaDetails = this.getSchemaDetailsByIndex(flowRuleIndex, index)
        let isUsed = this.getRulePatternAt(flowRuleIndex).value.some((pattern: RulePatternTerm, i: number) => pattern.attr == schemaDetails?.attr && pattern.op != 'eq' && i != index)
        if (schemaDetails?.valtype == AttrDataTypes.typeEnum || schemaDetails?.valtype == AttrDataTypes.typeBool) {
            return ['eq', 'ne']
        }
        return isUsed ? this.operators.filter((op: string) => op != 'eq' && op != 'ne') : this.operators;
    }

    getRulesetsList(flowRuleIndex: number, callType: string) {
        let workflowList = this.workFlow
        if (callType == 'then') {
            workflowList = workflowList?.filter((workflow: any) => workflow.name != this.getElseCallAt(flowRuleIndex)?.value)
        } else {
            workflowList = workflowList?.filter((workflow: any) => workflow.name != this.getThenCallAt(flowRuleIndex)?.value)
        }

        return workflowList;
    }

    onAttrNameChangeHandler(flowRuleIndex: number, index: number) {
        this.getRulePatternAt(flowRuleIndex).controls[index].patchValue({ op: '', val: '' })
        if (this.getSchemaDetailsByIndex(flowRuleIndex, index)?.valtype == AttrDataTypes.typeBool) {
            this.getRulePatternAt(flowRuleIndex).controls[index].get('val')?.patchValue(false)
        }
    }

    propertyNameChangeHandler(flowRuleIndex: number, index: number) {
        this.getPropertiesnAt(flowRuleIndex).controls[index].patchValue({ val: '' });
    }

    markTaskDoneHandler(flowRuleIndex: number) {
        this.getPropertiesnAt(flowRuleIndex)?.value.forEach((index: number) => this.removePropertiesByIndex(flowRuleIndex, index))
        this.getTasksAt(flowRuleIndex)?.patchValue([])
        this.getThenCallAt(flowRuleIndex)?.patchValue("")
        this.updatedThen = undefined
        this.getElseCallAt(flowRuleIndex)?.patchValue("")
        this.updatedElse = undefined
        if (this.getIsDoneAt(flowRuleIndex)?.value) {
            this.getTasksAt(flowRuleIndex)?.disable();
            this.getThenCallAt(flowRuleIndex)?.disable();
            this.getElseCallAt(flowRuleIndex)?.disable();
            this.getRemoveThenAt(flowRuleIndex)?.disable();
            this.getRemoveElseAt(flowRuleIndex)?.disable();
            this.addPropeties(flowRuleIndex, 'done', 'true');
            this.getPropertiesnAt(flowRuleIndex)?.disable();
        } else {
            this.getThenCallAt(flowRuleIndex)?.enable();
            this.getElseCallAt(flowRuleIndex)?.enable();
            this.getRemoveThenAt(flowRuleIndex)?.enable();
            this.getRemoveElseAt(flowRuleIndex)?.enable();
            this.getPropertiesnAt(flowRuleIndex)?.enable();
            this.getTasksAt(flowRuleIndex)?.enable();
        }
    }


    toggleRemoveThenCall(flowRuleIndex: number) {
        if (this.getRemoveThenAt(flowRuleIndex)?.value || this.getIsDoneAt(flowRuleIndex)?.value) {
            this.getThenCallAt(flowRuleIndex)?.patchValue("")
            this.updatedThen = undefined;
            this.getThenCallAt(flowRuleIndex)?.disable();
        } else {
            this.getThenCallAt(flowRuleIndex)?.enable();
        }
    }


    toggleRemoveElseCall(flowRuleIndex: number) {
        if (this.getRemoveElseAt(flowRuleIndex)?.value || this.getIsDoneAt(flowRuleIndex)?.value) {
            this.getElseCallAt(flowRuleIndex)?.patchValue("")
            this.updatedElse = undefined;
            this.getElseCallAt(flowRuleIndex)?.disable();
        } else {
            this.getElseCallAt(flowRuleIndex)?.enable();
        }
    }


    async thenChangeHandler(flowRuleIndex: number) {
        if (!this.getElseCallAt(flowRuleIndex)?.value) {
            this.getElseCallAt(flowRuleIndex)?.patchValue("")
        }
        let data = await this._schemaService.buildRtree(this.Ruleset?.app!, this.Ruleset?.slice!, this.Ruleset?.class!, this.getThenCallAt(flowRuleIndex)?.value, this.RulesetsList);
        if (data instanceof Error) {
            throw data;
        }
        this.updatedThen = data
    }

    async elseChangeHandler(flowRuleIndex: number) {
        if (!this.getThenCallAt(flowRuleIndex)?.value) {
            this.getThenCallAt(flowRuleIndex)?.patchValue("")
        }
        let data = await this._schemaService.buildRtree(this.Ruleset?.app!, this.Ruleset?.slice!, this.Ruleset?.class!, this.getElseCallAt(flowRuleIndex)?.value, this.RulesetsList);
        if (data instanceof Error) {
            throw data;
        }
        this.updatedElse = data
    }

    exitChangeHandler(flowRuleIndex: number) {
        if (this.getWillExitAt(flowRuleIndex)?.value) {
            this.getWillReturnAt(flowRuleIndex)?.patchValue(false);
            this.getWillReturnAt(flowRuleIndex)?.disable()
        } else {
            this.getWillReturnAt(flowRuleIndex)?.enable()
        }
    }

    // onPatternDrop(event: CdkDragDrop<any[]>) {
    //     moveItemInArray(this.rulePattern.controls, event.previousIndex, event.currentIndex);
    // }

    getSchemaDetailsByIndex(flowRuleIndex: number, i: number) {
        const attrName = this.getRulePatternAt(flowRuleIndex).at(i)?.value?.attr
        return this.SchemaData?.patternschema.filter((pattern: SchemaPatternAttr) => pattern.attr == attrName)[0] ?? null
    }

    getSchemaDetailsByAttrName(attrName: string) {
        return this.SchemaData?.patternschema.filter((pattern: SchemaPatternAttr) => pattern.attr == attrName)[0] ?? null
    }

    closeModal() {
        if ((this.action == 'add' || this.action == 'workflow') && this.RuleForm.invalid) {
            this.dialog.close();
            return
        }
        this.dialog.close(this.Rule);
    }

    onEditHandler() {
        if (this.Ruleset?.is_active) {
            this._toastr.warning(CONSTANTS.CANNOT_EDIT_RULESET_MSG, CONSTANTS.WARNING)
            return;
        }

        this.isEdit = true;
    }

    saveHandler() {
        if (this.RuleForm.invalid || this.index == undefined) {
            return
        }

        let rulePatterns: RulePatternTerm[] = [];

        this.RuleForm.value.flowrules.at(0).rulepattern.forEach((pattern: RulePatternTerm) => {
            let originalPattern: RulePatternTerm = pattern
            if (this.getSchemaDetailsByAttrName(pattern.attr)?.valtype == AttrDataTypes.typeTs) {
                originalPattern.attr = new Date(pattern.attr).toISOString()
            }
            rulePatterns.push(originalPattern)
        })

        const updatedProperties: Property = this.getPropertiesnAt(0).value.reduce((acc: any, curr: any) => {
            acc[curr.name] = curr.val;
            return acc;
        }, {});



        this.Rule = {
            setname: this.Rule!.setname,
            rulePattern: rulePatterns,
            ruleActions: {
                tasks: this.getTasksAt(0)?.value,
                properties: updatedProperties
            }
        }

        if (this.getThenCallAt(0)?.value != undefined && this.updatedThen != undefined) {
            this.Rule.ruleActions.thencall = this.getThenCallAt(0)?.value
            this.Rule.thenRuleset = this.updatedThen
        }

        if (this.getElseCallAt(0)?.value != undefined && this.updatedElse != undefined) {
            this.Rule.ruleActions.elsecall = this.getElseCallAt(0)?.value
            this.Rule.elseRuleset = this.updatedElse
        }

        if (this.getWillReturnAt(0)?.value != undefined) {
            this.Rule.ruleActions.return = this.getWillReturnAt(0)?.value
        }

        if (this.getWillExitAt(0)?.value != undefined) {
            this.Rule.ruleActions.exit = this.getWillExitAt(0)?.value
        }

        const updatedRuleset = this.Ruleset!;

        // Update the current rules value
        if (this.action == 'edit') {
            updatedRuleset.flowrules[this.index] = { rulepattern: this.Rule.rulePattern, ruleactions: this.Rule.ruleActions }
        } else {
            updatedRuleset.flowrules?.push({ rulepattern: this.Rule.rulePattern, ruleactions: this.Rule.ruleActions })
        }

        try {

            this._commonService.showLoader()
            this._schemaService.updateWorkflowRule(updatedRuleset).subscribe((res: RulesetUpdateResp) => {
                if (res.status == CONSTANTS.SUCCESS) {
                    this._toastr.success(res?.message, CONSTANTS.SUCCESS);
                    this._commonService.hideLoader();
                    this.isEdit = false;
                } else {
                    this._toastr.error(res?.message, CONSTANTS.ERROR);
                    this._commonService.hideLoader();
                }
            }, (err: any) => {
                this._toastr.error(err, CONSTANTS.ERROR)
                this._commonService.hideLoader();
            })
        } catch (error) {
            this._commonService.log({
                fileName: this.fileName,
                functionName: 'saveHandler',
                err: error
            })
        }
    }

    addRulesetHandler() {
        if (this.RuleForm.invalid || this.index == undefined) {
            return
        }


        let flowRules: Rule[] = [];

        this.RuleForm.value.flowrules.forEach((flowRule: Rule) => {
            let rulePatterns: RulePatternTerm[] = [];
            flowRule.rulepattern.forEach((pattern: RulePatternTerm) => {
                let originalPattern: RulePatternTerm = pattern
                if (this.getSchemaDetailsByAttrName(pattern.attr)?.valtype == AttrDataTypes.typeTs) {
                    originalPattern.attr = new Date(pattern.attr).toISOString()
                }
                rulePatterns.push(originalPattern)
            })

            const updatedProperties: Property = this.getPropertiesnAt(0).value.reduce((acc: any, curr: any) => {
                acc[curr.name] = curr.val;
                return acc;
            }, {});

            let { isDone, removeThen, removeElse, ...rest }: any = flowRule.ruleactions
            let fRule: Rule = {
                rulepattern: rulePatterns,
                ruleactions: {
                    ...rest,
                    properties: updatedProperties
                }
            }

            flowRules.push(fRule)
        })

        let newWorkFlow = {
            ...this.RuleForm.value,
            flowrules: flowRules
        }

        try {

            this._commonService.showLoader()
            this._schemaService.createNewWorkflow(newWorkFlow).subscribe((res: RulesetUpdateResp) => {
                if (res.status == CONSTANTS.SUCCESS) {
                    this._toastr.success(res?.message, CONSTANTS.SUCCESS);
                    this._commonService.hideLoader();
                    this.closeModal()
                } else {
                    this._toastr.error(res?.message, CONSTANTS.ERROR);
                    this._commonService.hideLoader();
                }
            }, (err: any) => {
                this._toastr.error(err, CONSTANTS.ERROR)
                this._commonService.hideLoader();
            })
        } catch (error) {
            this._commonService.log({
                fileName: this.fileName,
                functionName: 'saveHandler',
                err: error
            })
        }
    }
}
