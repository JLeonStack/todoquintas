import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPublicarComponent } from './tab-publicar.component';

describe('TabPublicarComponent', () => {
  let component: TabPublicarComponent;
  let fixture: ComponentFixture<TabPublicarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPublicarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPublicarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
