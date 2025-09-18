#![no_std]

// 使用 core，避免引入需要引用类型的 runtime 支持

#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

// 我们通过导出一个使用函数指针数组的函数，迫使生成单一 funcref 表。
// 重要：仅使用 funcref；避免 externref 等，会导致额外表段。
#[no_mangle]
pub extern "C" fn apply_unop(x: i32, op: i32) -> i32 {
    // 定义若干简单的一元操作
    fn neg(v: i32) -> i32 { -v }
    fn inc(v: i32) -> i32 { v + 1 }
    fn dec(v: i32) -> i32 { v - 1 }

    // 将函数收集成静态表（编译器会以 funcref 表实现 call_indirect）
    let table: [fn(i32) -> i32; 3] = [neg, inc, dec];

    // 安全索引，越界则回退为 0 号
    let idx = if op >= 0 && (op as usize) < table.len() { op as usize } else { 0 };
    let f = table[idx];
    f(x)
}

// 一个无副作用的填充函数，避免链接器丢弃导出，帮助演示
#[no_mangle]
pub extern "C" fn identity(x: i32) -> i32 { x }

// 注意：不要启用 wasm-bindgen/externref/anyref 等特性；仅导出 C ABI 简单函数。

// 提供最小 panic 处理器，满足 no_std 链接需求（panic 策略为 abort）
// 仅在非测试构建下提供 panic 处理器，避免与测试环境引入的 std 冲突
#[cfg(not(test))]
use core::panic::PanicInfo;

#[cfg(not(test))]
#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}
