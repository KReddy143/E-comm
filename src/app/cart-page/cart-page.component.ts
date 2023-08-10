import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, priceSummary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {
  cartData: cart[] | undefined
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private product: ProductService, private router:Router) { }

  ngOnInit(): void {
    this.lodaDetails()
  }

  checkout(){
    this.router.navigate(['/checkout'])
  }

  removeToCart(cartId:number|undefined){
    cartId && this.product.removeToCart(cartId).subscribe((result)=>{
      
      this.lodaDetails();
    })

  }

  lodaDetails(){
    this.product.currentCart().subscribe((result) => {
      this.cartData = result
      let price = 0;
      result.forEach((item) => {
        if(item.quantity){
          price = price + (+item.price* + item.quantity)
        }
      })
      this.priceSummary.price=price;
      this.priceSummary.discount= price/10;
      this.priceSummary.tax=price/10;
      this.priceSummary.delivery=100;
      this.priceSummary.total=price+(price/10)+100-(price/10);
      if(!this.cartData.length){
        this.router.navigate(['/'])
      }
      
      
    })
  }

}
