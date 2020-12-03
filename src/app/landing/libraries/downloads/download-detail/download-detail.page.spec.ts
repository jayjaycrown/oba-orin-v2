import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadDetailPage } from './download-detail.page';

describe('DownloadDetailPage', () => {
  let component: DownloadDetailPage;
  let fixture: ComponentFixture<DownloadDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
