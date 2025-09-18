# 微信小程序 Rust WebAssembly 示例

这个项目演示了如何在微信小程序中使用 Rust 编译的 WebAssembly (WASM) 模块。

## 项目结构

```
miniprogram/
├── app.js                    # 小程序入口
├── app.json                  # 小程序配置
├── app.wxss                  # 全局样式
├── rustwasmdemo_bg.wasm      # Rust 编译的 WASM 文件
├── pages/
│   ├── index/                # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── wasm/                 # WASM 示例页面
│       ├── wasm.js
│       ├── wasm.json
│       ├── wasm.wxml
│       └── wasm.wxss
├── utils/
│   └── wasm-adapter.js       # WASM 适配器
└── components/
    └── navigation-bar/       # 导航栏组件
```

## 功能特性

### 1. 数学运算
- **加法运算**: 使用 Rust WASM 实现的 `add` 函数
- **乘法运算**: 使用 Rust WASM 实现的 `multiply` 函数

### 2. 字符串处理
- **问候语生成**: 使用 Rust WASM 实现的 `greet` 函数，支持中文字符串处理

### 3. 高级计算
- **阶乘计算**: 使用 Rust WASM 实现的 `factorial` 函数

## 技术实现

### 1. WASM 加载
使用微信小程序官方的 `WXWebAssembly.instantiate` API：

```javascript
const wasmModule = await WXWebAssembly.instantiate('/rustwasmdemo_bg.wasm', {
  env: {
    // 导入的环境函数
  }
});
```

### 2. 字符串处理
由于 WASM 只能直接处理数字类型，字符串需要通过内存操作：

```javascript
// 编码字符串到 WASM 内存
encodeString(str) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const ptr = this.exports.__wbindgen_malloc(encoded.length);
  const memory = this.getUint8ArrayMemory();
  memory.set(encoded, ptr);
  return { ptr, len: encoded.length };
}

// 从 WASM 内存解码字符串
decodeString(ptr, len) {
  const memory = this.getUint8ArrayMemory();
  const decoder = new TextDecoder();
  return decoder.decode(memory.subarray(ptr, ptr + len));
}
```

### 3. 错误处理和降级
为了提高稳定性，所有 WASM 调用都包含错误处理和 JavaScript 降级实现：

```javascript
greet(name) {
  if (!this.exports.greet) {
    // JavaScript 降级实现
    return `你好, ${name}! 欢迎使用 Rust WebAssembly!`;
  }
  
  try {
    // WASM 实现
    // ...
  } catch (error) {
    // 降级到 JavaScript 实现
    return `你好, ${name}! 欢迎使用 Rust WebAssembly!`;
  }
}
```

## 使用方法

### 1. 开发环境设置
确保你的微信开发者工具支持基础库 v2.13.0 或更高版本，以使用 WXWebAssembly 功能。

### 2. 运行项目
1. 使用微信开发者工具打开 `miniprogram` 目录
2. 确保基础库版本设置为 2.13.0 或更高
3. 点击预览或真机调试

### 3. 测试功能
1. 在首页点击"🦀 WASM 示例"进入功能页面
2. 尝试不同的数学运算
3. 输入姓名测试字符串处理
4. 计算数字的阶乘

## 注意事项

### 1. 兼容性
- 需要微信基础库 v2.13.0 或更高版本
- iOS 平台暂不支持 WXWebAssembly.Global
- 小程序插件从基础库 v2.18.1 开始支持

### 2. 性能优化
- WASM 文件较大时可以使用 brotli 压缩 (`.wasm.br`)
- 可以将大的 WASM 文件拆分为多个小文件
- 利用分包加载减少首包体积

### 3. 调试技巧
- 查看控制台日志了解 WASM 加载状态
- 所有 WASM 函数调用都有详细的错误处理
- 提供了 JavaScript 降级实现确保功能可用

## 相关文档

- [微信小程序 WXWebAssembly 官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/wasm.html)
- [WebAssembly 官方文档](https://webassembly.org/)
- [wasm-bindgen 文档](https://rustwasm.github.io/wasm-bindgen/)

## 问题排查

### WASM 加载失败
1. 检查 WASM 文件路径是否正确
2. 确认基础库版本支持 WXWebAssembly
3. 查看控制台错误信息

### 函数调用失败
1. 检查 WASM 模块是否正确导出函数
2. 确认参数类型和数量正确
3. 查看适配器中的错误处理逻辑