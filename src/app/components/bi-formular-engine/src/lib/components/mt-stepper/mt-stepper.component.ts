import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { set } from 'lodash-es';
import { Subscription } from 'rxjs';
import { IComponent } from 'src/app/components';

import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-stepper',
  templateUrl: './mt-stepper.component.html',
  styleUrls: ['./mt-stepper.component.scss']
})
export class MtStepperComponent extends MtBaseComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper;
  subscriptionNextStep: Subscription;

  ngOnInit(): void {
    this.registerNextStep();
  }

  ngOnDestroy() {
    this.unregisterNextStep();
  }

  get selectedIndex(): number {
    if (this.comp.stepperProps && typeof this.comp.stepperProps.selectedIndex !== 'undefined') return this.comp.stepperProps.selectedIndex
    return 0
  }

  set selectedIndex(val: number) {
    this.comp.stepperProps.selectedIndex = val
  }


  selectionChange(selection: StepperSelectionEvent) {
    if (this.comp.stepperProps?.selectionChange) {
      this.comp.stepperProps.selectionChange(this.sm, this.comp, selection.selectedIndex)
    }

  }

  editable(ind: number): boolean {
    return this.sm.Errors.length === 0 && ind <= this.selectedIndex
  }

  getCompleted(comp: IComponent): boolean {
    // if (comp.stepperProps && comp.stepperProps.completed) return comp.stepperProps.completed
    return false
  }

  nextStep() {
    // this.stepper.selected.completed = true;
    const comp: IComponent = this.comp.children[this.selectedIndex]
    if (comp) {
      if (this.comp.stepperProps?.validateSteps) {
        this.sm.validateAll(comp)
        if (this.sm.Errors.length > 0) {
          return
        }
      }
      this.stepper.next();
      set(comp, 'stepperProps.completed', true)

    }

  }

  registerNextStep() {
    this.subscriptionNextStep = this.sm.OnNextStep.subscribe({
      next: (comp) => {
        if (comp === this.comp) {
          this.nextStep()
        }
      }
    });
  }

  unregisterNextStep() {
    this.subscriptionNextStep.unsubscribe();
  }


}
