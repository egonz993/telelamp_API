import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContentComponent } from './pages/dashboard/sections/content/content.component';
import { DeviceControlComponent } from './pages/dashboard/sections/content/device-control/device-control.component';
import { DevicePayloadsComponent } from './pages/dashboard/sections/content/device-payloads/device-payloads.component';
import { DeviceStatusComponent } from './pages/dashboard/sections/content/device-status/device-status.component';
import { GatewayStatusComponent } from './pages/dashboard/sections/content/gateway-status/gateway-status.component';
import { HeliumControlComponent } from './pages/dashboard/sections/content/helium-control/helium-control.component';
import { HeliumComponent } from './pages/dashboard/sections/content/helium/helium.component';
import { LoginComponent } from './pages/login/login.component';

const routes:Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children:[
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'content'
      },
      {
        path: 'content',
        component: ContentComponent,
        children:[
          {
            path: '',
            pathMatch: 'prefix',
            redirectTo: 'gateways-status'
          },
          {
            path: 'devices-status',
            component: DeviceStatusComponent
          },
          {
            path: 'devices-payloads',
            component: DevicePayloadsComponent
          },
          {
            path: 'devices-control',
            component: DeviceControlComponent
          },
          {
            path: 'gateways-status',
            component: GatewayStatusComponent
          },
          {
            path: 'helium',
            component: HeliumComponent
          },
          {
            path: 'helium-control',
            component: HeliumControlComponent
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
