import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MappingSetupComponent } from './mapping-setup.component';

const routes: Routes = [{ path: 'mappingSetup', component: MappingSetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingSetupRoutingModule { }
