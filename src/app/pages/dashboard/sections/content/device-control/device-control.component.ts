import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-device-control',
  templateUrl: './device-control.component.html',
  styleUrls: ['./device-control.component.scss']
})
export class DeviceControlComponent implements OnInit {

  username:string = "alcaldiamedellin";
  password:string = "alcaldiamedellin";


  devices:any[];
  page:number;
  deveui:any;

  paramsURL:any = [];



  constructor(private router: Router, private activatedRoute: ActivatedRoute) { 
    this.deveui ="";
    this.devices = []
    this.page = 0;

   }

  ngOnInit(): void {
    this.init();

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

        //Este debe ir al final, ya que es el que llama a btn_select()
        if(typeof this.paramsURL['deveui'] !== "undefined"){
          $("#deveui").text(this.paramsURL['deveui']);
          this.btn_select();
        }
      });
      
    //console.log(this.router.url);
  }

  searchDevice():any{
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
        //console.log("Page Length " + data.pages.length)

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
        //console.log("page: "+ (this.page+1) + " of " + pages);
        for(var i=0; i<data.length; i++){
          this.devices.push(data[i]);
        }
        
        this.page++;
        if(this.page === pages){
          this.page = 0;
          //console.log(this.devices);
          this.btn_select_checkingDevice();
        } 
      });
  } 

  init():any{
    let voltage = 0;
    let current = 0;
    let active_power = 0;
    let power_factor = 0;

    let timestamp = 0;
    let working_mode = 0;
    let relay_position = 0;
    let daylight = 0;

    let illuminance = 0;
    let temperature = 0;


    $('#timestamp').text(timestamp);
    $('#working_mode').text(working_mode);
    $('#active_power').text(active_power);
    $('#power_factor').text(power_factor);

    $('#voltage').text(voltage);
    $('#current').text(current);
    $('#relay_position').text(relay_position);
    $('#daylight').text(daylight);

    $('#illuminance').text(illuminance);
    $('#temperature').text(temperature);
  }

  
  btn_search():any{
    alert("btn_search");
  }


  btn_select():any{
    this.searchDevice();
    $("#device_info").addClass("d-none");
    $("#btn_select").prop( "disabled", true );
    $("#btn_search").prop( "disabled", true );
  }

  btn_select_checkingDevice():any{

    if($("#deveui").text()?.toString().length === 16){
      let result = false;
      for (let i=0; i<this.devices.length; i++){
        if(this.devices[i].deveui === $("#deveui").text()?.toString().toLocaleLowerCase())
          result = true;
      }

      if(result){
        this.deveui = $("#deveui").text()?.toString().toLocaleLowerCase();
        $("#device_info").removeClass("d-none");
        $("#btn_select").prop( "disabled", true );
        $("#btn_search").prop( "disabled", true );

        this.getDeviceParams();
      }else{
        Swal.fire("Device not found");
        $("#btn_select").prop( "disabled", false );
        $("#btn_search").prop( "disabled", false );
      }
    }else{
      Swal.fire('Deveui not valid');
      $("#btn_select").prop( "disabled", false );
      $("#btn_search").prop( "disabled", false );
    }

  }

  getDeviceParams():any{

    let voltage = 0;
    let current = 0;
    let active_power = 0;
    let power_factor = 0;

    let timestamp = 0;
    let working_mode = 0;
    let relay_position = 0;
    let daylight = 0;

    let illuminance = 0;
    let temperature = 0;


    let url = "https://au.saas.orbiwise.com/rest/nodes/"+this.deveui+"/payloads/ul/latest?data_format=hex";

    fetch(url,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
          }
        }
      )
      .then(response=>response.json())
      .then(data=>{ 
        //console.log(data.dataFrame);

        timestamp =  this.formatTimestamp(parseInt(data.dataFrame.substring(0,8),16));

        voltage = Math.trunc(parseInt(data.dataFrame.substring(20,24), 16)/100);
        current = Math.trunc(parseInt(data.dataFrame.substring(24,28), 16));
        /*active_power = parseInt(data.dataFrame.substring(28,32), 16);*/
          active_power = Math.trunc(voltage*current/1000);
        power_factor = Math.trunc(parseInt(data.dataFrame.substring(32,36), 16)/1000);

        temperature = Math.trunc(parseInt(data.dataFrame.substring(36,40), 16)/100);
        illuminance = Math.trunc(parseInt(data.dataFrame.substring(40,44), 16));

        working_mode = this.formatWorkingMode(data.dataFrame.substring(46,48));
        relay_position = this.formatRelayPosition(data.dataFrame.substring(46,48));
        daylight = this.formatDaylight(data.dataFrame.substring(46,48));


        $('#timestamp').text(timestamp);
        $('#working_mode').text(working_mode);
        $('#active_power').text(active_power);
        $('#power_factor').text(power_factor);
    
        $('#voltage').text(voltage);
        $('#current').text(current);
        $('#relay_position').text(relay_position);
        $('#daylight').text(daylight);
    
        $('#illuminance').text(illuminance);
        $('#temperature').text(temperature);
      });


  }

  //State
  btn_on():any{
    this.send_downlink("ad");
    Swal.fire("Succesfully send: [AD]");
  }

  btn_off():any{
    this.send_downlink("ac");
    Swal.fire("Succesfully send: [AC]");
  }

  btn_auto():any{
    this.send_downlink("b7");
    Swal.fire("Succesfully send: [B7]");
  }




  //Dimmer
  btn_dim100():any{
    this.send_downlink("c464");
    Swal.fire("Succesfully send: [C4 64]");
  }

  btn_dim75():any{
    this.send_downlink("c44b");
    Swal.fire("Succesfully send: [C4 4B]");
  }

  btn_dim50():any{
    this.send_downlink("c432");
    Swal.fire("Succesfully send: [C4 32]");
  }

  btn_dim25():any{
    this.send_downlink("c419");
    Swal.fire("Succesfully send: [C4 19]");
  }

  //Other Functions
  btn_reset():any{
    this.send_downlink("f9");
    Swal.fire("Succesfully send: [F9]");
  }

  btn_request_status():any{
    this.send_downlink("e1");
    Swal.fire("Succesfully send: [E1]");
  }


  //Custom Downlink
  btn_custom_downlink():any{
    let payload = $("#custom_payload").val()!.toString();
    let error = 0;

    if(payload.length % 2 !== 0)
      error++;

      var re = /[0-9A-Fa-f]/g;
      if(!re.test(payload))
        error++;

    if(error===0){
      this.send_downlink(payload);
      Swal.fire("Succesfully send [" + payload + "]")
    }
    else
      Swal.fire("Invalid hex data")

  }


  send_downlink(payload:string){
    let url = "https://au.saas.orbiwise.com/rest/nodes/"+this.deveui+"/payloads/dl?port=1&data_format=hex";

    fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(this.username + ":" + this.password),
          },
          body: payload
        }
      );
  }


  formatTimestamp(date?: any):any{
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

    hours<10 ? hours = "0" + hours : hours;
    minutes<10 ? minutes = "0" + minutes : minutes;


    date = year + "/" + month + "/" + day + " - " + hours + ":" + minutes;
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


  

  locationBack():any{
    history.back()
  }

}
