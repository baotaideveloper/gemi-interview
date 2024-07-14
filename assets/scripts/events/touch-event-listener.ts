import { INPUT_EVENT } from "./game-event-config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchEventListener extends cc.Component {

    @property(cc.Node)
    private nodeTarget: cc.Node = null;

    protected start(): void {
        this.registerEvent();
    }

    private registerEvent(): void {
        this.nodeTarget.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.nodeTarget.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    private onTouchStart(event: cc.Event.EventTouch): void {
        var touchPosition = this.nodeTarget.convertToNodeSpaceAR(event.getLocation());
        this.node.emit(INPUT_EVENT.TouchStartAt, touchPosition);
    }

    private onTouchMove(event: cc.Event.EventTouch): void {
        var touchPosition = this.nodeTarget.convertToNodeSpaceAR(event.getLocation());
        this.node.emit(INPUT_EVENT.TouchMoveAt, touchPosition);
    }
}
