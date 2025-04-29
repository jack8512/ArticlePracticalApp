import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';
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
  constructor(private authService: AuthService, private userService: UserService){}

  isLoggedIn: boolean =false
  userName:string=''
  ngOnInit() {
    this.authService.isLoggedIn().pipe(
      tap(status=>this.isLoggedIn=status)
    ).subscribe()
    this.userService.getUser().pipe(
      tap((res)=>{
        const user=res.body
        if(user){
          this.userName=`${user.first_name}`
        }
      })
    ).subscribe()
  }
  logout(){
    this.authService.clearToken()
    this.authService.clearUser()
  }
  // isLoggedIn$!:Observable<boolean>
  // ngOnInit(): void {
  //   this.isLoggedIn$=this.authService.isLoggedIn$()
  // }
  // logout(){
  //   this.authService.logout()
  // }
}
