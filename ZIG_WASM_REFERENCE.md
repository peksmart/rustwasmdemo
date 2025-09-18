# Zig WebAssembly 编译快速参考

## 🚀 常用编译指令

### 基础编译
```bash
# 进入目录
cd zigwasm

# 编译 WASM (生产环境推荐)
zig build-lib src/main.zig -target wasm32-freestanding -dynamic -rdynamic -O ReleaseSmall

# 编译并指定输出名称
zig build-lib src/main.zig -target wasm32-freestanding -dynamic -rdynamic -O ReleaseSmall --name zigwasm
```

### 快速使用脚本
```bash
# Windows
.\build_zig_wasm.bat

# Linux/Mac
./build_zig_wasm.sh
```

## 📋 优化等级选择

| 优化等级 | 用途 | 特点 |
|---------|------|------|
| `-O Debug` | 开发调试 | 编译快，体积大，有调试信息 |
| `-O ReleaseFast` | 性能优先 | 运行快，体积较大 |
| `-O ReleaseSmall` | 体积优先 | 体积小，适合Web分发 |
| `-O ReleaseSafe` | 安全优先 | 保留安全检查，适中体积 |

## 🎯 目标参数说明

- `wasm32-freestanding`: 32位WASM，无操作系统依赖
- `-dynamic`: 生成动态链接库
- `-rdynamic`: 导出符号供JavaScript调用

## 📁 输出文件

编译成功后会在 `zigwasm/` 目录生成：
- `zigwasm.wasm`: WebAssembly二进制文件

## 🔍 验证编译结果

```bash
# 查看文件信息
file zigwasm.wasm

# 查看文件大小
ls -lh zigwasm.wasm  # Linux/Mac
dir zigwasm.wasm     # Windows

# 检查导出函数 (需要 wabt 工具包)
wasm-objdump -x zigwasm.wasm
wasm2wat zigwasm.wasm -o zigwasm.wat
```

## 🚨 常见问题

1. **编译错误**: 检查 `src/main.zig` 语法
2. **找不到文件**: 确保在项目根目录运行
3. **权限问题**: Linux/Mac 用户需要 `chmod +x *.sh`

---
💡 **提示**: 推荐使用 `-O ReleaseSmall` 优化等级，在Web环境下获得最佳的体积/性能平衡。