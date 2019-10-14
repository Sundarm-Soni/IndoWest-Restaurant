import { Injectable } from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import {of, Observable} from 'rxjs';
import {  baseURL } from '../shared/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import {delay} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    // return of(Leaders).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leadership').pipe(catchError(this.processHTTPMsgService.handleError));
  }

getLeader(id: String): Observable<Leader> {
  // return of(Leaders.filter((leader) => (leader.id === id))[0]).pipe(delay(2000));
  return this.http.get<Leader>(baseURL + 'leadership/' + id).pipe(catchError(this.processHTTPMsgService.handleError));
}

getFeaturedLeader(): Observable<Leader>{
  //return of(LEADERS.filter(leader => leader.featured)[0]).pipe(delay(2000));
  return this.http.get<Leader[]>(baseURL+'leadership?featured=true')
    .pipe(map(leaders => leaders[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));    
}
}