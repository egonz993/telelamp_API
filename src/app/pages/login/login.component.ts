import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  

  user:string = "";
  userName:string = "alcaldiamedellin";
  userPass:string = "alcaldiamedellin";
  userID:number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.gotoDashboard(0)
  }

  gotoDashboard(userID:number){
    this.router.navigate(['/dashboard'], {queryParams: {user: userID}});
  }

}
