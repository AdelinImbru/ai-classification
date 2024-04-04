import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ClassificationComponent } from './classification/classification.component';

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
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
