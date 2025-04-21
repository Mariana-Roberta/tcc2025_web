import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteLandingPageComponent } from './teste-landing-page.component';

describe('TesteLandingPageComponent', () => {
  let component: TesteLandingPageComponent;
  let fixture: ComponentFixture<TesteLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
