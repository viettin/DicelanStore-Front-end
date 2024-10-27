import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { primeNGModule } from "./primeNG.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { RouterModule } from "@angular/router";

const modules = [
  FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    ...primeNGModule,
]
@NgModule({
  imports: [
    ...modules
  ],
  providers:[MessageService],
  exports:[modules]
})
export class SharedCommonModule { }
