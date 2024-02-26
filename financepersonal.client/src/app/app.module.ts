import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';  
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { LoggingInterceptor } from './shared/interceptors/logging-interceptor';
import { JwtInterceptor } from './shared/interceptors/jwt-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    MainComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule, 
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    ToastrModule.forRoot(),
    FormsModule,
  
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
