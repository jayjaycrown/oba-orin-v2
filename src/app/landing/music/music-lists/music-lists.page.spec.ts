import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MusicListsPage } from './music-lists.page';

describe('MusicListsPage', () => {
  let component: MusicListsPage;
  let fixture: ComponentFixture<MusicListsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicListsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
