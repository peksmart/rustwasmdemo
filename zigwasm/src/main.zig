// Zig WASM 模块 for 微信小程序
// 适用于 Zig 0.15.1

const std = @import("std");

// 导出内存给JavaScript使用
export var memory: [4096]u8 = undefined;

// 加法函数
export fn add(a: i32, b: i32) i32 {
    return a + b;
}

// 乘法函数
export fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

// 斐波那契数列计算
export fn fibonacci(n: i32) i32 {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 字符串处理：生成问候语
// 参数：ptr - 输入姓名字符串的指针，len - 字符串长度
// 返回：问候语字符串的长度
export fn greet(ptr: i32, len: i32) i32 {
    const input_start: usize = @intCast(ptr);
    const input_len: usize = @intCast(len);

    // 从内存中读取输入的姓名
    const name = memory[input_start .. input_start + input_len];

    // 构造问候语（简单拼接）
    const greeting_prefix = "你好，";
    const greeting_suffix = "！欢迎使用 Zig WebAssembly！";

    const output_start: usize = 0;
    var offset: usize = 0;

    // 拼接问候语
    @memcpy(memory[output_start + offset .. output_start + offset + greeting_prefix.len], greeting_prefix);
    offset += greeting_prefix.len;

    @memcpy(memory[output_start + offset .. output_start + offset + name.len], name);
    offset += name.len;

    @memcpy(memory[output_start + offset .. output_start + offset + greeting_suffix.len], greeting_suffix);
    offset += greeting_suffix.len;

    return @intCast(offset);
}

// 获取内存地址的辅助函数
export fn getMemoryPtr() i32 {
    return @intCast(@intFromPtr(&memory[0]));
}

// 字符串反转功能
// 参数：ptr - 输入字符串的指针，len - 字符串长度
// 返回：反转后字符串的长度
export fn reverseString(ptr: i32, len: i32) i32 {
    const input_start: usize = @intCast(ptr);
    const input_len: usize = @intCast(len);

    // 从内存中读取输入字符串
    const input = memory[input_start .. input_start + input_len];

    // 反转字符串到内存的另一个位置（从1024字节开始）
    const output_start: usize = 1024;

    // 简单的字节反转（注意：这对于多字节UTF-8字符可能不正确）
    // 为了简单起见，我们按字节反转
    for (0..input_len) |i| {
        memory[output_start + i] = input[input_len - 1 - i];
    }

    return @intCast(input_len);
}

// 获取反转字符串的内存地址
export fn getReversedPtr() i32 {
    return @intCast(@intFromPtr(&memory[1024]));
}
