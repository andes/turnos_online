import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { DisclaimersProvider } from 'src/providers/auth/disclaimer';
import { DisclaimerPage } from './disclaimers/accept-disclaimer';
import { OrganizacionesPage } from './organizaciones/organizaciones';
import { AdsModule } from 'src/app/ads/ads.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    AdsModule
  ],
  declarations: [
    DisclaimerPage,
    LoginPage,
    OrganizacionesPage
  ],
  providers: [
    DisclaimersProvider
  ],

})
export class LoginPageModule { }
