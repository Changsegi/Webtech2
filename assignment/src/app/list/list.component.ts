import { Component, OnInit } from '@angular/core';
import { Felhasznalo } from '../model/user';
import { Router } from '@angular/router';
import { AppService } from '../app.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  Item: any = [];
  user = new Felhasznalo();
  username: string;

  constructor(private router: Router,
              private appService: AppService)
  {
    this.getItem();
    this.getUser();
  }

  ngOnInit(): void {
  }

  getItem() {
    this.appService.getItem().subscribe((data) => {
      this.Item = data;
    });
  }

  getUser(){

    if (this.appService.getLoggedInUser().uname == null)
    {
      this.router.navigate(['/login']);
    }

    this.user = this.appService.getLoggedInUser();
    this.username = JSON.stringify(this.user.uname);
  }

  logout(){
    this.user = new Felhasznalo();
    this.appService.setLoggedInUser(this.user);
    this.router.navigate(['/login']);
  }
  back(){
    this.router.navigate(['/add']);
  }
}
