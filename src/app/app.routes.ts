import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NotFoundErrorComponent } from './not-found-error/not-found-error.component';
import { LoginGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path: 'login', component: LoginComponent },
  {path: 'mainpage', component: MainPageComponent,canActivate:[LoginGuard]},
  {path:'**',component:NotFoundErrorComponent}
];
