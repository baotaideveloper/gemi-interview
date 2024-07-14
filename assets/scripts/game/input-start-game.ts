import { GAME_EVENT } from "../events/game-event-config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InputStartGame extends cc.Component {

    @property(cc.Node)
    private nodeTarget: cc.Node = null;

    protected start(): void {
        this.registerEvent();
    }

    private registerEvent(): void {
        this.nodeTarget.on(cc.Node.EventType.TOUCH_START, this.notifyStartGame, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                this.notifyStartGame();
                break;
            default:
                break;
        }
    }

    private notifyStartGame(): void {
        this.node.emit(GAME_EVENT.StartGame);
    }
}
