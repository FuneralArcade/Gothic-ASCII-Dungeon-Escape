
# ♰ GOTHIC ASCII CAVERN ESCAPE ♰
### ─── ☥ SYS.OS.CAVERN_EXPLORER_V1.0.4 ☥ ───

```text
      .      .      .      .      .      .      .      .
    .   ╔══════════════════════════════════════════╗   .
      . ║  @  .  .  #  #  #  .  .  .  K  .  .  D   ║ .
    .   ║  .  #  .  .  .  .  #  #  .  .  L  .  .   ║   .
      . ╚══════════════════════════════════════════╝ .
    .      .      .      .      .      .      .      .
```

## 🕸 技术架构与设计说明 | ARCHITECTURE & DESIGN 🕸

本系统是一个基于 React 状态机的轻量级 Roguelike 仿真环境，旨在探索低带宽视觉表示（ASCII）与实时 DSP 合成音频的结合。

### 1. 渲染引擎与视觉逻辑 | Rendering & Optics
- **ASCII 矩阵光栅化 (Matrix Rasterization)**: 放弃传统 GPU 纹理映射，采用字符级渲染。`@` 为主实体 (Primary Entity)，`#` 为碰撞体 (Immutable Colliders)。
- **动态视野裁剪 (Dynamic FOV Logic)**: 基于欧几里得距离的视野裁剪算法，模拟非线性光强衰减。
- **排版堆栈 (Typeface Stack)**: 混合使用 `UnifrakturMaguntia` (中世纪风格) 与 `SimSun` (12px 像素宋体)，在字形层次上实现“复古未来主义”的视觉对冲。

### 2. 音频数字信号处理 | DSP & Audio Synthesis
- **实时加法/减法合成 (Real-time Synthesis)**: 基于 Web Audio API，不依赖静态采样，所有音效均为程序实时生成。
- **环境回响物理模型 (Physical Modeling)**: 通过 `DelayNode` 与 `BiquadFilter` 链构建反馈延迟网络 (FDN)，模拟湿冷密闭空间的声学特性。
- **瞬态包络模拟 (Transient Envelope)**: 钥匙拾取音效通过 9 组高频不谐和正弦波簇结合高通滤波器实现金属撞击的物理瞬态模拟。

### 3. 系统逻辑 | System Internals
- **PCG 算法 (Procedural Content Generation)**: 核心地图采用随机游走算法 (Random Walker Algorithm) 进行非线性的拓扑结构生成。
- **回合制状态机 (Turn-based State Machine)**: 每一次移动行为触发一次全局状态更新逻辑，处理 NPC 寻径与属性结算。

---

## 🕯 操作手册 | USER MANUAL 🕯

### ⚔ 输入映射 | INPUT MAPPING
- **[ W / ↑ ]** : 北向移动 / 指令：`MOVE_NORTH`
- **[ A / ← ]** : 西向移动 / 指令：`MOVE_WEST`
- **[ S / ↓ ]** : 南向移动 / 指令：`MOVE_SOUTH`
- **[ D / → ]** : 东向移动 / 指令：`MOVE_EAST`
- **[ SPACE ]** : 系统挂起 / 状态：`WAIT_RECOVER`

### 🏺 实体数据结构 | ENTITY DATA MAP
- ` @ ` : **玩家实体 (Player)** - 属性：`HP: 100 / STR: 10`。
- ` K ` : **权限凭证 (Key)** - 用于解构石门锁定状态的布尔变量。
- ` D ` : **跳转节点 (Portal)** - 下一递归层级的入口（需 Key 验证）。
- ` L ` : **视野补丁 (Visual Buffer)** - 永久性全局变量 `VisionRadius` 增益。
- ` P ` : **自修复包 (Potion)** - 执行 `HP += 25` 的即时函数。
- ` E ` : **敌对程序 (Enemy)** - 带有基础追踪逻辑的动态障碍物。

### 📜 运行指南 | EXECUTION LOGIC
1. **递归下降**: 必须在当前层级堆栈中检索到权限钥匙 `K` 才能触发 `DESCEND_LEVEL` 事件。
2. **光强衰减**: 初始视野仅为 2 单位，通过提灯 `L` 可将光照半径扩展至 5 单位。
3. **内存管理**: 战斗会消耗 HP 资源，原地待命可作为低开销的逻辑跳过，但会给敌对程序提供移动窗口。

---

## ⚙ 开发规格 | TECH SPECS
- **Core Runtime**: React 19 + TypeScript 5.x
- **UI Architecture**: Tailwind CSS Utility-first
- **Audio Engine**: Low-latency AudioContext Pipeline
- **Character Encoding**: UTF-8 / GBK Hybrid Style

```text
☠ MEMORY STATUS: STABLE
☠ SUBSYSTEMS: OPTIMIZED
☠ SYSTEM READY FOR INITIALIZATION.
```

---
*© 1205 KERNEL.SYSTEM.CAVERN - [ REBOOT ] TO FLUSH STATE*
