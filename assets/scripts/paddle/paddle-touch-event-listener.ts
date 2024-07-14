import { INPUT_EVENT } from "../events/game-event-config";
import PaddleController from "./paddle-controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PaddleTouchEventListener extends cc.Component {

    @property(PaddleController)
    private paddleController: PaddleController = null;
    @property(cc.Node)
    private nodeEventEmitter: cc.Node = null;

    protected start(): void {
        this.registerEvent();
    }

    private registerEvent(): void {
        this.nodeEventEmitter.on(INPUT_EVENT.TouchStartAt, this.onTouchStart, this);
        this.nodeEventEmitter.on(INPUT_EVENT.TouchMoveAt, this.onTouchMove, this);
    }

    private onTouchStart(position: cc.Vec2): void {
    }

    private onTouchMove(position: cc.Vec2): void {
        this.paddleController.moveTo(position.x);
    }
}
