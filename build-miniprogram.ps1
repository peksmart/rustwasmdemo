# 微信小程序WebAssembly构建脚本 (PowerShell)

Write-Host "开始构建微信小程序兼容的WebAssembly模块..." -ForegroundColor Green

# 清理之前的构建
Write-Host "清理之前的构建文件..." -ForegroundColor Yellow
if (Test-Path "pkg-miniprogram") {
    Remove-Item -Recurse -Force "pkg-miniprogram"
}

# 使用cargo构建wasm文件
Write-Host "编译Rust代码为WebAssembly..." -ForegroundColor Yellow
cargo build --target wasm32-unknown-unknown --release

# 检查wasm文件是否生成成功
if (-not (Test-Path "target/wasm32-unknown-unknown/release/rustwasmdemo.wasm")) {
    Write-Host "错误: WebAssembly编译失败" -ForegroundColor Red
    exit 1
}

# 使用wasm-bindgen生成微信小程序兼容的JavaScript绑定
Write-Host "生成微信小程序兼容的JavaScript绑定..." -ForegroundColor Yellow
wasm-bindgen `
    --target no-modules `
    --out-dir pkg-miniprogram `
    --out-name rustwasmdemo `
    --no-typescript `
    target/wasm32-unknown-unknown/release/rustwasmdemo.wasm

# 检查生成是否成功
if (-not (Test-Path "pkg-miniprogram/rustwasmdemo.js")) {
    Write-Host "错误: JavaScript绑定生成失败" -ForegroundColor Red
    exit 1
}

Write-Host "构建完成!" -ForegroundColor Green
Write-Host "生成的文件位于: pkg-miniprogram/" -ForegroundColor Cyan
Write-Host "- rustwasmdemo.js: JavaScript绑定文件" -ForegroundColor White
Write-Host "- rustwasmdemo_bg.wasm: WebAssembly二进制文件" -ForegroundColor White