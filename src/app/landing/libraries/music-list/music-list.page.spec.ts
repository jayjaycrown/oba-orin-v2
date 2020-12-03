import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MusicListPage } from './music-list.page';

describe('MusicListPage', () => {
  let component: MusicListPage;
  let fixture: ComponentFixture<MusicListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
