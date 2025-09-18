// 最简的 WASM 模块
// 导出一个简单的加法函数

pub export fn add(a: i32, b: i32) i32 {
    return a + b;
}

pub export fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

pub export fn fibonacci(n: i32) i32 {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
