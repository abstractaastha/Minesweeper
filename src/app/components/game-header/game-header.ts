import { Component, computed, inject } from '@angular/core';
import { DIFFICULTIES, GameService } from '../../services/game';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [],
  templateUrl: './game-header.html',
  styleUrl: './game-header.scss',
})
export class GameHeader {
  private readonly gameService = inject(GameService);

  readonly difficulties = Object.entries(DIFFICULTIES);
  readonly currentDifficultyKey = computed(
    () =>
      this.difficulties.find(([, value]) => value === this.gameService.difficulty())?.[0] ??
      'beginner',
  );

  readonly minesRemaining = this.gameService.minesRemaining;
  readonly secondsElapsed = this.gameService.secondsElapsed;
  readonly status = this.gameService.status;

  readonly faceIcon = computed(() =>
    this.status() === 'lost'
      ? '/minesweeper-icons/death.png'
      : '/minesweeper-icons/smiley.png',
  );

  onReset(): void {
    this.gameService.newGame();
  }

  onDifficultyChange(key: string): void {
    const difficulty = DIFFICULTIES[key];
    if (difficulty) {
      this.gameService.newGame(difficulty);
    }
  }
}