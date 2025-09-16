# 微信小程序 Rust WebAssembly 使用指南

> 📱 **专为微信小程序开发者准备**  
> 🎯 **特别适合 Rust 新手**  
> ✨ **免修改生成代码的解决方案**

## 📋 目录
- [🎯 快速开始](#-快速开始)
- [📖 项目概述](#-项目概述)
- [⚙️ 环境要求](#️-环境要求)
- [🔨 构建步骤](#-构建步骤)
- [📱 小程序集成](#-小程序集成)
- [🚀 实际部署](#-实际部署)
- [❓ 新手常见问题](#-新手常见问题)

---

## 🎯 快速开始

### ⚡ 30秒快速体验
```bash
# 1. 构建微信小程序版本
.\build-miniprogram.ps1

# 2. 查看生成的文件
ls pkg-miniprogram/
# 输出：rustwasmdemo.js, rustwasmdemo_bg.wasm

# 3. 复制到您的小程序项目中使用！
```

---

## 📖 项目概述

### 🎯 解决的核心问题
**问题**：标准 wasm-bindgen 生成的代码使用 ES6 模块（import/export），微信小程序不支持  
**解决方案**：使用 `--target no-modules` 生成全局变量形式的代码  
**优势**：无需手动修改生成的 JavaScript 代码，保持构建流程的自动化

### 🔍 技术对比
| 特性 | 标准版本 | 微信小程序版本 |
|------|----------|----------------|
| 模块系统 | ES6 (import/export) | 全局变量 |
| TypeScript | 包含 .d.ts 文件 | 无 TypeScript 文件 |
| 兼容性 | 现代浏览器 | 微信小程序 + 浏览器 |
| 维护性 | 需要手动修改 | 自动化构建 |

---

## ⚙️ 环境要求

### 🔧 开发环境检查清单

#### ✅ 必需工具
1. **Rust 工具链**
   ```bash
   # 检查是否已安装
   rustc --version
   cargo --version
   
   # 如果没有，请安装：https://rustup.rs/
   ```

2. **WebAssembly 目标**
   ```bash
   # 添加 WASM 编译目标
   rustup target add wasm32-unknown-unknown
   ```

3. **wasm-bindgen 工具**
   ```bash
   # 第一次运行构建脚本时会自动安装
   # 或手动安装：
   cargo install wasm-bindgen-cli
   ```

#### 🎯 微信小程序环境
- 微信开发者工具
- 小程序项目（用于集成测试）
- HTTPS 服务器（用于托管 WASM 文件）

---

## 🔨 构建步骤

### 🚀 自动构建（推荐）

#### Windows 用户
```powershell
# 在项目根目录执行
.\build-miniprogram.ps1
```

#### Linux/macOS 用户
```bash
# 在项目根目录执行
chmod +x build-miniprogram.sh
./build-miniprogram.sh
```

### 🔧 手动构建（理解原理）

```bash
# 步骤1: 编译 Rust 代码为 WebAssembly
cargo build --target wasm32-unknown-unknown --release

# 步骤2: 生成微信小程序兼容的 JavaScript 绑定
wasm-bindgen \
    --target no-modules \          # 🔑 关键：不使用 ES6 模块
    --out-dir pkg-miniprogram \    # 🔑 输出到专用目录
    --out-name rustwasmdemo \      # 🔑 指定文件名
    --no-typescript \              # 🔑 不生成 TypeScript 文件
    target/wasm32-unknown-unknown/release/rustwasmdemo.wasm
```

### 📦 构建结果验证

构建成功后，应该看到：
```
pkg-miniprogram/
├── rustwasmdemo.js          # 约 8KB，JavaScript 绑定文件
└── rustwasmdemo_bg.wasm     # 约 25KB，WebAssembly 二进制文件
```

**验证代码兼容性**：
```bash
# 检查生成的 JS 文件中不包含 ES6 模块语法
grep -n "^import\|^export" pkg-miniprogram/rustwasmdemo.js
# 应该无结果（表示兼容小程序）
```

---

## 📱 小程序集成

### 📋 集成前准备

1. **文件部署准备**
   ```
   将 pkg-miniprogram/ 中的文件上传到您的服务器
   建议目录结构：
   https://your-domain.com/wasm/
   ├── rustwasmdemo.js
   └── rustwasmdemo_bg.wasm
   ```

2. **域名配置**
   - 在微信小程序后台配置服务器域名白名单
   - 确保使用 HTTPS 协议

### 🔧 基础集成代码

#### 小程序页面文件结构
```
pages/wasm-demo/
├── wasm-demo.js    # 页面逻辑
├── wasm-demo.wxml  # 页面结构  
├── wasm-demo.wxss  # 页面样式
└── wasm-demo.json  # 页面配置
```

#### 核心加载逻辑 (wasm-demo.js)
```javascript
Page({
  data: {
    wasmLoaded: false,
    result: '',
    loading: false
  },

  onLoad() {
    this.initWasm();
  },

  // 🔑 核心：WASM 模块初始化
  async initWasm() {
    try {
      this.setData({ loading: true });
      
      // 第一步：加载 JavaScript 绑定文件
      const jsCode = await this.loadJSBinding();
      
      // 第二步：执行 JS 代码，获得初始化函数
      const wasmInit = eval(jsCode + '; wasm_bindgen');
      
      // 第三步：加载 WASM 二进制文件并初始化
      const wasmBinary = await this.loadWasmBinary();
      this.wasmModule = await wasmInit(wasmBinary);
      
      this.setData({ 
        wasmLoaded: true, 
        loading: false,
        result: 'WASM 模块加载成功！'
      });
      
    } catch (error) {
      console.error('WASM 初始化失败:', error);
      this.setData({ 
        loading: false,
        result: 'WASM 加载失败: ' + error.message 
      });
    }
  },

  // 📥 加载 JavaScript 绑定文件
  loadJSBinding() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://your-domain.com/wasm/rustwasmdemo.js',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        },
        fail: reject
      });
    });
  },

  // 📥 加载 WASM 二进制文件
  loadWasmBinary() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://your-domain.com/wasm/rustwasmdemo_bg.wasm',
        method: 'GET',
        responseType: 'arraybuffer',
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        },
        fail: reject
      });
    });
  },

  // 🧮 调用 WASM 函数示例
  testAddition() {
    if (!this.data.wasmLoaded) {
      wx.showToast({ title: '请等待 WASM 加载完成' });
      return;
    }

    try {
      const result = this.wasmModule.add(10, 20);
      this.setData({ 
        result: `10 + 20 = ${result}` 
      });
    } catch (error) {
      console.error('调用 WASM 函数失败:', error);
    }
  },

  testGreeting() {
    if (!this.data.wasmLoaded) return;

    try {
      const greeting = this.wasmModule.greet('微信用户');
      this.setData({ result: greeting });
    } catch (error) {
      console.error('调用 WASM 函数失败:', error);
    }
  }
});
```

#### 页面结构 (wasm-demo.wxml)
```xml
<view class="container">
  <view class="header">
    <text class="title">Rust WebAssembly 演示</text>
  </view>

  <!-- 加载状态 -->
  <view class="status-section">
    <text class="status-label">模块状态:</text>
    <text class="status {{wasmLoaded ? 'loaded' : 'loading'}}">
      {{loading ? '正在加载...' : (wasmLoaded ? '已加载' : '未加载')}}
    </text>
  </view>

  <!-- 功能测试按钮 -->
  <view class="button-section" wx:if="{{wasmLoaded}}">
    <button bindtap="testAddition" type="primary">测试加法运算</button>
    <button bindtap="testGreeting" type="primary">测试问候语生成</button>
  </view>

  <!-- 结果显示 -->
  <view class="result-section" wx:if="{{result}}">
    <text class="result-label">结果:</text>
    <text class="result-text">{{result}}</text>
  </view>
</view>
```

#### 样式文件 (wasm-demo.wxss)
```css
.container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.status-section {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 20rpx;
  background-color: white;
  border-radius: 10rpx;
}

.status-label {
  font-size: 28rpx;
  margin-right: 20rpx;
  color: #666;
}

.status.loading {
  color: #ff9500;
}

.status.loaded {
  color: #34c759;
  font-weight: bold;
}

.button-section {
  margin-bottom: 40rpx;
}

.button-section button {
  margin-bottom: 20rpx;
  width: 100%;
}

.result-section {
  padding: 30rpx;
  background-color: #e8f5e8;
  border-radius: 10rpx;
  border-left: 8rpx solid #34c759;
}

.result-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.result-text {
  font-size: 28rpx;
  color: #155724;
  word-wrap: break-word;
}
```

---

## 🚀 实际部署

### 🌐 服务器部署指南

#### 选择1: 使用云存储服务
```bash
# 腾讯云对象存储 COS
# 1. 创建存储桶
# 2. 上传 WASM 文件
# 3. 配置 HTTPS 访问
# 4. 设置 CORS 策略
```

#### 选择2: 使用 CDN 服务
```bash
# 推荐配置
Content-Type: application/wasm  # 对于 .wasm 文件
Content-Type: application/javascript  # 对于 .js 文件
Cache-Control: public, max-age=31536000  # 缓存策略
```

#### 选择3: 自建服务器
```nginx
# Nginx 配置示例
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    location /wasm/ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type';
        
        location ~* \.wasm$ {
            add_header Content-Type application/wasm;
        }
        
        location ~* \.js$ {
            add_header Content-Type application/javascript;
        }
    }
}
```

### 📝 小程序后台配置

1. **登录微信小程序后台**
2. **设置 → 开发设置 → 服务器域名**
3. **添加 request 合法域名**：
   ```
   https://your-domain.com
   ```

### 🔍 部署验证

```javascript
// 在小程序中测试文件可访问性
wx.request({
  url: 'https://your-domain.com/wasm/rustwasmdemo.js',
  success: (res) => {
    console.log('JS 文件加载成功');
  },
  fail: (err) => {
    console.error('JS 文件加载失败:', err);
  }
});
```

---

## ❓ 新手常见问题

### 🔧 构建问题

#### Q1: "cargo: command not found"
**解决方案**：
```bash
# 安装 Rust 工具链
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Windows 用户可下载安装包：https://rustup.rs/
```

#### Q2: "error: the 'wasm32-unknown-unknown' target may not be installed"
**解决方案**：
```bash
rustup target add wasm32-unknown-unknown
```

#### Q3: "wasm-bindgen: command not found"
**解决方案**：
```bash
cargo install wasm-bindgen-cli
# 或者直接运行构建脚本，会自动安装
```

### 📱 小程序集成问题

#### Q4: WASM 文件加载失败（网络错误）
**检查项目**：
- [ ] 文件 URL 是否正确
- [ ] 是否使用 HTTPS
- [ ] 域名是否已添加到小程序白名单
- [ ] 服务器是否设置了正确的 CORS 头

#### Q5: "wasm_bindgen is not defined"
**原因**：JavaScript 绑定文件没有正确加载  
**解决方案**：
```javascript
// 确保先加载 JS 文件，再初始化 WASM
const jsCode = await this.loadJSBinding();
eval(jsCode);  // 执行 JS 代码，定义 wasm_bindgen
const wasmModule = await wasm_bindgen(wasmBinary);
```

#### Q6: "TypeError: WebAssembly.instantiate is not a function"
**原因**：微信小程序版本过低  
**解决方案**：
- 确保微信版本 ≥ 6.6.6
- 在开发者工具中检查基础库版本 ≥ 2.4.0

### 🐛 运行时问题

#### Q7: WASM 函数调用时抛出异常
**调试步骤**：
```javascript
try {
  const result = wasmModule.add(10, 20);
} catch (error) {
  console.error('WASM 调用失败:', error);
  // 检查参数类型是否正确
  // 检查函数名是否拼写正确
}
```

#### Q8: 中文字符显示乱码
**解决方案**：
```rust
// 在 Rust 中正确处理 UTF-8
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("你好, {}!", name)  // Rust 原生支持 UTF-8
}
```

#### Q9: 内存使用过高
**优化建议**：
```rust
// 使用 wee_alloc 减少内存占用
use wee_alloc;
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
```

### 📊 性能优化

#### Q10: WASM 文件太大
**优化方案**：
```toml
# Cargo.toml 中启用优化
[profile.release]
opt-level = "s"      # 优化文件大小
lto = true           # 链接时优化
codegen-units = 1    # 减少代码单元
panic = "abort"      # 减小二进制大小
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **缓存 WASM 模块**
   ```javascript
   // 避免重复加载
   if (!getApp().globalData.wasmModule) {
     getApp().globalData.wasmModule = await this.initWasm();
   }
   ```

2. **错误处理**
   ```javascript
   // 提供降级方案
   if (!wasmSupported) {
     // 使用 JavaScript 实现相同功能
     return this.jsImplementation();
   }
   ```

3. **预加载策略**
   ```javascript
   // 在 app.js 中预加载
   App({
     onLaunch() {
       this.preloadWasm();
     }
   });
   ```

### ❌ 避免的问题

1. **不要在主线程进行大量计算**
2. **不要忽略错误处理**
3. **不要在每个页面重复加载 WASM**
4. **不要将敏感逻辑完全依赖 WASM（客户端代码可被分析）**

---

## 🎉 总结

通过本指南，您应该能够：

✅ 理解微信小程序 WebAssembly 的特殊要求  
✅ 成功构建兼容小程序的 WASM 模块  
✅ 在小程序中正确加载和使用 WASM 功能  
✅ 处理常见的集成问题  
✅ 优化性能和用户体验  

🚀 **下一步**：尝试添加更多 Rust 函数，构建更复杂的 WebAssembly 应用！

📚 **更多资源**：
- [Rust 新手指南](./RUST_BEGINNER_GUIDE.md)
- [项目构建总结](./BUILD_SUMMARY.md)
- [完整示例项目](./miniprogram-example/)

---

*最后更新：2025年9月16日*