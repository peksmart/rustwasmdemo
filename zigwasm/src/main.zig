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
// 参数：age - 年龄
// 返回：字符串在内存中的起始位置
export fn greet(age: i32) i32 {
    var greeting: []const u8 = undefined;

    if (age < 18) {
        greeting = "你好，年轻人！未来属于你们！";
    } else if (age < 30) {
        greeting = "你好，青年朋友！正是拼搏的好时光！";
    } else if (age < 60) {
        greeting = "你好！事业有成，家庭幸福！";
    } else {
        greeting = "您好！祝您身体健康，万事如意！";
    }

    // 将字符串复制到内存的开头
    @memcpy(memory[0..greeting.len], greeting);

    // 返回字符串长度（JavaScript需要知道读取多少字节）
    return @intCast(greeting.len);
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
    for (0..input_len) |i| {
        memory[output_start + i] = input[input_len - 1 - i];
    }

    return @intCast(input_len);
}

// 获取反转字符串的内存地址
export fn getReversedPtr() i32 {
    return @intCast(@intFromPtr(&memory[1024]));
}
