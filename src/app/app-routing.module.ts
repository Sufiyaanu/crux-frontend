import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReplicateRealmsliceComponent } from './realmslice/replicate-realmslice/replicate-realmslice.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WorkflowSchemaComponent } from './workflow/workflow-schema/workflow-schema.component';

const routes: Routes = [
  {path:'', component:WorkflowSchemaComponent},
  {path:'replicate-realmslice', component:ReplicateRealmsliceComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
