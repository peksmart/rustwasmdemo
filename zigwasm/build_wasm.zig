const std = @import("std");

pub fn build(b: *std.Build) void {
    // 设置 WASM 目标
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });

    const optimize = b.standardOptimizeOption(.{});

    // 创建 WASM 库
    const wasm_lib = b.addSharedLibrary(.{
        .name = "zigwasm",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // 设置 WASM 特定选项
    wasm_lib.root_module.export_symbol_names = &.{ "add", "multiply", "fibonacci" };
    wasm_lib.rdynamic = true;

    // 安装 WASM 文件
    b.installArtifact(wasm_lib);

    // 创建构建步骤
    const wasm_step = b.step("wasm", "Build WASM library");
    wasm_step.dependOn(&wasm_lib.step);
}