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
  userName:string = "";
  userPass:string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userSelector()
    
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
    
    if(user === 'telemetrik'){
      this.user = "telemetrik"
      this.userName = "alcaldiamedellin"
      this.userPass = "alcaldiamedellin"

      this.router.navigate(['/dashboard'], {queryParams: {user: 0}});
    }

    if(user === 'sabaneta'){
      this.user = "sabaneta"
      this.userName = "hector.hoyos.ceballos"
      this.userPass = "Lgf^Ha2K$Z"

      this.router.navigate(['/dashboard'], {queryParams: {user: 1}});
    }

  }


  static getUserName(): string {
    return "alcaldiamedellin"
  }

       static getUserPass(): string {
    return "alcaldiamedellin"
  }

}
