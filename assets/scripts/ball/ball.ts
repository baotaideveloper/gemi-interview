import { BallStatus } from "./ball-enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    @property(cc.Node)
    private nodeBall: cc.Node = null;
    @property(cc.SpriteFrame)
    private spriteFrameBall: cc.SpriteFrame = null;
    @property(cc.Float)
    private rangeStartDirectionX: number = 0;
    @property(cc.Float)
    private limitAngleWithPaddle: number = 0;
    @property(cc.Vec3)
    private startPosition: cc.Vec3 = cc.Vec3.ZERO;
    @property(cc.Node)
    private paddleNode: cc.Node = null;

    protected ballSpeed: number = 0;
    protected rigidBodyBall: cc.RigidBody = null;
    protected ballVelocity: cc.Vec3 = cc.Vec3.ZERO;
    protected ballStatus: BallStatus = BallStatus.Idle;
    protected isEnterBrick: boolean = false;
    protected isReadyMove: boolean = false;

    protected start(): void {
        this.rigidBodyBall = this.nodeBall.getComponent(cc.RigidBody);
    }

    protected update(dt: number): void {
        if (this.ballStatus === BallStatus.Moving) {
            var nextBallPosition = this.nodeBall.position;
            nextBallPosition.x += this.ballVelocity.x * dt;
            nextBallPosition.y += this.ballVelocity.y * dt;
            this.nodeBall.position = nextBallPosition;
        }
        if (this.ballStatus === BallStatus.Over) {
            this.ballStatus = BallStatus.Idle;
            this.nodeBall.position = this.startPosition;
            this.followPaddleNode();
        }
    }

    public resetDefault(): void {
        this.nodeBall.getComponent(cc.Sprite).spriteFrame = this.spriteFrameBall;
        this.nodeBall.position = this.startPosition;
    }

    public setBallSpeed(ballSpeed: number): void {
        this.ballSpeed = ballSpeed;
    }

    public ready(): void {
        this.isReadyMove = true;
        this.registerEvent();
    }

    private registerEvent(): void {
        this.rigidBodyBall.onBeginContact = this.onCollisionEnter.bind(this);
        this.rigidBodyBall.onEndContact = this.onCollisionExit.bind(this);
        this.paddleNode.on(cc.Node.EventType.POSITION_CHANGED, this.followPaddleNode, this);
    }

    private unregisterEvent(): void {
        this.rigidBodyBall.onBeginContact = () => { };
        this.rigidBodyBall.onEndContact = () => { };
        this.paddleNode.off(cc.Node.EventType.POSITION_CHANGED, this.followPaddleNode, this);
    }

    public startMove(): void {
        if (this.validStartMove()) {

            var velocityX = this.randomVelocityX();
            this.ballVelocity = new cc.Vec3(velocityX, this.ballSpeed - Math.abs(velocityX));
            this.ballStatus = BallStatus.Moving;
        }
    }

    private validStartMove(): boolean {
        return this.isReadyMove && this.ballStatus == BallStatus.Idle;
    }

    public stopMove(): void {
        if (this.ballStatus == BallStatus.Moving) {
            this.ballVelocity = cc.Vec3.ZERO;
            this.ballStatus = BallStatus.Idle;
            this.isReadyMove = false;
            this.unregisterEvent();
        }
    }

    private randomVelocityX(): number {
        var velocityX: number = 0;
        var direction = Math.random() > 0.5 ? 1 : -1;
        velocityX = Math.random() * this.rangeStartDirectionX * direction;
        return velocityX;
    }

    private onCollisionEnter(contact, self, other): void {
        switch (other.tag) {
            case 1:
                if (!this.isEnterBrick) {
                    this.onHitBrick(other.node);
                    this.isEnterBrick = true;
                };
                break;
            case 2:
                this.onHitTopWall(other.node);
                break;
            case 3:
                this.onHitSideWall(other.node);
                break;
            case 4:
                this.onHitPaddle(other.node);
                break;
            case 5:
                this.onHitGround(other.node);
                break;
        }
    }

    private onCollisionExit(contact, self, other): void {
        switch (other.tag) {
            case 1:
                this.isEnterBrick = false;
                break;
        }
    }

    private onHitBrick(brickNode: cc.Node): void {

        var topLeftCorner = new cc.Vec2(brickNode.x - brickNode.width / 2, brickNode.y + brickNode.height / 2);
        var topRightCorner = new cc.Vec2(brickNode.x + brickNode.width / 2, brickNode.y + brickNode.height / 2);
        var bottomLeftCorner = new cc.Vec2(brickNode.x - brickNode.width / 2, brickNode.y - brickNode.height / 2);
        var bottomRightCorner = new cc.Vec2(brickNode.x + brickNode.width / 2, brickNode.y - brickNode.height / 2);
        var centerBrick = new cc.Vec2(brickNode.x, brickNode.y);
        var centerBall = new cc.Vec2(this.nodeBall.x, this.nodeBall.y);

        if (cc.Intersection.lineLine(centerBall, centerBrick, topLeftCorner, topRightCorner) || cc.Intersection.lineLine(centerBall, centerBrick, bottomLeftCorner, bottomRightCorner)) {
            this.reverseVertical();
        } else {
            this.reverseHorizontal();
        }
    }
    protected onHitSideWall(wallNode: cc.Node): void {
        this.reverseHorizontal();
    }

    private reverseHorizontal(): void {
        this.ballVelocity.x *= -1;
    }

    protected onHitTopWall(wallNode: cc.Node): void {
        this.reverseVertical();
    }

    private reverseVertical(): void {
        this.ballVelocity.y *= -1;
    }

    protected onHitPaddle(paddleNode: cc.Node): void {
        var ballWorldPosition = this.nodeBall.parent.convertToNodeSpaceAR(this.nodeBall.position);
        var paddleWorldPosition = paddleNode.parent.convertToNodeSpaceAR(paddleNode.position);
        var newDirectionX = ballWorldPosition.x > paddleWorldPosition.x ? 1 : -1;
        var newVelocityX = this.calculatePercentOffsetBallWithPaddle(paddleNode) * newDirectionX * this.ballSpeed;


        this.ballVelocity.x = newVelocityX;
        this.ballVelocity.y = this.ballSpeed - Math.abs(newVelocityX);
    }

    private calculatePercentOffsetBallWithPaddle(paddleNode: cc.Node): number {
        var ballWorldPosition = this.nodeBall.parent.convertToNodeSpaceAR(this.nodeBall.position);
        var paddleWorldPosition = paddleNode.parent.convertToNodeSpaceAR(paddleNode.position);
        var paddleSize = paddleNode.width;
        var offsetBallWithPaddle = Math.abs(ballWorldPosition.x - paddleWorldPosition.x);
        var percentage = offsetBallWithPaddle / (paddleSize / 2);
        var percentLimitAngleWithFlatAngle = this.limitAngleWithPaddle / 180;
        percentage = percentage > percentLimitAngleWithFlatAngle ? percentLimitAngleWithFlatAngle : percentage
        return percentage;
    }

    protected onHitGround(groundNode: cc.Node): void {
        this.ballStatus = BallStatus.Over;
    }

    private followPaddleNode(): void {
        if (this.ballStatus === BallStatus.Idle) {
            this.nodeBall.x = this.paddleNode.x;
        }
    }

}
