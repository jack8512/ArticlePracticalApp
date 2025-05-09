import { UserStore } from './../services/user-store.service';
import { Component } from '@angular/core';
import { DefaultUrlSerializer, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  standalone:true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthService, private userService: UserService, private userStore:UserStore){}

  isLoggedIn$: Observable<boolean> =of(false)
  // isLoggedIn: boolean=true
  userName:string=''
  ngOnInit() {
    this.authService.checkLoginStatus()
    this.isLoggedIn$=this.authService.isLoggedIn$
    this.userService.getUser().pipe(
      tap((res)=>{
        const user=res.body
        if(user){
          this.userName=`${user.first_name}`
          this.userStore.setUser(user)
        }
      })
    ).subscribe()
  }
  logout(){
    this.authService.logout()
  }

}
