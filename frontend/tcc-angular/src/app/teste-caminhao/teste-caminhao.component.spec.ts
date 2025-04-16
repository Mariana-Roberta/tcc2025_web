import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteCaminhaoComponent } from './teste-caminhao.component';

describe('TesteCaminhaoComponent', () => {
  let component: TesteCaminhaoComponent;
  let fixture: ComponentFixture<TesteCaminhaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteCaminhaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteCaminhaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
