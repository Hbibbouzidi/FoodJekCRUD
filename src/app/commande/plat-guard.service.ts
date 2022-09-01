import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';

import { PlatFormComponent } from './plat-form.component';

@Injectable()
export  class PlatDetailGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            alert('Invalid plat Id');
            // start a new navigation to redirect to list page
            this.router.navigate(['/plats']);
            // abort current navigation
            return false;
        };
        return true;
    }
}

@Injectable()
export  class PlatEditGuard implements CanDeactivate<PlatFormComponent> {

    canDeactivate(component: PlatFormComponent): boolean {
        if (component.platForm.dirty) {
            let name = component.platForm.get('name').value || 'New Plat';
            return confirm(`Navigate away and lose all changes to ${name}?`);
        }
        return true;
    }
}
