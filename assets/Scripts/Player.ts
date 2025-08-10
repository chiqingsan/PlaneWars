import { _decorator, Component, EventTouch, EventKeyboard, Input, input, Node, UITransform, view, KeyCode, Prefab, instantiate, log } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

export enum ShootType {
    /**普通子弹 */
    OrdinaryBullets,
    /**高级子弹 */
    AdvancedBullets,
    /**追踪子弹 */
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

    /**子弹类型 */
    @property
    shootType: ShootType = ShootType.OrdinaryBullets;

    /**子弹预制体1 普通子弹*/
    @property(Prefab)
    bullet1Prefab1: Prefab = null
    /**子弹预制体2 高级子弹 */
    @property(Prefab)
    bullet1Prefab2: Prefab = null


    /**子弹发射位置 */
    @property(Node)
    bullet1Position: Node = null

    /**子弹发射节点 */
    @property(Node)
    bulletParent: Node = null


    /**玩家节点宽度 */
    airplaneWidth:number = 0
    /**玩家节点高度 */
    airplaneHeight:number = 0

    start() {
        this.nodeArea = this.node.getComponent(UITransform);

        this.visibleWidth = view.getVisibleSize().width;
        this.visibleHeight = view.getVisibleSize().height;

        const airplaneWidth = (this.nodeArea?.width ?? 0) * this.node.scale.x;
        const airplaneHeight = (this.nodeArea?.height ?? 0) * this.node.scale.y;
        this.airplaneWidth = airplaneWidth
        this.airplaneHeight = airplaneHeight
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

        switch (this.shootType) {
            case ShootType.OrdinaryBullets:
                this.fireOrdinaryBullets();
                break;
            case ShootType.AdvancedBullets:
                this.fireAdvancedBullets();
                break;
            case ShootType.TrackingBullets:
                this.fireTrackingBullets();
                break;
            case ShootType.CrazyBullet:
                this.fireCrazyBullets();
                break;
            default:
                log("未知的子弹类型");
                break;
        }

    }


    /**发射普通子弹 */
    fireOrdinaryBullets() {
        const bullet1 = instantiate(this.bullet1Prefab1)
        bullet1.getComponent(Bullet).shootType = ShootType.OrdinaryBullets
        
        this.bulletParent.addChild(bullet1)
        bullet1.setWorldPosition(this.bullet1Position.worldPosition)
    }

    /**发射高级子弹 */
    fireAdvancedBullets() {
        const bullet1 = instantiate(this.bullet1Prefab2)
        const bullet2 = instantiate(this.bullet1Prefab2)
        bullet1.getComponent(Bullet).shootType = ShootType.AdvancedBullets

        this.bulletParent.addChild(bullet1)
        this.bulletParent.addChild(bullet2)
        const bullet1Position = this.bullet1Position.worldPosition.clone()
        const bullet2Position = this.bullet1Position.worldPosition.clone()
        bullet2Position.x += this.airplaneWidth * 0.25
        bullet1Position.x -= this.airplaneWidth * 0.25
        bullet1.setWorldPosition(bullet1Position)
        bullet2.setWorldPosition(bullet2Position)
    }
    
    /**发射追踪子弹 */
    fireTrackingBullets() {

    }
    
    /**发射疯狂子弹 */
    fireCrazyBullets() {
    }

    /**设置子弹类型 */
    setShootType(type: ShootType) {
        this.shootType = type;
    }
}
