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
