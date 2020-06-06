import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExportPrivatekeyPage } from './export-privatekey.page';

describe('ExportPrivatekeyPage', () => {
  let component: ExportPrivatekeyPage;
  let fixture: ComponentFixture<ExportPrivatekeyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPrivatekeyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportPrivatekeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
