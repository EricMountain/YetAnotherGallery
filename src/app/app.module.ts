import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { SlideshowComponent } from './slideshow/slideshow.component';

import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SlideshowComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
  ],
  providers: [{provide: APP_BASE_HREF, useValue: environment.base}],
  bootstrap: [AppComponent]
})
export class AppModule { }
