import Ball from "./ball";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallSpeedUp extends Ball {

    @property(cc.Float)
    private speedIncreaseWhenHitPaddle: number = 0;

    protected onHitPaddle(paddleNode: cc.Node): void {
        this.ballSpeed += this.speedIncreaseWhenHitPaddle;
        super.onHitPaddle(paddleNode);
    }
}
