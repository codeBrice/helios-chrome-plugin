import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExportPrivatekeyModalPage } from './export-privatekey-modal.page';

describe('ExportPrivatekeyModalPage', () => {
  let component: ExportPrivatekeyModalPage;
  let fixture: ComponentFixture<ExportPrivatekeyModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPrivatekeyModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportPrivatekeyModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
