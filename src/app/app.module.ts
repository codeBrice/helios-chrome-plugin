import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IonicStorageModule } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { HttpClientModule } from '@angular/common/http';
//modal
import { LockscreenModule } from 'src/plugins/lockscreen/lockscreen.module';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule, IonicStorageModule.forRoot(),
    HttpClientModule,
    LockscreenModule
  ],

  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
