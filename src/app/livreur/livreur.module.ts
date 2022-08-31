import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LivreurListComponent } from "./livreur-list.component";
import { LivreurDetailGuard, LivreurEditGuard } from "./livreur-guard.service";
import { LivreurFormComponent } from "./livreur-form.component";

import { LivreurService } from "./livreur.service";
import { SharedModule } from "../shared/shared.module";

import { MaterialModule } from "../shared/material.module";


@NgModule({
  imports: [
    SharedModule,
    // ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: LivreurListComponent },
      {
        path: "new/",
        canDeactivate: [LivreurEditGuard],
        component: LivreurFormComponent
      },
      {
        path: "edit/:id",
        canDeactivate: [LivreurEditGuard],
        component: LivreurFormComponent
      }
    ])
  ],
  declarations: [
     LivreurListComponent,
     LivreurFormComponent
  ],
  providers: [
    LivreurService, 
    LivreurDetailGuard, 
    LivreurEditGuard,
  ],
  // entryComponents: [MatOption],
  exports: [
    LivreurListComponent,
    LivreurFormComponent,

  ]
})
export class LivreurModule { }
