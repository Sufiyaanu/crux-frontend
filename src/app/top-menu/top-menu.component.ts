import { Component, Inject, LOCALE_ID } from '@angular/core';

interface Locale {
  localeCode: string;
  label: string;
}

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent {
  selectedLocale: string = this.locale;
  isDarkTheme:boolean = false;

  locales: Locale[] = [
    { localeCode: "en-US", label: "English" },
    { localeCode: "hi", label: "Hindi" },
    { localeCode: "ar", label: "Arabic" },
  ];

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  ngOnInit(){
    this.currentTheme();
  }
  
  navigateToLocale(localeCode: string): void {
    this.selectedLocale = this.locale;
    const url = `/${localeCode}`; 
    window.location.href = url;  // Change the window location directly
  }


  currentTheme(){
    let currentTheme = localStorage.getItem('THEME') || 'light';
    this.isDarkTheme = currentTheme == 'dark';
    document.documentElement.setAttribute('data-theme',currentTheme)
  }

  
  changeTheme(){
    let theme = localStorage.getItem('THEME') || 'light';
    if(theme == 'dark'){
      this.isDarkTheme = false;
      localStorage.setItem('THEME','light')
      document.documentElement.setAttribute('data-theme','light')
    }else{
      this.isDarkTheme = true;
      localStorage.setItem('THEME','dark')
      document.documentElement.setAttribute('data-theme','dark')
    }
  }
}
