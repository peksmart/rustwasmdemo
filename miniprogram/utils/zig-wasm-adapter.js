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
      throw new Error('fibonacci 函数不可用');
    }
    return this.exports.fibonacci(n);
  }

  // 字符串处理：生成问候语
  greet(name) {
    if (!this.exports.greet || !this.exports.getMemoryPtr) {
      throw new Error('greet 或 getMemoryPtr 函数不可用');
    }

    // 将姓名编码为UTF-8字节
    const encoder = new TextEncoder();
    const nameBytes = encoder.encode(name);
    
    // 写入WASM内存（使用内存末尾位置）
    const memory = new Uint8Array(this.wasmInstance.exports.memory.buffer);
    const inputPtr = 3072; // 使用内存的另一个位置
    memory.set(nameBytes, inputPtr);
    
    // 调用WASM函数生成问候语
    const resultLen = this.exports.greet(inputPtr, nameBytes.length);
    const memoryPtr = this.exports.getMemoryPtr();
    
    // 从WASM内存中读取结果字符串
    const resultBytes = memory.slice(memoryPtr, memoryPtr + resultLen);
    
    // 解码为UTF-8字符串
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(resultBytes);
  }

  // 字符串反转功能
  reverseString(inputString) {
    if (!this.exports.reverseString || !this.exports.getReversedPtr) {
      throw new Error('reverseString 或 getReversedPtr 函数不可用');
    }

    // 将字符串编码为UTF-8字节
    const encoder = new TextEncoder();
    const bytes = encoder.encode(inputString);
    
    // 写入WASM内存
    const memory = new Uint8Array(this.wasmInstance.exports.memory.buffer);
    const inputPtr = 2048; // 使用内存的另一个位置
    memory.set(bytes, inputPtr);
    
    // 调用WASM反转函数
    const resultLen = this.exports.reverseString(inputPtr, bytes.length);
    const resultPtr = this.exports.getReversedPtr();
    
    // 读取结果
    const resultBytes = memory.slice(resultPtr, resultPtr + resultLen);
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(resultBytes);
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