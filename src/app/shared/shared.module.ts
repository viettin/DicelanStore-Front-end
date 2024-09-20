import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { primeNGModule } from "./primeNG.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const modules = [
  FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ...primeNGModule,
]
@NgModule({
  imports: [
    ...modules
  ],
  exports:[modules]
})
export class SharedCommonModule { }
