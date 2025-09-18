// 简化的 WASM 模块测试

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

export fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

export fn fibonacci(n: i32) i32 {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
