import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  paramsURL:any = [];
  user:any = 0;
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.paramsURL = params;
        //console.log(typeof this.paramsURL['deveui']);
        
        if(typeof this.paramsURL['user'] !== "undefined"){
          this.user = this.paramsURL['user'];
        }
      });
  }

}
