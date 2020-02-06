import { Component, OnInit } from '@angular/core';
import { FormBuilder ,Validator, Validators, FormGroup,FormArray } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { PasswordValidator } from './shared/password.validator';
import { RegistrationService } from './registration.service';
import { error } from 'util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{

  get userName(){
    return this.registrationForm.get('userName');
  }
  get alternateEmails(){
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmails(){
    this.alternateEmails.push(this.fb.control(''));
  }
  registrationForm:FormGroup;

  constructor(private fb:FormBuilder,private _registrationService:RegistrationService) { }

  onSubmit(){
    //console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value)
      .subscribe(
        
        response => console.log('Success!',response),
        error => console.error('Error' ,error)
      );
  }
  ngOnInit(){
    this.registrationForm=this.fb.group({
      userName:['',[Validators.required,Validators.minLength(3),forbiddenNameValidator(/password/),forbiddenNameValidator(/admin/)]],
      password:[''],
      email:[''],
      subscribe:[false],
      confirmPassword:[''],
      address:this.fb.group({
        city:[''],
        state:[''],
        postal:['']
      }),
      alternateEmails:this.fb.array([])
    },{validators:PasswordValidator});
  
    this.registrationForm.get('subscribe').valueChanges
      .subscribe(checkedValue => {
        const email=this.registrationForm.get('email');
        if(checkedValue){
          email.setValidators(Validators.required);
        }else{
          email.clearValidators();
        }
        email.updateValueAndValidity();
      });

  }

  
  // registrationForm=new FormGroup({
  //   userName:new FormControl('Nikunj'),
  //   password:new FormControl(''),
  //   confirmPassword:new FormControl(''),
  //   address:new FormGroup({
  //     city:new FormControl(''),
  //     state:new FormControl(''),
  //     postal:new FormControl('')
  //   })
  // });


  //set value will give error if all the variable in the formgroup is not set
  //so for only few value to be set we should use patchValue
  loadApiData(){
    this.registrationForm.setValue({
      userName:'Nikunj',
      password:'test',
      confirmPassword:'test',
      address:{
        city:'city',
        state:'state',
        postal:'123456'
      }
    });
  }
  get email(){
    return this.registrationForm.get('email');
  }
}
