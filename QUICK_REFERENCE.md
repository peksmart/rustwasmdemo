# 🎯 Rust WebAssembly 快速参考

> 📋 **新手必备**：最常用的命令和代码片段

---

## ⚡ 快速命令

### 🔨 构建命令
```bash
# 微信小程序版本（推荐）
.\build-miniprogram.ps1        # Windows
./build-miniprogram.sh         # Linux/macOS

# 手动构建
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen --target no-modules --out-dir pkg-miniprogram target/wasm32-unknown-unknown/release/rustwasmdemo.wasm
```

### 🔧 环境设置
```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 添加 WebAssembly 目标
rustup target add wasm32-unknown-unknown

# 安装 wasm-bindgen
cargo install wasm-bindgen-cli
```

---

## 📝 Rust 代码模板

### 基础函数模板
```rust
use wasm_bindgen::prelude::*;

// 数学运算
#[wasm_bindgen]
pub fn calculate(a: i32, b: i32) -> i32 {
    a + b
}

// 字符串处理
#[wasm_bindgen]
pub fn process_text(input: &str) -> String {
    format!("处理结果: {}", input.to_uppercase())
}

// 数组处理
#[wasm_bindgen]
pub fn sum_numbers(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}
```

### 调试输出
```rust
// 在文件开头添加
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// 在函数中使用
#[wasm_bindgen]
pub fn debug_function(x: i32) -> i32 {
    console_log!("输入: {}", x);
    let result = x * 2;
    console_log!("输出: {}", result);
    result
}
```

---

## 📱 小程序集成模板

### 基础页面结构
```javascript
// pages/demo/demo.js
Page({
  data: {
    wasmLoaded: false,
    result: ''
  },

  onLoad() {
    this.initWasm();
  },

  async initWasm() {
    try {
      // 加载 JS 绑定
      const jsCode = await this.loadFile('https://domain.com/rustwasmdemo.js');
      eval(jsCode);
      
      // 加载 WASM 二进制
      const wasmBinary = await this.loadBinary('https://domain.com/rustwasmdemo_bg.wasm');
      this.wasm = await wasm_bindgen(wasmBinary);
      
      this.setData({ wasmLoaded: true });
    } catch (error) {
      console.error('WASM 加载失败:', error);
    }
  },

  loadFile(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        success: (res) => resolve(res.data),
        fail: reject
      });
    });
  },

  loadBinary(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        responseType: 'arraybuffer',
        success: (res) => resolve(res.data),
        fail: reject
      });
    });
  },

  // 调用 WASM 函数
  callWasmFunction() {
    if (!this.data.wasmLoaded) return;
    
    const result = this.wasm.your_function_name(parameters);
    this.setData({ result });
  }
});
```

### WXML 模板
```xml
<view class="container">
  <text class="status">WASM 状态: {{wasmLoaded ? '已加载' : '加载中...'}}</text>
  
  <button wx:if="{{wasmLoaded}}" bindtap="callWasmFunction">
    调用 WASM 函数
  </button>
  
  <text class="result">结果: {{result}}</text>
</view>
```

---

## 🔍 常用 Rust 类型对应

| Rust 类型 | JavaScript 类型 | 用途 |
|-----------|----------------|------|
| `i32` | `number` | 32位整数 |
| `f64` | `number` | 64位浮点数 |
| `bool` | `boolean` | 布尔值 |
| `&str` | `string` | 字符串（只读） |
| `String` | `string` | 字符串（可变） |
| `&[i32]` | `Int32Array` | 整数数组 |
| `Vec<i32>` | `Int32Array` | 动态整数数组 |

---

## 🚨 常见错误速查

### 编译错误
```bash
# 错误: "rustc not found"
# 解决: 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 错误: "target may not be installed"  
# 解决: 添加 WASM 目标
rustup target add wasm32-unknown-unknown

# 错误: "wasm-bindgen not found"
# 解决: 安装工具
cargo install wasm-bindgen-cli
```

### 运行时错误
```javascript
// 错误: "wasm_bindgen is not defined"
// 原因: JS 绑定文件没有加载
// 解决: 确保先加载 JS 文件再调用

// 错误: "WebAssembly.instantiate is not a function"
// 原因: 微信版本过低
// 解决: 升级微信到 6.6.6+ 或基础库到 2.4.0+

// 错误: "网络请求失败"
// 原因: 域名未配置或非 HTTPS
// 解决: 在小程序后台配置域名白名单
```

---

## 📁 文件结构速查

```
项目目录/
├── 📄 Cargo.toml              # Rust 项目配置
├── 📁 src/
│   └── 📄 lib.rs             # Rust 源代码
├── 📁 pkg-miniprogram/       # 🎯 小程序版本输出
│   ├── 📄 rustwasmdemo.js    # JS 绑定（全局变量形式）
│   └── 📄 *.wasm             # WASM 二进制
├── 📄 build-miniprogram.ps1  # Windows 构建脚本
├── 📄 build-miniprogram.sh   # Linux/macOS 构建脚本
└── 📁 miniprogram-example/   # 完整小程序示例
```

---

## 🎯 开发流程

1. **修改 Rust 代码** (`src/lib.rs`)
2. **运行构建脚本** (`.\build-miniprogram.ps1`)
3. **上传文件到服务器** (`pkg-miniprogram/`)
4. **在小程序中测试** 
5. **重复以上步骤**

---

## 📚 学习资源

- 🦀 [Rust 语言官方教程](https://kaisery.github.io/trpl-zh-cn/)
- 📦 [wasm-bindgen 手册](https://rustwasm.github.io/wasm-bindgen/)
- 🎮 [Rust 在线练习](https://play.rust-lang.org/)
- 📱 [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/)

---

*🔖 建议将此页面加入书签，开发时随时查阅！*