import { Component } from '@angular/core';
import { Board } from '../../components/board/board';
import { GameHeader } from '../../components/game-header/game-header';
import { HowToPlay } from '../../components/how-to-play/how-to-play';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [Board, GameHeader, HowToPlay],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {}