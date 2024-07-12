import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_services/token-storage.service';
import { LogInComponent } from '../log-in/log-in.component';



@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
  isLoggedIn = false;
   


  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }
   
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }
  logOut(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  goToFrontDesk(): void {
    this.router.navigate(['userDashboard/availabilityByRoomNumber']);
  }
  
  
  

}
