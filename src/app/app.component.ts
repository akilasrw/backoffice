import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from './core/constants/constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'aeroclub-scs-backoffice-client';

  constructor(
    public translate: TranslateService,
  ) {
    translate.addLangs(['en', 'vi']);
    var userSelectedLanguage = localStorage.getItem(Constants.LANGUAGE)
    if (userSelectedLanguage == null) {
      userSelectedLanguage = "en";
    }
    translate.setDefaultLang(userSelectedLanguage);
    translate.currentLang = userSelectedLanguage;
  }
  ngOnInit(): void {
   
  }

  switchLang(lang: string) {
    localStorage.setItem('UserSelectedLanguage', lang);
    this.translate.use(lang);
  }


}
