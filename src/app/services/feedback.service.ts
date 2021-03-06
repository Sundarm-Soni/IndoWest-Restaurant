import { Injectable } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { of,observable, Observable} from 'rxjs';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }
  submitFeedback(feedback: Feedback): Observable<Feedback>{
   const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
        
      };
      return this.http.post<Feedback>(baseURL + 'feedback/' ,feedback, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));  
  }
}



