import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RTree, RTreeRulesets, RulePatternTerm, RulesetsList, SchemaDetails } from 'src/models/common-interfaces';
import { CommonService } from 'src/services/common.service';
import { OperatorsUnicode } from 'src/services/constants.service';

@Component({
  selector: 'app-then-else-call',
  templateUrl: './then-else-call.component.html',
  styleUrls: ['./then-else-call.component.scss']
})
export class ThenElseCallComponent {
  @Input({ required: true }) Rule?: RTree;
  @Input({ required: true }) rulesets?: RTreeRulesets;
  @Input({ required: true }) schemaData?: SchemaDetails;
  @Input({ required: true }) WorksFlows?: RulesetsList[] = [];
  @Input({ required: true }) index?: number;
  @Output() updateRule = new EventEmitter<RTree>();
  private _commonService = inject(CommonService);
  OperatorsUnicode: any = OperatorsUnicode;
  @Input() parentHovered: boolean = false;
  @Output() openDetail = new EventEmitter<any>();

  constructor() { }

  openRuleModal(): void {
    let updatedRule = this._commonService.openRuleModal(this.Rule!, this.rulesets!, this.schemaData!, this.WorksFlows!, this.index!)
    updatedRule?.afterClosed().subscribe((res: RTree) => {
      this.Rule = res
      this.updateRule.emit(this.Rule)
    })
  }

  updateRtreeStructure(RTree: RTree) {
    this.Rule = RTree
    this.updateRule.emit(this.Rule)
  }


  updateRtreeThenAndElseStructure(RTree: RTree, i: number, callType: string) {
    if (callType == 'then' && this.Rule?.thenRuleset) {
      this.Rule.thenRuleset[i] = RTree
      this.updateRule.emit(this.Rule)
    } else if (callType == 'else' && this.Rule?.elseRuleset) {
      this.Rule.elseRuleset[i] = RTree
      this.updateRule.emit(this.Rule)
    }
  }

  toggleParentHover(state: boolean) {
    this.parentHovered = state;
  }

  getMatchList(patterns: RulePatternTerm[]) {
    return this._commonService.getMatchListService(patterns);
  }

  openWorkflowDetail(data: { name: string, RTree: RTree[] }) {
    this.openDetail.emit(data);
  }
}
