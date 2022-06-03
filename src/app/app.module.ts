import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PreloaderComponent } from './pages/dashboard/sections/preloader/preloader.component';
import { ContentComponent } from './pages/dashboard/sections/content/content.component';
import { ControlbarComponent } from './pages/dashboard/sections/controlbar/controlbar.component';
import { FootComponent } from './pages/dashboard/sections/foot/foot.component';
import { SidebarComponent } from './pages/dashboard/sections/sidebar/sidebar.component';
import { TopbarComponent } from './pages/dashboard/sections/topbar/topbar.component';
import { LoginComponent } from './pages/login/login.component';
import { DeviceStatusComponent } from './pages/dashboard/sections/content/device-status/device-status.component';
import { GatewayStatusComponent } from './pages/dashboard/sections/content/gateway-status/gateway-status.component';
import { DeviceControlComponent } from './pages/dashboard/sections/content/device-control/device-control.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeliumComponent } from './pages/dashboard/sections/content/helium/helium.component';
import { HeliumControlComponent } from './pages/dashboard/sections/content/helium-control/helium-control.component';
import { DevicePayloadsComponent } from './pages/dashboard/sections/content/device-payloads/device-payloads.component';

import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PreloaderComponent,
    ContentComponent,
    ControlbarComponent,
    FootComponent,
    SidebarComponent,
    TopbarComponent,
    LoginComponent,
    DeviceStatusComponent,
    GatewayStatusComponent,
    DeviceControlComponent,
    HeliumComponent,
    HeliumControlComponent,
    DevicePayloadsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule, 
    DataTablesModule,
    FontAwesomeModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage())
  ],
  providers: [
    ScreenTrackingService,UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
