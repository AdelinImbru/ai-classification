import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassificationComponent } from './classification/classification.component';
import { authGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'setup',
    loadChildren: () =>
      import(`./setup/setup.module`).then((m) => m.SetupModule),
  },
  {
    path: 'classification',
    component: ClassificationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
