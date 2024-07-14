const { ccclass, property } = cc._decorator;

@ccclass
export default class UISelectBall extends cc.Component {

    @property(cc.Toggle)
    private toggleUseSpeedUpBall: cc.Toggle = null;

    public isUseSpeedUpBall(): boolean {
        return this.toggleUseSpeedUpBall.isChecked;
    }
}
