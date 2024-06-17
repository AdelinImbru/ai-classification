import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbSetupComponent } from './db-setup/db-setup.component';
import { MappingSetupComponent } from './mapping-setup/mapping-setup.component';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'dbsetup', component: DbSetupComponent, canActivate: [AuthGuard] },
  {
    path: 'mappingsetup',
    component: MappingSetupComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
