import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PlatListComponent } from "./plat-list.component";
import { PlatDetailGuard, PlatEditGuard } from "./plat-guard.service";
import { PlatFormComponent } from "./plat-form.component";

import { PlatService } from "./plat.service";
import { SharedModule } from "../shared/shared.module";

import { MaterialModule } from "../shared/material.module";


@NgModule({
  imports: [
    SharedModule,
    // ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: PlatListComponent },
      {
        path: "new/",
        canDeactivate: [PlatEditGuard],
        component: PlatFormComponent
      },
      {
        path: "edit/:id",
        canDeactivate: [PlatEditGuard],
        component: PlatFormComponent
      }
    ])
  ],
  declarations: [
    PlatListComponent,
    PlatFormComponent
  ],
  providers: [
    PlatService, 
    PlatDetailGuard, 
    PlatEditGuard,
  ],
  // entryComponents: [MatOption],
  exports: [
    PlatListComponent,
    PlatFormComponent,

  ]
})
export class PlatModule { }
