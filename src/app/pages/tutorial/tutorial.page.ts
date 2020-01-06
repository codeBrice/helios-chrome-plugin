import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})

export class TutorialPage implements OnInit {
  slides: Slide[];
  showSkip = true;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(private storage: Storage,private router: Router) {
    this.slides = [
      {
        title: 'Welcome to the <b>Helios Wallet Mobile</b>',
        description: 'The simple and more secure way to send, receive, and manage your money.',
        image: '/assets/images/slide-1.png',
      },
      {
        title: 'Handle your <b>money</b>',
        description: 'Send money quickly to almost anyone in 100+ countries and market.',
        image: '/assets/images/slide-2.png',
      },
      {
        title: 'Safe Wallet',
        description: 'Shop more securely on thousands of websites and apps.',
        image: '/assets/images/slide-3.png',
      }
    ];
  }

  ngOnInit() {
  }

  skipTutorial() {
    this.storage.set( 'tutorial', true );
    this.router.navigate(['/homewallet']);
  }
}
