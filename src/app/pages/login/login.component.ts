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
    //this.userSelector()
    
  }


  async userSelector():Promise<any>{
    const { value: user } = await Swal.fire({
      title: 'Select your account',
      input: 'select',
      inputOptions: {
        'telemetrik': 'Telemetrik Test',
        'sabaneta': 'Sabaneta'
      },
      showCancelButton: false,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === 'telemetrik') {
            resolve('')

          } else if (value === 'sabaneta') {
            resolve('')


          } else {

            resolve('Invalid Option)')
          }
        })
      }
    })
    
    

  }


  gotoDashboard(user:string){
    if(user === 'telemetrik'){
      this.user = "telemetrik"
      this.userName = "alcaldiamedellin"
      this.userPass = "alcaldiamedellin"
      this.userID = 0
    }

    if(user === 'sabaneta'){
      this.user = "sabaneta"
      this.userName = "hector.hoyos.ceballos"
      this.userPass = "Lgf^Ha2K$Z"
      this.userID = 1
    }
    
    this.router.navigate(['/dashboard'], {queryParams: {user: this.userID}});
  }

  gotoWeb(url:string){

  }


}
