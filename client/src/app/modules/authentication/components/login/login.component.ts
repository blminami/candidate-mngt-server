import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.authenticationService.logout();
  }

  login(username, password) {
    this.authenticationService.login(username, password)
      .subscribe(() => {
        this.router.navigateByUrl('/');
      })
  }
}
