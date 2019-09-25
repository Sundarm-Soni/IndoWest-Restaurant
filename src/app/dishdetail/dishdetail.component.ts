import { Component, OnInit,Input, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location}  from '@angular/common';
import{Dish} from '../shared/dish';
import{DISHES} from '../shared/dishes';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility',[
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
          transform: 'scale(0.5)',
          opacity: 0
  })),
  transition('* => *', animate('0.5s ease-in-out'))
])
  ]
})
export class DishdetailComponent implements OnInit {
  commentsForm: FormGroup;
  errMess: string;  
  comments: Comment;
  dish: Dish;
  date = new Date().toISOString();
  dishIds: string[];
  prev: string;
  next: string;
  dishcopy: Dish; 
  visibility= 'shown';

  @ViewChild('cform') commentFormDirective;
  formErrors = {
    'author': '',
    'comment': ''
    };

validationMessages = {
    'author':{
      'required': 'Author name is required.',
      'minlength': 'Author name must be at least 2 characters long',
      'maxlength': 'Author name cannot be more than 25 characters long'
      },
      'comment': {
        'required': 'Comment is required.',
        'minlength': 'Comment must be at least 4 characters long',
        'maxlength': 'Comment must be at least 100 characters long'
      },
      
    };

  constructor(private dishService: DishService, private location: Location, private route: ActivatedRoute,private comm: FormBuilder, @Inject('BaseURL') private BaseURL) {
    this.createCommForm();
   }

  ngOnInit() {
    //const id = this.route.snapshot.params['id']; params here is observable(this is the old way of routing through params)
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
    .subscribe((dish) => {this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
    errmess => this.errMess = <any>errmess );
  }

  
createCommForm(){
    this.commentsForm = this.comm.group({
          author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
          rating: 5,
          comment: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
          date: this.date
  });
  this.commentsForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
}
onValueChanged(data?: any){
  if(!this.commentsForm){ return; }
  const form = this.commentsForm;
  for (const field in this.formErrors) {
    if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
              const messages = this.validationMessages[field];
              for(const key in control.errors){
                if(control.errors.hasOwnProperty(key)){
                  this.formErrors[field] += messages[key] + ''; 
                }
              }
            }
          }
        }
      }
      
      onSubmit() {
        this.comments = this.commentsForm.value;
        //this.dish.comments.push(this.comments);
        console.log(this.comments);
        this.dishcopy.comments.push(this.comments);
        this.dishService.putDish(this.dishcopy)
        .subscribe(dish => {
            this.dish = dish; this.dishcopy = dish;
        },
        errmess => {this.dish = null; this.dishcopy = null; this.dishcopy = null, this.errMess = <any>errmess; }
        )
        this.commentFormDirective.resetForm();
        this.commentsForm.reset({
              author: '',
              rating: 5,
              comment: '',
              date: null
              
          });
          
      }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]; 
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];  
}
  goBack(): void{
    this.location.back(); 
  }

}
