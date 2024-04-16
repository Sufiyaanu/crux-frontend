import { Component, inject } from '@angular/core';
import { CommonService } from 'src/services/common.service';
import { CONSTANTS } from 'src/services/constants.service';

@Component({
  selector: 'app-loader',
  template: `
  <div class="row">
    <div *ngIf="_commonService.isLoading" class="loader-overlay">
      <div class="loader-spinner"></div>
      <div class="col-auto">
        <div class="row align-items-center">
          <p class="text-color fs-20 fw-50">{{ constants.PLEASE_WAIT_PROCESSING_YOUR_DATA }}</p>
        </div>
      </div>
    </div>
  </div>
`,
})

export class LoaderComponent {
	public _commonService = inject(CommonService);
  constants = CONSTANTS;
}
