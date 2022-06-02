import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-helium',
  templateUrl: './helium.component.html',
  styleUrls: ['./helium.component.scss']
})
export class HeliumComponent implements OnInit {

  devices:any[] = [];
  

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 2
  };
  
  corsAnywhere:string = 'https://cors-anywhere.herokuapp.com/';
  api_key:string = "AI7+GUCBSPDFBiFktUbYHpe+pIH9yEHkohiVXw9rJUg";
  
  
  constructor() { }
  
  ngOnInit(): void {
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


  async getDevicesList(){
    await this.HTTP_Request_GET("devices")
    .then((data) => {
        console.log(data)
        
        for(var i=0; i<data.length; i++){
          this.devices.push(data[i]);
        }

        this.dtTrigger.next(this.devices);

        $('#devicesTable').removeClass('d-none');
        $('#loading_div').addClass('d-none');
    });
  }

  async getDeviceByID(device_id:string){
    await this.HTTP_Request_GET("devices/" + device_id)
    .then((data) => {
        console.log(data)
    });
  }

  async getDeviceByDeveui(device_deveui:string){
    await this.HTTP_Request_GET("devices?dev_eui=" + device_deveui)
    .then((data) => {
        console.log(data)
    });
  }

  async getDeviceByAppEui(device_appeui:string){
    await this.HTTP_Request_GET("devices?app_eui=" + device_appeui)
    .then((data) => {
        console.log(data)
    });
  }

  async getDeviceByAppKey(device_appkey:string){
    await this.HTTP_Request_GET("devices?app_key=" + device_appkey)
    .then((data) => {
        console.log(data)
    });
  }

  async getDeviceEvents(device_id:string){
    await this.HTTP_Request_GET("devices/" + device_id +"/events")
    .then((data) => {
        console.log(data)
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







  

  reloadTable():any {
    // let tabla = $('#devicesTable').DataTable();
    // let tableFilter = tabla.search().valueOf();
    // tabla.search("xx"+tableFilter).draw();
    
    $('#devicesTable').addClass('d-none');
    $('#loading_div').removeClass('d-none');
    
    this.devices = [];
    let tabla = $('#devicesTable').DataTable();
    tabla.destroy();
    
    
    this.getDevicesList();

  }
}
