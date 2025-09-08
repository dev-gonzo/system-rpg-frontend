import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export type GameGroupNavigationPage = 'my-groups' | 'search' | 'create';

@Component({
  selector: 'app-game-group-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, TranslateModule],
  templateUrl: './game-group-navigation.component.html',
})
export class GameGroupNavigationComponent {
  @Input() activePage: GameGroupNavigationPage = 'my-groups';
}