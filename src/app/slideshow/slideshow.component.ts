import { Component, OnDestroy, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MediaList } from '../media';
import { MediaListService } from '../medialist.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit {
  debug = false;

  target = '';
  mediaList: MediaList = {
    sizes: [],
    media: [],
  };
  isLoaded = false;
  label = '';
  pathPrefix = '';
  pathSuffix = '';
  currentOffset = 0;
  imageLoading = false;

  documentElement: any;
  isFullScreen: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private mediaListService: MediaListService,) {
    router.events.subscribe((val) => {
      console.log("Router event:", val)
    });
  }

  ngOnInit(): void {
    this.documentElement = document.documentElement;
    this.getTarget();
    if (this.target != '') {
      this.getMediaList();
    }
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  getTarget(): void {
    const tmp = this.route.snapshot.paramMap.get('target');
    if (tmp) {
      this.target = tmp
      console.log("target: ", tmp)
    }
  }

  getMediaList() {
    this.mediaListService.getMediaList(this.target + "/index.json").subscribe(
      mediaList => {
        this.mediaList = mediaList;
        this.isLoaded = true;
        if (this.mediaList.sizes.length != 0) {
          this.mediaList.sizes.forEach(size => {
            if (size.default) {
              this.setLabel(size.label)
            }
          });
        }
      });
    this.gotoMedia(0);
  }

  gotoMedia(offset: number) {
    this.currentOffset = offset;
    this.imageLoading = true;
  }

  nextMedia() {
    let l = this.mediaList.media.length
    if (l != 0 && this.currentOffset < l - 1) {
      this.currentOffset += 1;
      this.imageLoading = true;
    }
    return false;
  }

  previousMedia() {
    if (this.currentOffset > 0) {
      this.currentOffset -= 1;
      this.imageLoading = true;
    }
    return false;
  }

  setLabel(label: string) {
    if (this.label == label) {
      return;
    }
    this.label = label;
    this.mediaList.sizes.forEach(size => {
      if (label === size.label) {
        this.pathPrefix = size.pathPrefix;
        this.pathSuffix = size.pathSuffix;
      }
    });
    this.imageLoading = true;
  }

  onImageLoad(event: Event) {
    this.imageLoading = false;
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(_: Event) {
    this.chkScreenMode();
  }

  chkScreenMode() {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  openFullscreen() {
    if (this.documentElement.requestFullscreen) {
      this.documentElement.requestFullscreen();
    } else if (this.documentElement.mozRequestFullScreen) {
      /* Firefox */
      this.documentElement.mozRequestFullScreen();
    } else if (this.documentElement.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.documentElement.webkitRequestFullscreen();
    } else if (this.documentElement.msRequestFullscreen) {
      /* IE/Edge */
      this.documentElement.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.documentElement.mozCancelFullScreen) {
      /* Firefox */
      this.documentElement.mozCancelFullScreen();
    } else if (this.documentElement.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.documentElement.webkitExitFullscreen();
    } else if (this.documentElement.msExitFullscreen) {
      /* IE/Edge */
      this.documentElement.msExitFullscreen();
    }
  }
}
