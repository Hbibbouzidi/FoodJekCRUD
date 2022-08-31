import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';

import { RestaurantFormComponent } from './restaurant-form.component';

@Injectable()
export  class RestaurantDetailGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            alert('Invalid restaurant Id');
            // start a new navigation to redirect to list page
            this.router.navigate(['/restaurants']);
            // abort current navigation
            return false;
        };
        return true;
    }
}

@Injectable()
export  class RestaurantEditGuard implements CanDeactivate<RestaurantFormComponent> {

    canDeactivate(component: RestaurantFormComponent): boolean {
        if (component.restaurantForm.dirty) {
            let name = component.restaurantForm.get('name').value || 'New Restaurant';
            return confirm(`Navigate away and lose all changes to ${name}?`);
        }
        return true;
    }
}
