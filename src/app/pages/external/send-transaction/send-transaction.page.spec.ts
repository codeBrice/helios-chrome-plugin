import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendTransactionPage } from './send-transaction.page';

describe('SendTransactionPage', () => {
  let component: SendTransactionPage;
  let fixture: ComponentFixture<SendTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendTransactionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
