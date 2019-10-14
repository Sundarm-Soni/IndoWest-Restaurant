import { Injectable } from '@angular/core';
import {Promotion} from '../shared/promotion';
import {PROMOTION} from '../shared/promotions';
import {of, Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { map, catchError } from 'rxjs/operators';
import {  baseURL } from '../shared/baseurl';
import {delay} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
  getPromotion(id: string): Observable<Promotion>{
    //return of(PROMOTION.filter(promo => (promo.id === id))[0]).pipe(delay(2000));
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
}
  getFeaturedPromotion(): Observable<Promotion>{
//return of(PROMOTION.filter(promotion => promotion.featured)[0]).pipe(delay(2000));
    return this.http.get<Promotion[]>(baseURL+'promotions?featured=true')
    .pipe(map(promotions => promotions[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));    
  }
}
