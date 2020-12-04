import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MusicSelectPage } from './music-select.page';

describe('MusicSelectPage', () => {
  let component: MusicSelectPage;
  let fixture: ComponentFixture<MusicSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
