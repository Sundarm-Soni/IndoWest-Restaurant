import { Component, OnInit } from '@angular/core';
import {DishService} from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;

  constructor(private dishservice: DishService,private promotionservice: PromotionService) { }

  ngOnInit() {
  this.dish = this.dishservice.getFeaturedDish();
  this.promotion = this.promotionservice.getFeaturedPromotion();
  }

}
