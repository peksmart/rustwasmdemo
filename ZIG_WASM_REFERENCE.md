# Zig WebAssembly 编译快速参考

> **⚠️ 适用版本**: Zig 0.15.1+ (新版本语法)

## 🚀 标准编译指令

```bash
# 进入目录
cd zigwasm

# 编译 WASM（基础函数）
zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseSmall --export=add --export=multiply --export=fibonacci

# 编译 WASM（包含字符串处理函数）
zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseSmall --export=add --export=multiply --export=fibonacci --export=greet --export=reverseString --export=getMemoryAddress --name zigwasm

# 复制到小程序目录
copy zigwasm.wasm ..\miniprogram\zigwasm.wasm
```

## 📖 命令参数详解

### 基础命令结构
```bash
zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseSmall --export=函数名 --name 输出名
```

### 参数说明

| 参数 | 作用 | 说明 |
|------|------|------|
| `build-exe` | 编译类型 | 编译为可执行文件（WASM模块） |
| `src/main.zig` | 源文件 | 要编译的 Zig 源代码文件路径 |
| `-target wasm32-freestanding` | 目标平台 | 编译为 32位 WebAssembly，无操作系统依赖 |
| `-fno-entry` | 无入口点 | 不需要 main 函数，用于库模块 |
| `-O ReleaseSmall` | 优化等级 | 优化文件大小，适合 Web 分发 |
| `--export=函数名` | 导出函数 | 将 Zig 函数导出给 JavaScript 调用 |
| `--name zigwasm` | 输出文件名 | 指定生成的 .wasm 文件名 |

### 关键参数详解

**`-target wasm32-freestanding`**
- `wasm32`: 32位 WebAssembly 架构
- `freestanding`: 独立环境，不依赖特定操作系统

**`-fno-entry`** 
- 告诉编译器这不是一个完整的程序
- 不需要 `main()` 函数作为程序入口
- 用于编译库模块和 WASM 模块

**`--export=函数名`**
- 必须为每个要在 JavaScript 中调用的函数添加此参数
- 不导出的函数 JavaScript 无法访问
- 可以重复使用导出多个函数

## 📋 导出函数说明

### 数学运算函数
- `add` - 加法运算
- `multiply` - 乘法运算  
- `fibonacci` - 斐波那契数列计算

### 字符串处理函数
- `greet` - 生成问候语（输入姓名，返回问候文本）
- `reverseString` - 字符串反转

### 内存管理函数
- `getMemoryAddress` - 获取 WASM 内存缓冲区地址

## 🔧 函数参数说明

### 字符串函数的内存布局
```
内存缓冲区基址 + 偏移量:
├── +0     : greet 函数输出区域
├── +1024  : reverseString 函数输出区域  
├── +2048  : reverseString 函数输入区域
└── +3072  : greet 函数输入区域
```

## 🎯 优化等级

| 优化等级 | 特点 | 使用场景 |
|---------|------|---------|
| `-O Debug` | 编译快，体积大，有调试信息 | 开发调试 |
| `-O ReleaseSmall` | 体积小，适合Web分发 | **生产环境推荐** |
| `-O ReleaseFast` | 运行快，体积较大 | 性能优先 |
| `-O ReleaseSafe` | 保留安全检查，适中体积 | 安全优先 |

## 📁 输出文件

编译成功后生成：`zigwasm.wasm` (或 `main.wasm`)

## 🚨 重要提示

1. **必须使用** `zig build-exe` 而不是 `build-lib`
2. **必须添加** `-fno-entry` 参数
3. **必须显式导出** 每个函数 `--export=函数名`
4. **推荐使用** `-O ReleaseSmall` 优化等级
5. **内存管理** 字符串函数使用专用内存缓冲区进行数据交换

## ⚠️ 注意事项

- 字符串函数目前使用英文输出避免 UTF-8 编码问题
- 内存布局固定，不要随意修改偏移量
- 确保 JavaScript 适配器使用 `getMemoryAddress()` 获取正确的内存地址

---
💡 **一键使用**: 直接复制上面的标准编译指令即可