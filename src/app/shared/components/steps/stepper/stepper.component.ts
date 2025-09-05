import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { mdiCheck, mdiCircleOutline, mdiLock } from '@mdi/js';

export interface Step {
  label: string;
  ativo: boolean;
  completado: boolean;
  bloqueado?: boolean;
  icone?: string;
}

export type StepStatus = 'completed' | 'pending' | 'blocked';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule, TranslateModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  @Input() steps: Step[] = [];
  @Input() indiceAtual: number = 0;
  @Output() trocarStep = new EventEmitter<number>();

  
  readonly icons = {
    check: mdiCheck,
    circle: mdiCircleOutline,
    lock: mdiLock
  };

  selecionarStep(index: number) {
    if (index <= this.indiceAtual && !this.steps[index]?.bloqueado) {
      this.trocarStep.emit(index);
    }
  }

  getStepStatus(step: Step, index: number): StepStatus {
    if (step.bloqueado || index > this.indiceAtual) {
      return 'blocked';
    }
    if (step.completado) {
      return 'completed';
    }
    return 'pending';
  }

  getStepIcon(step: Step, index: number): string {
    const status = this.getStepStatus(step, index);
    
    if (step.icone) {
      return step.icone;
    }
    
    switch (status) {
      case 'completed':
        return this.icons.check;
      case 'blocked':
        return this.icons.lock;
      default:
        return this.icons.circle;
    }
  }

  getSvgPath(iconPath: string): string {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${iconPath}"/></svg>`)}`;
  }
}
