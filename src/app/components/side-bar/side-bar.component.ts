import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  role!: any;
  username !: any;
  myScriptElement!:HTMLScriptElement;
  constructor(private loginService: AuthService,private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('logedInUsername');
    this.role = localStorage.getItem('logedInRole');

  }
  logOut(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/front']);
  }
 
}
