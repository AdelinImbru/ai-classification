import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbSetupComponent } from './db-setup.component';

const routes: Routes = [{ path: 'dbSetup', component: DbSetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DbSetupRoutingModule {}
