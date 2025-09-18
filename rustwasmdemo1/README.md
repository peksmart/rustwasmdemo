# rustwasmdemo1

一个最小的 Rust → WASM 示例，导出 C ABI 函数，并通过函数指针表触发单一 funcref 表（单表）。

## 导出 API
- `add(a: i32, b: i32) -> i32`
- `apply_unop(x: i32, op: i32) -> i32`：`op` 取值 0/1/2 分别对应 `neg/inc/dec`
- `identity(x: i32) -> i32`

## 构建
Windows PowerShell 下：

```powershell
rustup target add wasm32-unknown-unknown
cargo build --release
```

编译产物：`target\wasm32-unknown-unknown\release\rustwasmdemo1.wasm`

## 验证“单表”
使用 wasm-tools（或 wabt）检查表数量：

```powershell
# 安装 wasm-tools（任选其一）
# cargo binstall wasm-tools ; 若无 binstall，请用 cargo install
cargo install wasm-tools

# 打印模块结构，查找 (table ... funcref) 仅一处
wasm-tools print .\target\wasm32-unknown-unknown\release\rustwasmdemo1.wasm | Select-String -Pattern "(table" -SimpleMatch

# 或用 wasm-objdump（wabt）
# choco install wabt -y
wasm-objdump -x .\target\wasm32-unknown-unknown\release\rustwasmdemo1.wasm | Select-String table
```

你应当只看到一个 funcref 表；如果看到多于一个表，通常是：
- 引入了 `externref/anyref` 或 GC/JS 绑定相关特性；
- 使用了 `wasm-bindgen` 且启用了引用类型绑定；
- 链接到需要额外引用类型表的运行时。

本示例使用 `#![no_std]`、纯 C ABI 导出、函数指针数组，避免上述情况。

## 使用（宿主调用）
无需额外导入表；宿主只需调用导出函数。例如在 JS 环境中：

```js
const buf = await fs.promises.readFile('rustwasmdemo1.wasm');
const { instance } = await WebAssembly.instantiate(buf, {});
console.log(instance.exports.add(2, 3)); // 5
console.log(instance.exports.apply_unop(10, 1)); // 11 (inc)
```

## 注意事项
- 不要启用 `externref/anyref`、`wasm-bindgen` JS 绑定等。
- 仅使用 `wasm32-unknown-unknown` 目标，避免 wasi 运行时引入不相关段。
