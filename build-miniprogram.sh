#!/bin/bash
# 微信小程序WebAssembly构建脚本

echo "开始构建微信小程序兼容的WebAssembly模块..."

# 清理之前的构建
echo "清理之前的构建文件..."
if [ -d "pkg-miniprogram" ]; then
    rm -rf pkg-miniprogram
fi

# 使用cargo构建wasm文件
echo "编译Rust代码为WebAssembly..."
cargo build --target wasm32-unknown-unknown --release

# 检查wasm文件是否生成成功
if [ ! -f "target/wasm32-unknown-unknown/release/rustwasmdemo.wasm" ]; then
    echo "错误: WebAssembly编译失败"
    exit 1
fi

# 使用wasm-bindgen生成微信小程序兼容的JavaScript绑定
echo "生成微信小程序兼容的JavaScript绑定..."
wasm-bindgen \
    --target no-modules \
    --out-dir pkg-miniprogram \
    --out-name rustwasmdemo \
    --no-typescript \
    target/wasm32-unknown-unknown/release/rustwasmdemo.wasm

# 检查生成是否成功
if [ ! -f "pkg-miniprogram/rustwasmdemo.js" ]; then
    echo "错误: JavaScript绑定生成失败"
    exit 1
fi

echo "✅ 微信小程序WebAssembly模块构建完成!"
echo "生成的文件位于: pkg-miniprogram/"
echo "- rustwasmdemo.js: JavaScript绑定文件"
echo "- rustwasmdemo_bg.wasm: WebAssembly二进制文件"
echo ""
echo "使用说明："
echo "1. 将pkg-miniprogram文件夹中的文件复制到您的微信小程序项目中"
echo "2. 在小程序页面中通过全局变量访问WASM模块"
echo "3. 详见生成的示例文件"