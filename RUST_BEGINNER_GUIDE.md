# 🎯 Rust 新手完整指南：从零开始使用 WebAssembly

> 📝 **本指南专为Rust新手设计**，即使您从未接触过Rust，也能成功使用和修改这个WebAssembly项目！

---

## 📚 目录
- [🎯 什么是这个项目](#-什么是这个项目)
- [⚙️ 环境准备](#️-环境准备)
- [🚀 快速开始](#-快速开始)
- [📖 理解项目结构](#-理解项目结构)
- [✏️ 修改和添加功能](#️-修改和添加功能)
- [🔧 微信小程序集成](#-微信小程序集成)
- [❓ 新手常见问题](#-新手常见问题)

---

## 🎯 什么是这个项目

### 简单说明
这个项目演示了如何：
1. 用 **Rust** 编写高性能代码
2. 编译成 **WebAssembly** (WASM) 在浏览器中运行
3. 特别适配了 **微信小程序** 环境

### 为什么选择 Rust + WebAssembly？
- 🚀 **性能极佳**：接近原生代码的执行速度
- 🛡️ **内存安全**：Rust防止内存泄漏和安全漏洞
- 🌐 **跨平台**：一次编写，到处运行（浏览器、小程序等）
- 📱 **小程序友好**：本项目特别解决了微信小程序兼容性问题

---

## ⚙️ 环境准备

### 📋 检查清单（必需）

#### 1. 安装 Rust
```bash
# 访问 https://rustup.rs/ 或运行：
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows 用户也可以下载安装包
```

**验证安装**：
```bash
rustc --version    # 应该显示版本号
cargo --version    # 应该显示版本号
```

#### 2. 添加 WebAssembly 目标
```bash
rustup target add wasm32-unknown-unknown
```

#### 3. 安装 wasm-bindgen（第一次使用时会自动安装）
```bash
cargo install wasm-bindgen-cli
```

### 🎉 准备完成！
现在您的环境已经准备好开发 Rust WebAssembly 项目了！

---

## 🚀 快速开始

### 立即体验（无需修改代码）

1. **📁 进入项目目录**
   ```bash
   cd /path/to/rustwasmdemo
   ```

2. **🔨 构建项目**
   ```bash
   # 构建标准版本（浏览器用）
   cargo build --target wasm32-unknown-unknown --release
   
   # 构建微信小程序版本
   .\build-miniprogram.ps1    # Windows
   # 或
   ./build-miniprogram.sh     # Linux/macOS
   ```

3. **🌐 启动服务器**
   ```bash
   # 如果有 dhgohttp.exe
   ./dhgohttp.exe
   
   # 或使用 Python 启动简单服务器
   python -m http.server 8080
   
   # 或使用 Node.js
   npx serve .
   ```

4. **🎊 测试结果**
   - 浏览器访问：`http://localhost:8080`
   - 查看 WebAssembly 演示页面

---

## 📖 理解项目结构

### 🗂️ 文件和目录说明

```
rustwasmdemo/
├── 📄 Cargo.toml              # Rust项目配置文件（如package.json）
├── 📁 src/                    # Rust源代码目录
│   └── 📄 lib.rs             # 主要的Rust代码文件
├── 📁 pkg/                    # 标准WebAssembly输出
│   ├── 📄 rustwasmdemo.js    # 浏览器用的JS绑定
│   └── 📄 *.wasm             # WebAssembly二进制文件
├── 📁 pkg-miniprogram/       # 微信小程序专用输出
│   ├── 📄 rustwasmdemo.js    # 小程序兼容的JS绑定
│   └── 📄 *.wasm             # WebAssembly二进制文件
├── 📁 target/                 # 编译输出目录（自动生成）
├── 📄 build-miniprogram.ps1  # 小程序构建脚本（Windows）
├── 📄 build-miniprogram.sh   # 小程序构建脚本（Linux/macOS）
└── 📄 index.html             # 演示网页
```

### 🔍 关键文件详解

#### `src/lib.rs` - 这里是您编写 Rust 代码的地方
```rust
// 这个文件包含了所有要导出到 JavaScript 的 Rust 函数
use wasm_bindgen::prelude::*;

#[wasm_bindgen]  // 这个标记表示函数将导出到 JavaScript
pub fn add(a: i32, b: i32) -> i32 {
    a + b  // Rust 中的加法运算
}
```

#### `Cargo.toml` - 项目配置文件
```toml
[package]
name = "rustwasmdemo"     # 项目名称
version = "0.1.0"         # 版本号

[dependencies]
wasm-bindgen = "0.2"      # WebAssembly 绑定库
```

---

## ✏️ 修改和添加功能

### 🔨 添加新的 Rust 函数

1. **打开 `src/lib.rs`**

2. **添加新函数**（在现有函数后面）：
   ```rust
   // 添加除法运算
   #[wasm_bindgen]
   pub fn divide(a: f64, b: f64) -> f64 {
       if b != 0.0 {
           a / b
       } else {
           0.0  // 避免除零错误
       }
   }
   
   // 添加字符串反转
   #[wasm_bindgen]
   pub fn reverse_string(text: &str) -> String {
       text.chars().rev().collect()
   }
   
   // 添加数组求和
   #[wasm_bindgen]
   pub fn sum_array(numbers: &[i32]) -> i32 {
       numbers.iter().sum()
   }
   ```

3. **重新构建项目**：
   ```bash
   # 重新构建微信小程序版本
   .\build-miniprogram.ps1
   ```

4. **在 JavaScript 中使用新函数**：
   ```javascript
   // 在小程序或网页中调用
   const result1 = wasmModule.divide(10, 3);      // 3.333...
   const result2 = wasmModule.reverse_string("Hello"); // "olleH"
   const result3 = wasmModule.sum_array([1,2,3,4,5]);  // 15
   ```

### 📝 Rust 语法快速入门

#### 基本数据类型
```rust
let number: i32 = 42;        // 32位整数
let decimal: f64 = 3.14;     // 64位浮点数
let text: &str = "Hello";    // 字符串切片
let string: String = String::from("Hello"); // 可变字符串
let flag: bool = true;       // 布尔值
```

#### 函数定义
```rust
// 基本函数
fn my_function(param1: i32, param2: &str) -> String {
    format!("{}: {}", param2, param1)  // 返回格式化字符串
}

// 导出到 WebAssembly 的函数
#[wasm_bindgen]
pub fn exported_function(x: i32) -> i32 {
    x * 2
}
```

#### 控制流
```rust
// if-else
if number > 10 {
    println!("Large number");
} else {
    println!("Small number");
}

// for 循环
for i in 0..5 {
    println!("Number: {}", i);
}

// while 循环
let mut counter = 0;
while counter < 10 {
    counter += 1;
}
```

---

## 🔧 微信小程序集成

### 📋 集成步骤

1. **构建小程序版本**：
   ```bash
   .\build-miniprogram.ps1
   ```

2. **复制文件到小程序项目**：
   ```
   将 pkg-miniprogram/ 中的文件复制到您的小程序项目目录
   ```

3. **在小程序中加载 WASM**：
   ```javascript
   // pages/index/index.js
   Page({
     onLoad() {
       this.loadWasm();
     },
     
     async loadWasm() {
       try {
         // 加载 WASM 模块（具体实现见 MINIPROGRAM_GUIDE.md）
         const wasmModule = await this.initWasmModule();
         
         // 调用 Rust 函数
         const result = wasmModule.add(10, 20);
         console.log('结果:', result);
         
       } catch (error) {
         console.error('WASM 加载失败:', error);
       }
     }
   });
   ```

### 📱 小程序特殊注意事项

1. **文件托管**：WASM 文件需要上传到服务器（微信小程序不能直接包含 WASM 文件）
2. **域名配置**：在小程序后台配置服务器域名白名单
3. **HTTPS 要求**：所有网络请求必须使用 HTTPS

---

## ❓ 新手常见问题

### Q1: 编译时出现 "rustc not found" 错误
**A**: Rust 没有正确安装或没有添加到 PATH
```bash
# 重新安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Q2: "wasm32-unknown-unknown" 目标不存在
**A**: 需要添加 WebAssembly 编译目标
```bash
rustup target add wasm32-unknown-unknown
```

### Q3: wasm-bindgen 命令找不到
**A**: 需要安装 wasm-bindgen 工具
```bash
cargo install wasm-bindgen-cli
```

### Q4: 微信小程序中 WASM 加载失败
**A**: 检查以下几点：
- WASM 文件是否通过 HTTPS 提供
- 域名是否在小程序后台配置白名单
- 文件路径是否正确

### Q5: 修改 Rust 代码后没有效果
**A**: 需要重新构建项目
```bash
.\build-miniprogram.ps1  # 重新构建
```

### Q6: 如何调试 Rust 代码？
**A**: 使用 `console_log!` 宏输出调试信息
```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn debug_function(x: i32) -> i32 {
    console_log!("输入值: {}", x);  // 这会在浏览器控制台输出
    let result = x * 2;
    console_log!("结果: {}", result);
    result
}
```

---

## 🎓 学习资源

### 📚 推荐学习路径
1. **Rust 基础**：[Rust 程序设计语言](https://kaisery.github.io/trpl-zh-cn/)
2. **WebAssembly**：[WebAssembly 官方教程](https://webassembly.org/getting-started/developers-guide/)
3. **wasm-bindgen**：[wasm-bindgen 手册](https://rustwasm.github.io/wasm-bindgen/)

### 🛠️ 实用工具
- **Rust Playground**：[在线 Rust 编辑器](https://play.rust-lang.org/)
- **VS Code 插件**：rust-analyzer（Rust 语言支持）
- **调试工具**：浏览器开发者工具的 WebAssembly 调试功能

---

## 🎉 恭喜！

您现在已经掌握了使用 Rust 开发 WebAssembly 应用的基础知识！

记住：
- 🚀 从小的修改开始练习
- 📖 善用文档和错误信息
- 💬 遇到问题时查看常见问题解答
- 🔄 多实践，逐步提高

祝您的 Rust WebAssembly 之旅愉快！🦀✨