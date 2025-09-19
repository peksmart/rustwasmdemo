// Zig WASM 模块 for 微信小程序
// 适用于 Zig 0.15.1

const std = @import("std");

// 全局内存缓冲区的起始指针
const MEMORY_SIZE = 4096;
var memory_buffer: [MEMORY_SIZE]u8 = [_]u8{0} ** MEMORY_SIZE;

// 获取内存起始地址（返回为整数指针）
export fn getMemoryAddress() u32 {
    return @intFromPtr(&memory_buffer[0]);
}

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
    const name = memory_buffer[input_start .. input_start + input_len];

    // 使用简单的英文问候语避免中文编码问题
    const greeting_prefix = "Hello, ";
    const greeting_suffix = "! Welcome to Zig WASM!";

    const output_start: usize = 0;
    var offset: usize = 0;

    // 拼接问候语
    for (greeting_prefix) |byte| {
        memory_buffer[output_start + offset] = byte;
        offset += 1;
    }

    for (name) |byte| {
        memory_buffer[output_start + offset] = byte;
        offset += 1;
    }

    for (greeting_suffix) |byte| {
        memory_buffer[output_start + offset] = byte;
        offset += 1;
    }

    return @intCast(offset);
}

// 字符串反转功能
// 参数：ptr - 输入字符串的指针，len - 字符串长度
// 返回：反转后字符串的长度
export fn reverseString(ptr: i32, len: i32) i32 {
    const input_start: usize = @intCast(ptr);
    const input_len: usize = @intCast(len);

    // 从内存中读取输入字符串
    const input = memory_buffer[input_start .. input_start + input_len];

    // 反转字符串到内存的另一个位置（从1024字节开始）
    const output_start: usize = 1024;

    // 简单的字节反转
    var i: usize = 0;
    while (i < input_len) : (i += 1) {
        memory_buffer[output_start + i] = input[input_len - 1 - i];
    }

    return @intCast(input_len);
}

// 获取反转字符串的内存地址
export fn getReversedPtr() i32 {
    return 1024; // 返回反转字符串在内存中的偏移量
}
