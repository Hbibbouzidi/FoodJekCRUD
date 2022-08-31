import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';

import { LivreurFormComponent } from './livreur-form.component';

@Injectable()
export  class LivreurDetailGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            alert('Invalid livreur Id');
            // start a new navigation to redirect to list page
            this.router.navigate(['/livreurs']);
            // abort current navigation
            return false;
        };
        return true;
    }
}

@Injectable()
export  class LivreurEditGuard implements CanDeactivate<LivreurFormComponent> {

    canDeactivate(component: LivreurFormComponent): boolean {
        if (component.livreurForm.dirty) {
            let name = component.livreurForm.get('firstname').value || 'New Livreur';
            return confirm(`Navigate away and lose all changes to ${name}?`);
        }
        return true;
    }
}
