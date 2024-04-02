import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbSetupComponent } from './db-setup/db-setup.component';
import { MappingSetupComponent } from './mapping-setup/mapping-setup.component';

const routes: Routes = [
  { path: 'dbsetup', component: DbSetupComponent },
  { path: 'mappingsetup', component: MappingSetupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
