import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LibrariesPage } from './libraries.page';

describe('LibrariesPage', () => {
  let component: LibrariesPage;
  let fixture: ComponentFixture<LibrariesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrariesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LibrariesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
