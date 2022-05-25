import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-gateway-status',
  templateUrl: './gateway-status.component.html',
  styleUrls: ['./gateway-status.component.scss']
})
export class GatewayStatusComponent implements OnInit {

  username:string = "alcaldiamedellin";
  password:string = "alcaldiamedellin";

  dtOptions: DataTables.Settings;
  dtTrigger: Subject<any> = new Subject<any>();

  gateways:any[];
  now:any;
  yesterday:any;

  paramsURL:any = [];

  
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { 
    this.gateways = [];
    this.now = Math.trunc((Date.now()/1000));
    this.yesterday = Math.trunc((Date.now()/1000-60));  //un minuto

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20
    };
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.paramsURL = params;
        //console.log(typeof this.paramsURL['deveui']);
        
        if(typeof this.paramsURL['user'] !== "undefined"){
          if (this.paramsURL['user'] == 0){
            this.username = "alcaldiamedellin";
            this.password = "alcaldiamedellin";
          }
          if (this.paramsURL['user'] == 1){
            this.username = "hector.hoyos.ceballos";
            this.password = "Lgf^Ha2K$Z";
          }
        }
      });
    this.getGatewaysList();
  }

  getGatewaysList():any{
    let url = "https://au.saas.orbiwise.com/rest/gateways";
    let params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
      }
    }

    fetch(url, params)
      .then(response=>response.json())
      .then(data=>{ 
        //console.log(data)
        this.gateways = data;
        this.dtTrigger.next(this.gateways);
      });
  }


  UnixTimestamp(date?: any) {
    date = new Date(date).getTime();
    date = Math.trunc(date/1000);
    return date;
  }

  formatDate(date?: any):any{
    date = this.UnixTimestamp(date);
    date = new Date(date * 1000);

    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let meridian;

    month<10 ? month = "0" + month : month;
    day<10 ? day = "0" + day : day;

    hours>=12 ? meridian = "p.m." : meridian = "a.m.";
    
    hours > 12 ? hours -= 12 : hours;
    hours<10 ? hours = "0" + hours : hours;
    minutes<10 ? minutes = "0" + minutes : minutes;


    date = year + "/" + month + "/" + day + " " + hours + ":" + minutes + " " + meridian;
    return date;
  }

}
