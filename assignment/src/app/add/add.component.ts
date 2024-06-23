import { Component, NgZone, OnInit, Output } from '@angular/core';
import { Felhasznalo } from '../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { NgIf, NgIfContext } from '@angular/common';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  user = new Felhasznalo();
  username: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private appService: AppService
  )
  {
    this.mainForm();
    this.getUser();
  }

  get myForm() {
    return this.createForm.controls;
  }

  submitted = false;
  createForm: FormGroup;
  nameForm: FormGroup;

  ngOnInit(): void {
  }

  mainForm() {
    this.createForm = this.formBuilder.group({
      itemName: ['', [Validators.required]],
      itemCode: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$')]],
      itemType: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[-+]?[0-9]+(\\.[0-9]+)?$')]]
    });
  }


itemList : any = [];

  onSubmit() {
    this.submitted = true;
    if (!this.createForm.valid) {
      alert('Nem megfelelőek az adatok! Minden mezőt ki kell tölteni, a termék ára csak szám lehet.');
      return false;
    } else {

      const itemNameCheck = (JSON.stringify(this.createForm.value.itemName));
      let match = false;
      this.appService.getItem().subscribe((data) => {
        this.itemList = data;
        //alert (itemNameCheck);
      
        for (const item of this.itemList) {
          if (JSON.stringify(item.itemName) === itemNameCheck) {
            match = true;
          }
        }
      
        if(!match){
        this.appService.createItem(this.createForm.value).subscribe(
          (res) => {
            alert('Hozzáadva.');
            this.ngZone.run(() => this.router.navigateByUrl('/list'));
          }, (error) => {
            alert('Hiba' + error);
          });
        }
        else{
          alert('Duplikált termék!');
        return false;
        }
      })
    }
  }

  getUser() {
    if (this.appService.getLoggedInUser().uname == null) {
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
}
