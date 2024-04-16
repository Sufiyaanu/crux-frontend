import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
  <div class="page-not-found">
    <h1>404: Page Not Found!</h1>
    <p>The page you are looking for cannot be found or you do not have access to this page</p>
</div>
<div>
    <img src="assets/img/error.gif" [routerLink]="['']" alt="Error Image" class="error">
</div>
  `,
  
})
export class PageNotFoundComponent {

}
