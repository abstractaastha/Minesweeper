import { Component, computed, input, output } from '@angular/core';
import type { CellState } from '../../services/game';

const NUMBER_COLORS: Record<number, string> = {
  1: '#4d7ea8',
  2: '#5f8b4c',
  3: '#b5482a',
  4: '#4a3a7a',
  5: '#7a3b2e',
  6: '#3f7a6b',
  7: '#2b2620',
  8: '#7a746b',
};

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [],
  templateUrl: './cell.html',
  styleUrl: './cell.scss',
})
export class Cell {
  readonly cell = input.required<CellState>();
  readonly gameOver = input(false);

  readonly reveal = output<void>();
  readonly flag = output<void>();

  readonly label = computed(() => {
    const cell = this.cell();
    if (!cell.isRevealed || cell.isMine) {
      return '';
    }
    return cell.adjacentMines > 0 ? String(cell.adjacentMines) : '';
  });

  readonly numberColor = computed(() => NUMBER_COLORS[this.cell().adjacentMines] ?? 'inherit');

  onClick(): void {
    if (this.gameOver()) {
      return;
    }
    this.reveal.emit();
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    if (this.gameOver()) {
      return;
    }
    this.flag.emit();
  }
}