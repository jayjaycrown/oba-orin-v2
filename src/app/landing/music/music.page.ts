import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class MusicPage implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  // @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  // @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;

  test;
  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  type: string;
  constructor(private router: Router) {
    this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          img: 'assets/img/carousel1.jpg'
        },
        {
          img: 'assets/img/carousel3.png'
        },
        {
          img: 'assets/img/carousel2.jpg'
        },
        // {
        //   img: 'assets/img/ous_system.png'
        // },
        // {
        //   img: 'assets/img/preview.png'
        // }
      ]
    };
  }

   // Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  // Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  // Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  ngOnInit() {
    this.type = 'featured';
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  search(event) {
    console.log(this.test);
    this.router.navigateByUrl('/home/tabs/music/music-lists');
  }

}
