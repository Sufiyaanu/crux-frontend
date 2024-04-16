import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog'
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ReplicateRealmsliceComponent } from './realmslice/replicate-realmslice/replicate-realmslice.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WorkflowModule } from './workflow/workflow.module';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    LoaderComponent,
    ReplicateRealmsliceComponent,
    PageNotFoundComponent,
  ],
  imports: [
    NgSelectModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    DragDropModule,
    WorkflowModule,
    MultiSelectModule,
    CalendarModule,
    DatePipe,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
