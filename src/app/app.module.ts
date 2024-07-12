import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { MainCardsComponent } from './components/main-cards/main-cards.component';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SidebarModule } from 'ng-sidebar';
import { CallendarComponent } from './components/callendar/callendar.component';
import { RoomTypeFormComponent } from './components/room-type-form/room-type-form.component';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { RoomFormComponent } from './components/room-form/room-form.component';
import { HotelSpecificsComponent } from './components/hotel-specifics/hotel-specifics.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { TypeAvailabilityComponent } from './components/type-availability/type-availability.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ContractCreationComponent } from './components/contract-creation/contract-creation.component';
import { CheckInOutComponent } from './components/check-in-out/check-in-out.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { TourOperatorComponent } from './components/tour-operator/tour-operator.component';
import { TourOperatorCheckOutComponent } from './components/tour-operator-check-out/tour-operator-check-out.component';
import { ChartComponent } from './components/chart/chart.component';
const routes: Routes = [
  
  {
    path: 'userDashboard', component: UserDashboardComponent, children: [
      { path: 'statistics', component: ChartComponent },
      { path: 'tourOperatorsCheckOut', component: TourOperatorCheckOutComponent },
      { path: 'tourOperators', component: TourOperatorComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'checkOut', component: CheckOutComponent },
      { path: 'checkInOut', component: CheckInOutComponent },
      { path: 'createContract', component: ContractCreationComponent },
      { path: 'roomTypeOperations', component: RoomTypeFormComponent },
      { path: 'roomOperations', component: RoomFormComponent },
      { path: 'hotelSpecifics', component: HotelSpecificsComponent },
      { path: 'availabilityByRoomNumber', component: AvailabilityComponent },
      { path: 'availabilityByType', component: TypeAvailabilityComponent },
      { path: 'makeReservation', component: ReservationComponent },
    ]
  },
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'front', component: FrontPageComponent },
  { path: '', redirectTo: 'front', pathMatch: 'full' },
  { path: '**', redirectTo: 'front', pathMatch: 'full' },
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    CarouselComponent,
    FooterComponent,
    MainCardsComponent,
    SignUpComponent,
    FrontPageComponent,
    LogInComponent,
    UserDashboardComponent,
    SideBarComponent,
    CallendarComponent,
    RoomTypeFormComponent,
    RoomFormComponent,
    HotelSpecificsComponent,
    AvailabilityComponent,
    TypeAvailabilityComponent,
    ReservationComponent,
    ContractCreationComponent,
    CheckInOutComponent,
    CustomersComponent,
    CheckOutComponent,
    TourOperatorComponent,
    TourOperatorCheckOutComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NoopAnimationsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SidebarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
