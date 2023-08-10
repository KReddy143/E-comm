import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { SignUp, cart, login, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {
  showLogin:boolean=true;
  authError:string="";
  constructor(private user:UserService, private product:ProductService) {}

  ngOnInit(): void{
    this.user.userAuthReload();
  }

  signUp(data:SignUp){
    
    this.user.userSingUp(data)

  }

  login(data:login){
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result)=>{
      if(result){
        this.authError="please enter valid details"
      }else{
        setTimeout(() => {
          this.localCartToRemoteCart()
        }, 300);
      }
      
    })

  }
  openSignUp(){
    this.showLogin=false
  }

  openLogin(){
    this.showLogin=true
  }
  localCartToRemoteCart(){

    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId =user && JSON.parse(user).id;
    if(data){
      let cartDataList = JSON.parse(data);
      cartDataList.forEach((product: product,index: number) => {
        let cartData :cart={
          ...product,
          productId:product.id,
          userId
        };

        delete cartData.id;
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result)=>{
            if(result){
              console.warn("Item stored in DB");
              
            }
          })
          if(cartDataList.length===index+1){
            localStorage.removeItem('localCart');
          }
        }, 500);
        
      });
    }
    setTimeout(() => {
      this.product.getCartList(userId)
    }, 2000);
  }
  
}
