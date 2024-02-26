import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',  
    component: AuthComponent,
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'main',
    component: MainComponent,
    children: [{
      path:'',  
      canActivate: [authGuard],
      loadChildren: () => 
      import('./main/main.module').then((m) => m.MainModule),
    }]
  },
  {
    path: '**',
    redirectTo: ''
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
