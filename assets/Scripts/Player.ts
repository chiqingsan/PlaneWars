import { _decorator, Component, EventTouch, Input, input, Node, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    nodeArea?: UITransform;
    visibleWidth: number = 0;
    visibleHeight: number = 0;

    leftBorder: number = 0;
    rightBorder: number = 0;
    bottomBorder: number = 0;
    topBorder: number = 0;


    start() {
        this.nodeArea = this.node.getComponent(UITransform);

        this.visibleWidth = view.getVisibleSize().width;
        this.visibleHeight = view.getVisibleSize().height;

        const airplaneWidth = (this.nodeArea?.width ?? 0) * this.node.scale.x;
        const airplaneHeight = (this.nodeArea?.height ?? 0) * this.node.scale.y;
        const allowableError1 = Math.floor(airplaneWidth * 0.33);

        this.leftBorder = -(this.visibleWidth / 2) + allowableError1;
        this.rightBorder = (this.visibleWidth / 2) - allowableError1;
        this.topBorder = this.visibleHeight / 2 - airplaneHeight / 2;
        this.bottomBorder = -(this.visibleHeight / 2 - airplaneHeight / 2);

        // 绑定触摸事件
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchMove(event: EventTouch) {
        const p = this.node.position;
        let offsetX = p.x + event.getDeltaX();
        let offsetY = p.y + event.getDeltaY();

        // 限制 offsetX 在边界内
        if (offsetX < this.leftBorder) offsetX = this.leftBorder;
        if (offsetX > this.rightBorder) offsetX = this.rightBorder;

        // 限制 offsetY 在边界内
        if (offsetY < this.bottomBorder) offsetY = this.bottomBorder;
        if (offsetY > this.topBorder) offsetY = this.topBorder;

        this.node.setPosition(offsetX, offsetY);
    }
}
