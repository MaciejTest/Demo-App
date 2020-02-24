import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

// PrimeNG
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

// Fake backend
import { fakeBackendProvider } from './helpers';
import { JwtInterceptor, ErrorInterceptor } from './helpers';

import { routing } from './app.routing';
import { LoginComponent } from './components/login/login.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { HomeComponent } from './components/home/home.component';
import { UserViewComponent } from './components/user-view/user-view.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    LoginComponent,
    EditFormComponent,
    HomeComponent,
    UserViewComponent
  ],
  imports: [
    BrowserModule,
    ProgressBarModule,
    MenuModule,
    CommonModule,
    ProgressSpinnerModule,
    DynamicDialogModule,
    BrowserModule.withServerTransition({
      appId: 'app-demo'
    }),
    MultiSelectModule,
    ToastModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserTransferStateModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    CalendarModule,
    TooltipModule,
    TieredMenuModule,
    PanelModule,
    routing,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig
  ],
  entryComponents: [
    EditFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
