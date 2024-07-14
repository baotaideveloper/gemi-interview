import { INPUT_EVENT } from "./game-event-config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PaddleKeyboardEventListener extends cc.Component {

    protected start(): void {
        this.registerEvent();
    }

    private registerEvent(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        this.node.emit(INPUT_EVENT.KeyDown, event.keyCode);
    }
}
