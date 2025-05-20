import { Component } from '@angular/core';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = $localize`:Page Title| The platform page title@@homePageTitle:Balafon Back Office`;
  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }
}
