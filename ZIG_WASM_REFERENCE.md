# Zig WebAssembly 编译快速参考

> **⚠️ 适用版本**: Zig 0.15.1+ (新版本语法)

## 🚀 标准编译指令

```bash
# 进入目录
cd zigwasm

# 编译 WASM
zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseSmall --export=add --export=multiply --export=fibonacci

# 指定输出文件名
zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseSmall --export=add --export=multiply --export=fibonacci --name zigwasm
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

---
💡 **一键使用**: 直接复制上面的标准编译指令即可