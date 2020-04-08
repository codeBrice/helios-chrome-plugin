import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateAccountsPage } from './create-accounts.page';

describe('CreateAccountsPage', () => {
  let component: CreateAccountsPage;
  let fixture: ComponentFixture<CreateAccountsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
