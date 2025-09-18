// utils/zig-wasm-adapter.js
// Zig WebAssembly 适配器 for 微信小程序

class ZigWasmAdapter {
  constructor() {
    this.wasmInstance = null;
    this.memory = null;
    this.exports = null;
  }

  // 加载 WASM 模块
  async load(wasmPath) {
    try {
      console.log('开始加载 Zig WASM 模块:', wasmPath);
      
      // 使用微信小程序的 WXWebAssembly
      const wasmModule = await WXWebAssembly.instantiate(wasmPath, {
        env: {
          // Zig 编译的 WASM 可能需要的环境函数
        }
      });

      this.wasmInstance = wasmModule.instance;
      this.memory = this.wasmInstance.exports.memory;
      this.exports = this.wasmInstance.exports;

      console.log('Zig WASM 模块加载成功');
      console.log('所有导出项:', Object.keys(this.exports));
      
      // 详细打印每个导出项的类型
      Object.keys(this.exports).forEach(key => {
        console.log(`导出项 ${key}: ${typeof this.exports[key]}`);
      });

      return this;
    } catch (error) {
      console.error('Zig WASM 加载失败:', error);
      throw error;
    }
  }

  // 加法运算
  add(a, b) {
    if (!this.exports.add) {
      throw new Error('add 函数不可用');
    }
    return this.exports.add(a, b);
  }

  // 乘法运算
  multiply(a, b) {
    if (!this.exports.multiply) {
      throw new Error('multiply 函数不可用');
    }
    return this.exports.multiply(a, b);
  }

  // 斐波那契数列
  fibonacci(n) {
    if (!this.exports.fibonacci) {
      // JavaScript 降级实现
      if (n <= 1) return n;
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
      }
      return b;
    }
    return this.exports.fibonacci(n);
  }

  // 检查 WASM 是否已准备就绪
  isReady() {
    return this.wasmInstance !== null && this.exports !== null;
  }

  // 获取所有可用的导出函数
  getAvailableFunctions() {
    if (!this.exports) return [];
    return Object.keys(this.exports).filter(key => typeof this.exports[key] === 'function');
  }
}

module.exports = ZigWasmAdapter;