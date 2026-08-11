import { Component, computed, inject } from '@angular/core';
import { Cell } from '../cell/cell';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [Cell],
  templateUrl: './board.html',
  styleUrls: ['./board.scss'],
})
export class Board {
  private readonly gameService = inject(GameService);

  readonly grid = this.gameService.grid;
  readonly cols = computed(() => this.gameService.difficulty().cols);
  readonly gameOver = computed(() => {
    const status = this.gameService.status();
    return status === 'won' || status === 'lost';
  });

  onReveal(row: number, col: number): void {
    this.gameService.reveal(row, col);
  }

  onFlag(row: number, col: number): void {
    this.gameService.toggleFlag(row, col);
  }
}