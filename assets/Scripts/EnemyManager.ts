import { _decorator, Component, instantiate, math, Node, Prefab, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
    /** 敌机生成的 y 坐标 */
    initialCoordinates: number = 0

    /** 小飞机生成的 x 坐标范围 [minX, maxX] */
    enemy0ScopeX: [number, number] = [0, 0]
    enemy1ScopeX: [number, number] = [0, 0]
    enemy2ScopeX: [number, number] = [0, 0]

    /** 小飞机的生成间隔 */
    @property
    enemy0GenerateInterval: number = 1
    enemy0timer: number = 0
    /** 小飞机的宽高 */
    enemy0tf: UITransform = null
    /** 小飞机的预制体 */
    @property(Prefab)
    enemy0Prefab: Prefab = null

    /** 普通飞机的生成间隔 */
    @property
    enemy1GenerateInterval: number = 5
    enemy1timer: number = 0
    /** 普通飞机的宽高 */
    enemy1tf: UITransform = null
    /** 普通飞机的预制体 */
    @property(Prefab)
    enemy1Prefab: Prefab = null

    /** 大飞机的生成间隔 */
    @property
    enemy2GenerateInterval: number = 10
    enemy2timer: number = 0
    /** 大飞机的宽高 */
    enemy2tf: UITransform = null
    /** 大飞机的预制体 */
    @property(Prefab)
    enemy2Prefab: Prefab = null

    start() {
        const visible = view.getVisibleSize();
        const screenWidth = visible.width;
        const screenHeight = visible.height;


        // 初始生成 Y：在屏幕上方一点
        this.initialCoordinates = screenHeight / 2 + screenHeight * 0.1

        this.enemy0ScopeX = this.calculateInitialCoordinatesX(this.enemy0Prefab, screenWidth)
        this.enemy1ScopeX = this.calculateInitialCoordinatesX(this.enemy1Prefab, screenWidth)
        this.enemy2ScopeX = this.calculateInitialCoordinatesX(this.enemy2Prefab, screenWidth)

        this.schedule(this.generateSmallAircraft, this.enemy0GenerateInterval)
        this.schedule(this.generateOrdinaryAircraft, this.enemy1GenerateInterval)
        this.schedule(this.generateLargeAircraft, this.enemy2GenerateInterval)
    }

    update(deltaTime: number) {
    }

    /**生成小飞机 */
    generateSmallAircraft() {
        this.generateAircraft(this.enemy0Prefab, this.enemy0ScopeX)
    }

    /**生成普通飞机 */
    generateOrdinaryAircraft() {
        this.generateAircraft(this.enemy1Prefab, this.enemy1ScopeX)

    }

    /**生成大飞机 */
    generateLargeAircraft() {
        this.generateAircraft(this.enemy2Prefab, this.enemy2ScopeX)

    }

    /** 生成敌机 */
    generateAircraft(prefab: Prefab, ScopeX: [number, number]) {
        const enemy = instantiate(prefab);
        const compHeight = enemy.getComponent(UITransform).height
        const randX = math.randomRangeInt(...ScopeX);

        enemy.setWorldPosition(randX, this.initialCoordinates + compHeight / 2, 0);
        this.node.addChild(enemy);
    }


    /**计算初始生成的x坐标范围 */
    calculateInitialCoordinatesX(prefab: Prefab, screenWidth: number): [number, number] {
        // 先临时实例化一次 prefab，拿到尺寸
        const tempEnemy = instantiate(prefab);
        const tf = tempEnemy.getComponent(UITransform);
        const enemyWidth = tf ? tf.width : 0;
        // const enemyHeight = tf ? tf.height : 0;


        // X 范围（以中心原点计算，减去半宽以避免越界）
        const minX0 = -screenWidth / 2 + enemyWidth / 2;
        const maxX0 = screenWidth / 2 - enemyWidth / 2;
        const ScopeX: [number, number] = [~~minX0, ~~maxX0];

        return ScopeX
    }
}
