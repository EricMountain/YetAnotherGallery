import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MediaList } from './media';

@Injectable({
  providedIn: 'root'
})
export class MediaListService {
  // private mediaListUrl = 'assets/sample/sample.json'
  private emptyMediaList: MediaList = {
    sizes: [],
    media: [],
  };

  constructor(private http: HttpClient,) { }

  getMediaList(url: string): Observable<MediaList> {
    return this.http.get<MediaList>(url)
              .pipe(
                tap(_ => console.log('fetched media list')),
                catchError(this.handleError<MediaList>('getMediaList', this.emptyMediaList))
              );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {  
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
