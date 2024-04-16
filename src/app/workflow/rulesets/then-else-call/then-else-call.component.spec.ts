import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleMethod2Component } from './then-else-call.component';

describe('RuleMethod2Component', () => {
  let component: RuleMethod2Component;
  let fixture: ComponentFixture<RuleMethod2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleMethod2Component]
    });
    fixture = TestBed.createComponent(RuleMethod2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
