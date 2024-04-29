import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbSetupComponent } from './db-setup/db-setup.component';
import { MappingSetupComponent } from './mapping-setup/mapping-setup.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  { path: 'dbsetup', component: DbSetupComponent, canActivate: [authGuard] },
  {
    path: 'mappingsetup',
    component: MappingSetupComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
