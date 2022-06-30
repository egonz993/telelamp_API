import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-device-payloads',
  templateUrl: './device-payloads.component.html',
  styleUrls: ['./device-payloads.component.scss']
})
export class DevicePayloadsComponent implements OnInit {

  username: string = "alcaldiamedellin";
  password: string = "alcaldiamedellin";

  payloads: any = [];
  payloads_ul: any = [];
  payloads_dl: any = [];

  paramsURL: any = [];

  device_id: string = "";

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 2
  };

  decoder:boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.paramsURL = params;

      if (typeof this.paramsURL['user'] !== "undefined") {
        if (this.paramsURL['user'] == 0) {
          this.username = "alcaldiamedellin";
          this.password = "alcaldiamedellin";
        }
        if (this.paramsURL['user'] == 1) {
          this.username = "hector.hoyos.ceballos";
          this.password = "Lgf^Ha2K$Z";
        }
      }

      this.reloadTable()
    });

  }

  getPayloads_ul(): any {
    let url = "https://au.saas.orbiwise.com/rest/nodes/" + this.paramsURL['deveui'] + "/payloads/ul?data_format=hex";
    let params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
      }
    }

    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        this.payloads = data;
        this.dtTrigger.next(this.payloads);


        $('#payloadsTable').removeClass('d-none');
        $('#loading_div').addClass('d-none');

      });
  }


  getPayloads_dl(): any {
    let url = "https://au.saas.orbiwise.com/rest/nodes/" + this.paramsURL['deveui'] + "/payloads/dl?data_format=hex&sort_by_date=false";
    let params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
      }
    }

    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.payloads_dl = data;
        this.fillTablePayloads();
      });

  }

  fillTablePayloads(): any {
    for (var i = 0; i < this.payloads_ul.length; i++) {
      this.payloads_ul[i]['payload'] = this.payloads_ul[i]['dataFrame'];
      this.payloads_ul[i]['category'] = 'uplink';

      this.payloads.push(this.payloads_ul[i]);

    }

    for (var i = 0; i < this.payloads_dl.length; i++) {
      this.payloads_dl[i]['payload'] = this.payloads_dl[i]['data'];
      this.payloads_dl[i]['category'] = 'downlink';

      this.payloads.push(this.payloads_dl[i]);
    }
  }



  UnixTimestamp(date?: any) {
    date = new Date(date).getTime();
    date = Math.trunc(date / 1000);
    return date;
  }

  switchDecoder(){
    this.decoder = !this.decoder;
  }

  Decoder(payload:string, rssi:number){
      let dataFrame = payload

      /*let active_power = parseInt(data.dataFrame.substring(28,32), 16);*/
      let voltage = Math.trunc(parseInt(dataFrame.substring(20, 24), 16) / 100);
      let current = Math.trunc(parseInt(dataFrame.substring(24, 28), 16));
      let active_power = Math.trunc(voltage * current / 1000);
      let power_factor = Math.trunc(parseInt(dataFrame.substring(32, 36), 16) / 1000);
      
      let temperature = Math.trunc(parseInt(dataFrame.substring(36, 40), 16) / 100);
      let illuminance = Math.trunc(parseInt(dataFrame.substring(40, 44), 16));
      
      let working_mode = this.formatWorkingMode(dataFrame.substring(46, 48));
      let relay_position = this.formatRelayPosition(dataFrame.substring(46, 48));
      let daylight = this.formatDaylight(dataFrame.substring(46, 48));

      if(!this.decoder)
        return(payload)
      
      return  rssi+" dBm | " +
              voltage+" V | " +
              current+" mA | " +
              active_power+" W | PF: " +
              power_factor+"% | " +
              temperature+" °C | " +
              illuminance+" Lux | " +
              working_mode+" | " +
              relay_position+" | " +
              daylight;
  }

  formatDate(date?: any): any {
    date = this.UnixTimestamp(date);
    date = new Date(date * 1000);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let meridian;

    month < 10 ? month = "0" + month : month;
    day < 10 ? day = "0" + day : day;
    hours < 10 ? hours = "0" + hours : hours;
    minutes < 10 ? minutes = "0" + minutes : minutes;


    date = year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds;
    return date;
  }

  formatWorkingMode(status:any):any{
    status = parseInt(status);
    if(status === 10) return 'Manual';
    if(status === 11) return 'Manual';
    if(status === 12) return 'Automatic';
    if(status === 13) return 'Automatic';
    if(status === 14) return 'Manual';
    if(status === 15) return 'Manual';
    if(status === 16) return 'Automatic';
    if(status === 17) return 'Automatic';
    
    if(status === 20) return 'Manual';
    if(status === 21) return 'Manual';
    if(status === 22) return 'Automatic';
    if(status === 23) return 'Automatic';
    if(status === 24) return 'Manual';
    if(status === 25) return 'Manual';
    if(status === 26) return 'Automatic';
    if(status === 27) return 'Automatic';
  }

  formatDaylight(status:any):any{
    status = parseInt(status);
    if(status === 10) return 'Night';
    if(status === 11) return 'Night';
    if(status === 12) return 'Night';
    if(status === 13) return 'Night';
    if(status === 14) return 'Day';
    if(status === 15) return 'Day';
    if(status === 16) return 'Day';
    if(status === 17) return 'Day';
    
    if(status === 20) return 'Night';
    if(status === 21) return 'Night';
    if(status === 22) return 'Night';
    if(status === 23) return 'Night';
    if(status === 24) return 'Day';
    if(status === 25) return 'Day';
    if(status === 26) return 'Day';
    if(status === 27) return 'Day';
  }

  formatRelayPosition(status:any):any{
    status = parseInt(status);
    if(status === 10) return 'Off';
    if(status === 11) return 'On';
    if(status === 12) return 'Off';
    if(status === 13) return 'On';
    if(status === 14) return 'Off';
    if(status === 15) return 'On';
    if(status === 16) return 'Off';
    if(status === 17) return 'On';
    
    if(status === 20) return 'Off';
    if(status === 21) return 'On';
    if(status === 22) return 'Off';
    if(status === 23) return 'On';
    if(status === 24) return 'Off';
    if(status === 25) return 'On';
    if(status === 26) return 'Off';
    if(status === 27) return 'On';
  }



  reloadTable(): any {
    $('#payloadsTable').addClass('d-none');
    $('#loading_div').removeClass('d-none');

    this.payloads = [];
    let tabla = $('#payloadsTable').DataTable();
    tabla.destroy();

    this.getPayloads_ul();

  }

  locationBack(): any {
    history.back()
  }

}
