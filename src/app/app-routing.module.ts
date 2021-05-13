import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SlideshowComponent } from './slideshow/slideshow.component';

const routes: Routes = [
  { path: 'slideshow/:target', component: SlideshowComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
