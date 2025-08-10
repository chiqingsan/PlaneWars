import { _decorator, Component, EventTouch, EventKeyboard, Input, input, Node, UITransform, view, KeyCode, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

enum ShootType {
    /**普通子弹 */
    OrdinaryBullets,
    /**高级子弹 */
    AdvancedBullets,
    /**高级子弹 */
    TrackingBullets,
    /**疯狂子弹 */
    CrazyBullet
}


@ccclass('Player')
export class Player extends Component {
    nodeArea?: UITransform;
    visibleWidth: number = 0;
    visibleHeight: number = 0;

    leftBorder: number = 0;
    rightBorder: number = 0;
    bottomBorder: number = 0;
    topBorder: number = 0;

    // 按键状态
    private keys: Record<string, boolean> = {};

    @property
    moveSpeed: number = 450; // 像素/秒
    /** 子弹发射间隔 */
    @property
    shootRate: number = 0.15
    shootTimer: number = 0

    /**子弹预制体1 */
    @property(Prefab)
    bullet1Prefab: Prefab = null
    @property(Node)
    bullet1Position: Node = null

    @property(Node)
    bulletParent: Node = null


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

        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onTouchMove(event: EventTouch) {
        const p = this.node.position;
        let offsetX = p.x + event.getDeltaX();
        let offsetY = p.y + event.getDeltaY();
        this.setClampedPosition(offsetX, offsetY);
    }

    onKeyDown(event: EventKeyboard) {
        this.keys[event.keyCode] = true;
    }

    onKeyUp(event: EventKeyboard) {
        this.keys[event.keyCode] = false;
    }

    update(deltaTime: number) {
        this.handleKeyboardMovement(deltaTime);
        this.fireBullets(deltaTime);
    }

    private handleKeyboardMovement(deltaTime: number) {
        let moveX = 0;
        let moveY = 0;

        if (this.keys[KeyCode.KEY_A]) moveX -= this.moveSpeed * deltaTime;
        if (this.keys[KeyCode.KEY_D]) moveX += this.moveSpeed * deltaTime;
        if (this.keys[KeyCode.KEY_W]) moveY += this.moveSpeed * deltaTime;
        if (this.keys[KeyCode.KEY_S]) moveY -= this.moveSpeed * deltaTime;

        if (moveX !== 0 || moveY !== 0) {
            const p = this.node.position;
            const offsetX = p.x + moveX;
            const offsetY = p.y + moveY;
            this.setClampedPosition(offsetX, offsetY);
        }
    }

    private setClampedPosition(x: number, y: number) {
        const { newX, newY } = this.clampPosition(x, y);
        this.node.setPosition(newX, newY);
    }

    private clampPosition(x: number, y: number) {
        let newX = x;
        let newY = y;

        if (newX < this.leftBorder) newX = this.leftBorder;
        if (newX > this.rightBorder) newX = this.rightBorder;
        if (newY < this.bottomBorder) newY = this.bottomBorder;
        if (newY > this.topBorder) newY = this.topBorder;

        return { newX, newY };
    }

    /**发射子弹 */
    fireBullets(deltaTime: number) {
        this.shootTimer += deltaTime;
        if (this.shootTimer < this.shootRate) {
            return
        }
        this.shootTimer = 0

        const bullet1 = instantiate(this.bullet1Prefab)

        this.bulletParent.addChild(bullet1)
        bullet1.setWorldPosition(this.bullet1Position.worldPosition)
    }
}
