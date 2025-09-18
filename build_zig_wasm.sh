#!/bin/bash

echo "================================================"
echo "           Zig WebAssembly 编译脚本"
echo "================================================"
echo

# 检查是否存在 zigwasm 目录
if [ ! -d "zigwasm" ]; then
    echo "❌ 错误：未找到 zigwasm 目录！"
    echo "请确保在项目根目录运行此脚本"
    exit 1
fi

# 进入 zigwasm 目录
cd zigwasm

echo "正在编译 Zig WASM..."
echo "使用优化：ReleaseSmall (最小体积)"
echo

# 编译 WASM
zig build-lib src/main.zig -target wasm32-freestanding -dynamic -rdynamic -O ReleaseSmall --name zigwasm

# 检查编译结果
if [ -f "zigwasm.wasm" ]; then
    echo
    echo "✅ 编译成功！"
    echo "📁 输出文件：zigwasm/zigwasm.wasm"
    
    # 显示文件大小
    file_size=$(wc -c < zigwasm.wasm)
    echo "📊 文件大小：${file_size} 字节"
    
    echo
    echo "🚀 可以在浏览器中测试 WASM 文件了！"
else
    echo
    echo "❌ 编译失败！"
    echo "请检查 Zig 代码是否有语法错误"
    exit 1
fi

echo
echo "================================================"