import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-controlbar',
  templateUrl: './controlbar.component.html',
  styleUrls: ['./controlbar.component.scss']
})
export class ControlbarComponent implements OnInit {

  userName:string = "";
  userPass:string = "";

  static getUserName():any{
    return "alcaldiamedellin"
  }

  static getUserPass():any{
    return "alcaldiamedellin"
  }
  
  constructor() {  }
  
  ngOnInit(): void {
  }

}
