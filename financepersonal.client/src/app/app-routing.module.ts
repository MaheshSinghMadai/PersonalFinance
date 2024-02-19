import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  // {
  //   path: '',  
  //   component: AuthComponent,
  //   loadChildren: () =>
  //     import('./auth/auth.module').then((m) => m.AuthModule),
  // },
  {
    path: '',
    component: MainComponent,
    children: [{
      path:'',  
      loadChildren: () => 
      import('./main/main.module').then((m) => m.MainModule),
    }]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
