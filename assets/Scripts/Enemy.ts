import { _decorator, Animation, AnimationClip, Collider2D, Component, Contact2DType, IPhysics2DContact, log, Node, UITransform, view } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    /**敌方血量 */
    @property
    hp:number = 1


    /**击中销毁动画 */
    @property(Animation)
    anim: Animation = null
    /** 存动画的 Map */
    private animationMap: Map<string, AnimationClip> = new Map();

    /**敌人的移动速度 */
    @property
    speed:number = 300

    collider2D: Collider2D = null

    /**节点的位置信息 */
    nodeArea: UITransform = null
    
    isHit: boolean = false
    isDown:boolean = false

    start() {
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.handleBulletCollisions, this);
            this.collider2D = collider
        }

        // 监听动画播放完成事件
        // this.anim.on(Animation.EventType.FINISHED, this.componentDestruction, this);
        this.nodeArea = this.node.getComponent(UITransform)

        this.anim.clips.forEach(clip => {
            this.animationMap.set(clip.name, clip);
        });
    }

    protected onDestroy(): void {
        if (this.collider2D) {
            this.collider2D.off(Contact2DType.BEGIN_CONTACT, this.handleBulletCollisions, this);
        }
    }

    update(deltaTime: number) {
        this.airplaneSports(deltaTime)
    }

    /**处理子弹碰撞 */
    handleBulletCollisions(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        if (otherCollider.getComponent(Bullet)) {
            otherCollider.node?.destroy();

            this.hp >= 1 && (this.hp -= 1)

            if (this.hp < 1) {
                this.playDestroy()
                this.collider2D.enabled = false
            } else {
                this.playHit()
            }
        }


    
    }

    /**飞机运动 */
    airplaneSports(deltaTime: number) {
        if (this.hp < 1) {
            return
        }

        if (this.node.worldPosition.y + this.nodeArea.height/2 + 10 < 0) {
            this.componentDestruction()
            return
        }

        const p = this.node.position
        this.node.setPosition(
            p.x,
            p.y - deltaTime * this.speed,
            p.z
        )
    }

    /**销毁逻辑 */
    componentDestruction() {
        this.node.destroy()
    }

    /** 播放受击动画 */
    playHit() {
        if (this.isHit) return
        this.isHit = true
        const hitClip = this.findClipByKeyword('hit'); // 关键字匹配
        if (hitClip) {
            this.anim.play(hitClip.name);
        }

        this.anim.once(Animation.EventType.FINISHED, () => {
            this.isHit = false
        });

    }

    /** 播放销毁动画 */
    playDestroy() {
        if (this.isDown) return
        this.isDown = true

        const destroyClip = this.findClipByKeyword('down');
        if (destroyClip) {
            this.anim.play(destroyClip.name);
        }

        // 只监听一次销毁动画结束
        this.anim.once(Animation.EventType.FINISHED, () => {
            this.componentDestruction();
        });
    }

    /** 根据关键字找动画 */
    private findClipByKeyword(keyword: string): AnimationClip | null {
        for (let [name, clip] of this.animationMap) {
            if (name.toLowerCase().includes(keyword.toLowerCase())) {
                return clip;
            }
        }
        return null;
    }
}


