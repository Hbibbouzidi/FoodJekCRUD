import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RestaurantListComponent } from "./restaurant-list.component";
import { RestaurantDetailGuard, RestaurantEditGuard } from "./restaurant-guard.service";
import { RestaurantFormComponent } from "./restaurant-form.component";

import { RestaurantService } from "./restaurant.service";
import { SharedModule } from "../shared/shared.module";

import { MaterialModule } from "../shared/material.module";


@NgModule({
  imports: [
    SharedModule,
    // ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: RestaurantListComponent },
      {
        path: "new/",
        canDeactivate: [RestaurantEditGuard],
        component: RestaurantFormComponent
      },
      {
        path: "edit/:id",
        canDeactivate: [RestaurantEditGuard],
        component: RestaurantFormComponent
      }
    ])
  ],
  declarations: [
    RestaurantListComponent,
     RestaurantFormComponent
  ],
  providers: [
    RestaurantService, 
    RestaurantDetailGuard, 
    RestaurantEditGuard,
  ],
  // entryComponents: [MatOption],
  exports: [
    RestaurantListComponent,
    RestaurantFormComponent,

  ]
})
export class RestaurantModule { }
