@echo off
echo ================================================
echo           Zig WebAssembly 编译脚本
echo ================================================
echo.

REM 检查是否存在 zigwasm 目录
if not exist "zigwasm" (
    echo 错误：未找到 zigwasm 目录！
    echo 请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

cd zigwasm

echo 正在编译 Zig WASM...
echo.

REM 编译 WASM (Zig 0.15.1+ 标准方法)
zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseSmall --export=add --export=multiply --export=fibonacci --name zigwasm

REM 检查编译结果
if exist "zigwasm.wasm" (
    echo.
    echo ✅ 编译成功！
    echo 📁 输出文件：zigwasm\zigwasm.wasm
    
    for %%F in (zigwasm.wasm) do (
        echo 📊 文件大小：%%~zF 字节
    )
    
    echo.
    echo 🚀 可以在浏览器中测试 WASM 文件了！
) else (
    echo.
    echo ❌ 编译失败！
    echo 请检查 Zig 代码是否有语法错误
)

echo.
echo ================================================
pause