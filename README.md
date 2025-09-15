# Rust WebAssembly 基础演示

这是一个最基础的 Rust WebAssembly 项目，展示了如何在 Rust 中编写代码并在浏览器中运行。

## 项目特点

- ✅ 使用 Rust 2024 版本
- ✅ 配置为 WebAssembly 目标 (cdylib)
- ✅ 包含基础的数学运算函数
- ✅ 支持字符串处理
- ✅ 包含高级计算功能 (阶乘、质数检查)
- ✅ 支持浏览器控制台日志输出

## 已实现的功能

### 数学运算
- `add(a: i32, b: i32) -> i32`: 两数相加
- `multiply(a: i32, b: i32) -> i32`: 两数相乘

### 字符串处理
- `greet(name: &str) -> String`: 生成个性化问候语

### 高级计算
- `factorial(n: u32) -> u32`: 计算阶乘
- `is_prime(n: u32) -> bool`: 检查是否为质数

### 调试功能
- 控制台日志输出
- 函数调用跟踪

## 项目结构

```
rustwasmdemo/
├── Cargo.toml                    # 项目配置
├── src/
│   └── lib.rs                   # Rust 源代码
├── index.html                   # 完整测试页面 (需要 wasm-pack)
├── demo.html                    # 简化演示页面
├── README.md                    # 项目说明
└── target/
    └── wasm32-unknown-unknown/
        └── release/
            └── rustwasmdemo.wasm  # 编译后的 WebAssembly 模块
```

## 构建步骤

### 1. 基础编译 (已完成)
```bash
# 添加 WebAssembly 目标
rustup target add wasm32-unknown-unknown

# 编译 WebAssembly 模块
cargo build --target wasm32-unknown-unknown --release
```

### 2. 生成 JavaScript 绑定 (下一步)
```bash
# 安装 wasm-pack
cargo install wasm-pack

# 构建完整项目
wasm-pack build --target web

# 或者使用 wasm-bindgen
cargo install wasm-bindgen-cli
wasm-bindgen --out-dir pkg --web target/wasm32-unknown-unknown/release/rustwasmdemo.wasm
```

### 3. 运行测试
```bash
# 启动本地服务器
python -m http.server 8000

# 在浏览器中访问
http://localhost:8000/index.html
```

## 当前状态

- ✅ Rust 代码编写完成
- ✅ WebAssembly 模块编译成功
- ⏳ 正在安装 wasm-bindgen/wasm-pack 工具
- ⏳ 等待生成 JavaScript 绑定文件

## 技术说明

### Cargo.toml 配置
```toml
[lib]
crate-type = ["cdylib"]  # 生成动态链接库用于 WebAssembly

[dependencies]
wasm-bindgen = "0.2"     # WebAssembly 绑定
web-sys = { version = "0.3", features = ["console"] }  # Web API 访问
```

### 关键特性
- 使用 `#[wasm_bindgen]` 宏导出函数到 JavaScript
- 支持基础数据类型 (i32, u32, bool, String) 的双向传递
- 提供浏览器控制台日志功能
- 自动初始化模块

## 下一步扩展

1. 添加更多数据类型支持 (数组、对象)
2. 实现更复杂的算法 (排序、搜索)
3. 添加图形处理功能
4. 集成 Web API (DOM 操作、Canvas)
5. 性能基准测试

这个项目提供了 Rust WebAssembly 开发的完整起点，可以作为更复杂应用的基础。