import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleMethod1Component } from './do-match.component';

describe('RuleMethod1Component', () => {
  let component: RuleMethod1Component;
  let fixture: ComponentFixture<RuleMethod1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleMethod1Component]
    });
    fixture = TestBed.createComponent(RuleMethod1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
