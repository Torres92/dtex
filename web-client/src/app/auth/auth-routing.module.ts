import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* COMPONENTS */
import { LoginComponent } from './login/login.component'

const authRoutes: Routes = [
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
