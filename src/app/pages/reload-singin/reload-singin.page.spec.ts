import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReloadSinginPage } from './reload-singin.page';

describe('ReloadSinginPage', () => {
  let component: ReloadSinginPage;
  let fixture: ComponentFixture<ReloadSinginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReloadSinginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReloadSinginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
