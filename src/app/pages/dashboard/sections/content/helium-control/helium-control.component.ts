import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { HeliumEvent } from './event';

@Component({
  selector: 'app-helium-control',
  templateUrl: './helium-control.component.html',
  styleUrls: ['./helium-control.component.scss']
})
export class HeliumControlComponent implements OnInit {
 
  raw_events:any = [];
  events:any = [];

  paramsURL:any = [];

  device_id:string = "";
  
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 2
  };


  
  
  corsAnywhere:string = 'https://cors-anywhere.herokuapp.com/';
  api_key:string = "AI7+GUCBSPDFBiFktUbYHpe+pIH9yEHkohiVXw9rJUg";
  
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.paramsURL = params;

      if(typeof this.paramsURL['device_id'] !== "undefined"){
        this.device_id = this.paramsURL['device_id']
      }

    });

    this.reloadTable();

    
  }


  async HTTP_Request_GET(link:string){
    let url = this.corsAnywhere + "https://console.helium.com/api/v1/" + link;
    let params = {
        method: 'GET',
        headers: new Headers({
            'key': this.api_key,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    }

    const response = await fetch(url, params)
    const data = await response.json();
    return data;

  }

  async getDeviceEvents(device_id:string){
    await this.HTTP_Request_GET("devices/" + device_id +"/events")
    .then((data) => {
        this.raw_events = data;
        this.fillTable();
    });
  }

  async getDeviceEvents_UL(device_id:string, format_data:string = 'hex'){
    await this.HTTP_Request_GET("devices/" + device_id +"/events")
    .then((data) => {

        for(var i=0;i<data.length; i++){
            
            if(data[i].category == 'uplink' && (data[i].description == "Unconfirmed data up received" || data[i].description == "Confirmed data up received")){
                var payload_raw = data[i].data.payload;

                if(format_data == 'base64'){
                    payload_raw = payload_raw;
                }

                else if(format_data == 'ascii'){
                    payload_raw = atob(payload_raw);
                }

                else if(format_data == 'hex'){
                    const raw = atob(payload_raw);
                    payload_raw = '';
                    for (let j = 0; j < raw.length; j++) {
                        const hex = raw.charCodeAt(j).toString(16);
                        payload_raw += (hex.length === 2 ? hex : '0' + hex);
                    }

                    payload_raw = payload_raw.toUpperCase()
                }

                console.log(payload_raw)
            }
        }
    });
  }

  

  HTTP_Request_POST(device_id:string, body:any){
    let url = this.corsAnywhere + "https://console.helium.com/api/v1/down/3a0a3c6c-1ba1-4165-a96b-922cc24e0d31/DdiJpZpU7pUlUO-iW4eDYztj8BMn3q5k/" + device_id;
    let params = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
            'key': this.api_key,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    }

    fetch(url, params)
  }


  downlinkSchedule(device_id:string, payload:any, format_data:string){
    
    let payload_raw = "";

    if(format_data == 'ascii'){
        payload_raw = atob(payload)
    }
    else if(format_data == 'hex'){
        payload_raw = btoa(payload.match(/\w{2}/g).map(function(a:any) {
            return String.fromCharCode(parseInt(a, 16));
        }).join(""));
    }
    else if(format_data == 'base64'){
        payload_raw = payload
    }

    let body = {
        "payload_raw": payload_raw,
        "port": 1,
        "confirmed": true
    };
    
    this.HTTP_Request_POST(device_id, body);
    console.log('payload scheduled');
    console.log(body);
  }


  fillTable():any{
    for(var i=0; i<this.raw_events.length; i++){
      var event = new HeliumEvent;

      event.time = this.formatDate(this.raw_events[i].reported_at);
      event.category = this.raw_events[i].category;
      event.sub_category = this.raw_events[i].sub_category;

      switch(this.raw_events[i].category){
        case 'downlink':
          event.data = "Payload: " + this.raw_events[i].data.payload;
          break;

          case 'uplink':
            if(event.sub_category == "uplink_unconfirmed" || event.sub_category == "uplink_confirmed"){
              event.data = "Payload: " + this.raw_events[i].data.payload;
            }
            
            else if(event.sub_category == "uplink_integration_req"){
              event.data = this.raw_events[i].description;
            }
            
            else if(event.sub_category == "uplink_integration_res"){
              event.data = this.raw_events[i].description;
            }
            break;

          case 'uplink_dropped':
            event.data = this.raw_events[i].description;
            break;

          case 'downlink_dropped':
            event.data = this.raw_events[i].description;
            break;

          case 'join_request':
            event.data = "Request to: " + this.raw_events[i].data.hotspot.name;

            break;

          case 'join_accept':
            event.data = "Accepted by: " + this.raw_events[i].data.hotspot.name;
            break;

          default:
            event.data = "no data";
            break;
      }

      this.events.push(event);
    }

    this.dtTrigger.next(this.events);

    
    
    $('#eventsTable').removeClass('d-none');
    $('#loading_div').addClass('d-none');


  }


  formatDate(date?: any):any{
    date = new Date( parseInt(date) )

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
    // let tabla = $('#devicesTable').DataTable();
    // let tableFilter = tabla.search().valueOf();
    // tabla.search("xx"+tableFilter).draw();
    
      $('#eventsTable').addClass('d-none');
      $('#loading_div').removeClass('d-none');
      
      this.events = [];
      let tabla = $('#eventsTable').DataTable();
      tabla.destroy();
      
      this.getDeviceEvents(this.device_id);
  }

  locationBack():any{
    history.back()
  }
}
