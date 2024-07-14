import BallController from "./ball-controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InputStartMoveBall extends cc.Component {

    @property(cc.Node)
    private nodeTarget: cc.Node = null;
    @property(BallController)
    private ballController: BallController = null;

    protected start(): void {
        this.registerEvent();
    }

    private registerEvent(): void {
        this.nodeTarget.on(cc.Node.EventType.TOUCH_START, this.startMove, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                this.startMove();
                break;
            default:
                break;
        }
    }

    private startMove(): void {
        this.ballController.startMove();
    }
}
