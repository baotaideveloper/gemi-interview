import { INPUT_EVENT } from "../events/game-event-config";
import PaddleController from "./paddle-controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PaddleKeyboardEventListener extends cc.Component {

    @property(PaddleController)
    private paddleController: PaddleController = null;
    @property(cc.Node)
    private nodeEventEmitter: cc.Node = null;

    protected start(): void {
        this.registerEvent();
    }

    private registerEvent(): void {
        this.nodeEventEmitter.on(INPUT_EVENT.KeyDown, this.onKeyDown, this);
    }

    private onKeyDown(keyCode: cc.macro.KEY): void {
        switch (keyCode) {
            case cc.macro.KEY.left:
                this.paddleController.moveLeft();
                break;
            case cc.macro.KEY.right:
                this.paddleController.moveRight();
                break;
        }
    }
}
