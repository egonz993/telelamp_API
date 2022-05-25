import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { table } from 'console';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { LanguageApp } from './tableLanguage';


@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss']
})





export class DeviceStatusComponent implements OnInit {

  username:string = "alcaldiamedellin";
  password:string = "alcaldiamedellin";

  devices:any[];
  updatedDevices:any[];
  now:any;
  yesterday:any;
  page:number;

  firstLoad:boolean = true;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 2
  };

  paramsURL:any = [];


  constructor(private router: Router, private activatedRoute: ActivatedRoute) { 
    this.page = 0;
    this.devices = [];
    this.updatedDevices = [];
    this.now = Math.trunc((Date.now()/1000));
    //this.yesterday = Math.trunc((Date.now()/1000-86400));
    this.yesterday = Math.trunc((Date.now()/1000-1800));  //media hora
    
  }
  
  ngOnInit(): void {

    this.activatedRoute.queryParams
    .subscribe(params => {
      this.paramsURL = params;
      console.log(typeof this.paramsURL['deveui']);

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
    
    this.getDeviceList();
    //this.interval();
  }

  getDeviceList():any{
    let url = "https://au.saas.orbiwise.com/rest/nodes?get_pages=true";

    fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
          }
        }
      )
      .then(response=>response.json())
      .then(data=>{ 
        console.log("Page Length " + data.pages.length)

        for(var i=0; i<data.pages.length; i++){
          this.getDevicesPerPage(data.pages[i].page_state, data.pages.length);
        }

      });
  }


  getDevicesPerPage(page_state:string, pages:number):any{
    let url = "https://au.saas.orbiwise.com/rest/nodes?page_state=" + page_state;

    fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
          }
        }
      )
      .then(response=>response.json())
      .then(data=>{ 
        console.log("page: "+ (this.page+1) + " of " + pages);
        this.devices = [];
        for(var i=0; i<data.length; i++){
          this.devices.push(data[i]);
        }
        
        this.page++;
        if(this.page === pages){
          this.page = 0;
          //console.log(this.initDevices);
          this.devices = this.devices.sort((a:any, b:any) => parseInt(a.comment) - parseInt(b.comment));
          
          if(this.firstLoad){
            this.dtTrigger.next(this.devices);
            this.firstLoad = false;
          }

          $('#devicesTable').removeClass('d-none');
          $('#loading_div').addClass('d-none');

        } 
      });
  }

  getDeviceInfo(deveui:any):any{
    let url = "https://au.saas.orbiwise.com/rest/nodes/"+deveui+"/payloads/ul/latest";

    console.log(url);

    fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
          }
        }
      )
      .then(response=>response.json())
      .then(data=>{ 
        this.showDeviceInfo(data, deveui);
      });
  }

  showDeviceInfo(deviceData:any, deveui:any):any{

    if(deviceData){
      console.log(deviceData);
      Swal.fire({
        title: "<h2>Last data received</h2><h5>"+this.formatDate(deviceData.timestamp)+"</h5>",
        showConfirmButton: false,
        showCloseButton: true,
        showCancelButton: false,
        html:
        "<table class='table' style='font-size: 80%; border: 3px solid #ccc'>"+ 
        "<thead>" +
            "<tr>" +
                "<th>Name</th>" +
                "<th>Value</th>" +
            "</tr>" +
        "</thead>" +
        "<tbody>" +
          "<tr><td>deveui</td><td>"+deveui+"</td></tr>" +
          "<tr><td>rssi</td><td>"+deviceData.rssi+"</td></tr>" +
          "<tr><td>snr</td><td>"+deviceData.snr+"</td></tr>" +
          "<tr><td>freq</td><td>"+deviceData.freq+"</td></tr>" +
          "<tr><td>dr_used</td><td>"+deviceData.dr_used+"</td></tr>" +
          "<tr><td>fcnt</td><td>"+deviceData.fcnt+"</td></tr>" +
          "<tr><td>confirmed</td><td>"+deviceData.confirmed+"</td></tr>" +
          /*"<tr><td>timestamp</td><td>"+this.formatDate(deviceData.timestamp)+"</td></tr>" +*/
          /*"<tr><tr><tr><td>sf_used</td><td>"+deviceData.sf_used+"</td></tr>" +*/
          /*"<tr><td>cr_used</td><td>"+deviceData.cr_used+"</td></tr>"  +*/
          /*"<tr><td>data_format</td><td>"+deviceData.data_format+"</td></tr>" +*/
          /*"<tr><td>decrypted</td><td>"+deviceData.decrypted+"</td></tr>" +*/
          /*"<tr><td>devaddr</td><td>"+deviceData.devaddr+"</td></tr>" +*/
          /*"<tr><td>device_redundancy</td><td>"+deviceData.device_redundancy+"</td></tr>" +*/
          /*"<tr><td>gtw_info</td><td>"+deviceData.gtw_info+"</td></tr>" +*/
          /*"<tr><td>id</td><td>"+deviceData.id+"</td></tr>" +*/
          /*"<tr><td>port</td><td>"+deviceData.port+"</td></tr>" +*/
          /*"<tr><td>session_id</td><td>"+deviceData.session_id+"</td></tr>" +*/
          /*"<tr><td>time_on_air_ms</td><td>"+deviceData.time_on_air_ms+"</td></tr>" +*/
        "</tbody>" +
        "</table>" +
        "<p style='font-size: 1rem'><b>DataFrame</b><br>"+this.base64ToHex(deviceData.dataFrame)+"</p>"
      })
    }
    
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

  base64ToHex(str:any):any {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
  }

  reload():any {
    let tabla = $('#devicesTable').DataTable();
    let tableFilter = tabla.search().valueOf();
    tabla.search("xx"+tableFilter).draw();
  }

  interval():any{
    setInterval(() => {
      this.devices = []
      this.getDeviceList();      
    }, 10*1000);
  }

}
