import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper-navigation.component.html',
})
export class StepperNavigationComponent {
  @Input() atual: number = 0;
  @Input() total: number = 0;

  @Output() voltar = new EventEmitter<void>();
  @Output() proximo = new EventEmitter<void>();
  @Output() enviar = new EventEmitter<void>();
}
