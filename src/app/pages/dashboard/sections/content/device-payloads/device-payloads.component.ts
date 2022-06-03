import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-device-payloads',
  templateUrl: './device-payloads.component.html',
  styleUrls: ['./device-payloads.component.scss']
})
export class DevicePayloadsComponent implements OnInit {

  username:string = "alcaldiamedellin";
  password:string = "alcaldiamedellin";
 
  payloads:any = [];
  payloads_ul:any = [];
  payloads_dl:any = [];

  paramsURL:any = [];

  device_id:string = "";
  
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 2
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.paramsURL = params;

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

      this.reloadTable()
    });
    
  }

  getPayloads_ul():any{
    let url = "https://au.saas.orbiwise.com/rest/nodes/"+this.paramsURL['deveui']+"/payloads/ul?data_format=hex";
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
        console.log(data)
        this.payloads_ul = data;
        this.getPayloads_dl();
      });
  }
 

  getPayloads_dl():any{
    let url = "https://au.saas.orbiwise.com/rest/nodes/"+this.paramsURL['deveui']+"/payloads/dl?data_format=hex";
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
        console.log(data)
        this.payloads_dl = data;
        this.fillTablePayloads();
      });

  }

  fillTablePayloads():any{
    for(var i=0; i<this.payloads_ul.length; i++){
      this.payloads_ul[i]['payload'] = this.payloads_ul[i]['dataFrame'];
      this.payloads_ul[i]['category'] = 'uplink';

      this.payloads.push(this.payloads_ul[i]);

    }

    for(var i=0; i<this.payloads_dl.length; i++){
      this.payloads_dl[i]['payload'] = this.payloads_dl[i]['data'];
      this.payloads_dl[i]['category'] = 'downlink';

      this.payloads.push(this.payloads_dl[i]);
    }

    this.payloads = this.payloads.sort((a:any, b:any) => parseInt(a.comment) - parseInt(b.comment));
    this.dtTrigger.next(this.payloads);


    $('#payloadsTable').removeClass('d-none');
    $('#loading_div').addClass('d-none');
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



  
  reloadTable():any {
      $('#payloadsTable').addClass('d-none');
      $('#loading_div').removeClass('d-none');
      
      this.payloads = [];
      let tabla = $('#payloadsTable').DataTable();
      tabla.destroy();

      this.getPayloads_ul();
      
  }

  locationBack():any{
    history.back()
  }
 
}
