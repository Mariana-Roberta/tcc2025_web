import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenBackgroundComponent } from './screen-background.component';

describe('ScreenBackgroundComponent', () => {
  let component: ScreenBackgroundComponent;
  let fixture: ComponentFixture<ScreenBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
