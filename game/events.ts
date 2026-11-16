// Event bridge between Phaser game and React UI
export type GameEvent =
  | {
      type: 'score';
      distance: number;
      diamonds: number;
      streak: number;
      theme: string;
      isBoosting: boolean;
    }
  | {
      type: 'gameOver';
      distance: number;
      bestDistance: number;
      diamondsCollected: number;
      totalDiamonds: number;
      isNewRecord: boolean;
      newUnlocks: string[];
    }
  | { type: 'diamond'; totalDiamonds: number }
  | { type: 'boost'; streak: number }
  | { type: 'milestone'; distance: number; label: string }
  | { type: 'gameStart' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'ready' };

export type UICommand =
  | { type: 'startGame' }
  | { type: 'restartGame' }
  | { type: 'pauseGame' }
  | { type: 'resumeGame' }
  | { type: 'selectSkin'; skinId: string }
  | { type: 'purchaseSkin'; skinId: string }
  | { type: 'toggleMute' };

type GameEventHandler = (event: GameEvent) => void;
type UICommandHandler = (command: UICommand) => void;

class EventBridge {
  private gameEventHandlers: GameEventHandler[] = [];
  private uiCommandHandlers: UICommandHandler[] = [];

  // React subscribes to game events
  onGameEvent(handler: GameEventHandler) {
    this.gameEventHandlers.push(handler);
    return () => {
      this.gameEventHandlers = this.gameEventHandlers.filter(h => h !== handler);
    };
  }

  // Phaser subscribes to UI commands
  onUICommand(handler: UICommandHandler) {
    this.uiCommandHandlers.push(handler);
    return () => {
      this.uiCommandHandlers = this.uiCommandHandlers.filter(h => h !== handler);
    };
  }

  // Phaser emits game events
  emitGameEvent(event: GameEvent) {
    this.gameEventHandlers.forEach(h => h(event));
  }

  // React emits UI commands
  emitUICommand(command: UICommand) {
    this.uiCommandHandlers.forEach(h => h(command));
  }

  destroy() {
    this.gameEventHandlers = [];
    this.uiCommandHandlers = [];
  }
}

export const eventBridge = new EventBridge();
