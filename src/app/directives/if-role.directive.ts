import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  standalone: true,
  selector: '[appIfRole]'
})
export class IfRoleDirective implements OnChanges {
  @Input('appIfRole') requiredRole?: 'admin' | 'user';

  constructor(
    private auth: AuthService,
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.requiredRole && this.auth.hasRole(this.requiredRole)) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
