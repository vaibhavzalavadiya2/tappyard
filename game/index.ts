import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: parent.clientWidth,
    height: parent.clientHeight,
    transparent: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [GameScene],
    input: {
      touch: {
        capture: true,
      },
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    banner: false,
  };

  return new Phaser.Game(config);
}
