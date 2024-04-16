import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RulesetsList } from 'src/models/common-interfaces';

@Component({
  selector: 'app-workflow-list',
  template: `
  <div *ngIf="!workflow?.is_internal" class="card no-border mt-3">
      <div class="card-header">
        <div class="row justify-content-center">
          <div class="col vertically-center">
            <h3 id="worflowName" [ngClass]="workflow?.is_active ? 'active' : 'not-active'">{{workflow?.name}}</h3>
          </div>
          <div class="col-auto">
            <button *ngIf="!isShowMetaData" class="btn m-2" type="button" (click)="isShowMetaData = true" >&#9660;</button>
            <button *ngIf="isShowMetaData" class="btn m-2" type="button" (click)="isShowMetaData = false">&#9650;</button>
            <button class="btn fs-22 m-2" type="button" (click)="openWorkflowDetail(workflow!)">&#8658;</button>
          </div>
        </div>
        <div class="row" style="margin-top: -10px;">
          <div class="col">
            <small [ngClass]="workflow?.is_active ? 'active' : 'not-active'">{{ workflow?.longdesc}}</small>
          </div>
        </div>
      </div>
      <div *ngIf="isShowMetaData" class="card-body">
        <div class="row">
          <div class="col"></div>
          <div class="col-auto">
            <div class="d-flex align-items-center">
              <p class="me-2"><span class="heading-color" i18n="@@Createdby">Created by</span><span> {{ workflow?.createdby }} </span><span class="heading-color" i18n="@@at">at</span><span> {{ workflow?.createdat | date }} </span></p>
            </div>
            <div class="d-flex align-items-center">
            <p class="me-2"><span class="heading-color" i18n="@@Editedby">Edited by</span><span> {{ workflow?.editedby }} </span><span class="heading-color" i18n="@@at">at</span><span> {{ workflow?.editedat | date }} </span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
  styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent {
  @Input({ required: true }) workflow?: RulesetsList;
  @Output() openDetail = new EventEmitter<any>();
  isShowMetaData: boolean = false;
  

  openWorkflowDetail(workFlow: RulesetsList) {
    this.openDetail.emit(workFlow);
  } 
}
