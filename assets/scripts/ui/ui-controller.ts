import UIInteract from "./ui-interact";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIController extends cc.Component {
    @property(UIInteract)
    private uiIntro: UIInteract = null;
    @property(UIInteract)
    private uiGameOver: UIInteract = null;
    @property(UIInteract)
    private uiFinish: UIInteract = null;

    protected start(): void {
        this.hideALl();
    }

    public hideALl(): void {
        this.hideIntroUI();
        this.hideGameOverUI();
        this.hideFinishUI();
    }

    public showIntroUI(): void {
        this.uiIntro.show();
    }

    public hideIntroUI(): void {
        this.uiIntro.hide();
    }

    public showGameOverUI(): void {
        this.uiGameOver.show();
    }

    public hideGameOverUI(): void {
        this.uiGameOver.hide();
    }

    public showFinishUI(): void {
        this.uiFinish.show();
    }

    public hideFinishUI(): void {
        this.uiFinish.hide();
    }
}