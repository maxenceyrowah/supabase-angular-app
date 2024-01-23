import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IfAdminDirective } from './directives/if-admin.directive';
import { IfAuthDirective } from './directives/if-auth.directive';

@NgModule({
  declarations: [],
  imports: [CommonModule, IfAdminDirective, IfAuthDirective],
})
export class SharedModule {}
