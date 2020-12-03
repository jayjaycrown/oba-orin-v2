import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LyricsDetailPage } from './lyrics-detail.page';

describe('LyricsDetailPage', () => {
  let component: LyricsDetailPage;
  let fixture: ComponentFixture<LyricsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LyricsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LyricsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
