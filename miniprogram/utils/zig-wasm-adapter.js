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
    if (!this.exports.greet) {
      throw new Error('greet 函数不可用');
    }

    console.log('开始调用 greet 函数，输入:', name);

    // 将姓名编码为UTF-8字节
    const encoder = new TextEncoder();
    const nameBytes = encoder.encode(name);
    
    console.log('输入字节:', Array.from(nameBytes));
    
    // 获取 WASM 线性内存
    const memory = new Uint8Array(this.wasmInstance.exports.memory.buffer);
    console.log('WASM 内存大小:', memory.length);
    
    // 获取内存缓冲区地址
    const memoryAddr = this.exports.getMemoryAddress();
    console.log('内存缓冲区地址:', memoryAddr);
    
    // 将输入写入到内存缓冲区的安全位置
    const inputOffset = 3072;
    for (let i = 0; i < nameBytes.length; i++) {
      memory[memoryAddr + inputOffset + i] = nameBytes[i];
    }
    
    // 验证写入
    const writtenBytes = [];
    for (let i = 0; i < nameBytes.length; i++) {
      writtenBytes.push(memory[memoryAddr + inputOffset + i]);
    }
    console.log('写入后验证:', writtenBytes);
    
    // 调用WASM函数生成问候语
    const resultLen = this.exports.greet(inputOffset, nameBytes.length);
    
    console.log('WASM 返回长度:', resultLen);
    
    // 从内存缓冲区读取结果
    const resultBytes = new Uint8Array(resultLen);
    for (let i = 0; i < resultLen; i++) {
      resultBytes[i] = memory[memoryAddr + i];
    }
    
    console.log('输出字节:', Array.from(resultBytes));
    
    // 解码为UTF-8字符串
    const decoder = new TextDecoder('utf-8');
    const result = decoder.decode(resultBytes);
    
    console.log('最终结果:', result);
    
    return result;
  }

  // 字符串反转功能
  reverseString(inputString) {
    if (!this.exports.reverseString) {
      throw new Error('reverseString 函数不可用');
    }

    console.log('开始调用 reverseString 函数，输入:', inputString);

    // 将字符串编码为UTF-8字节
    const encoder = new TextEncoder();
    const bytes = encoder.encode(inputString);
    
    console.log('输入字节:', Array.from(bytes));
    
    // 获取 WASM 线性内存
    const memory = new Uint8Array(this.wasmInstance.exports.memory.buffer);
    
    // 获取内存缓冲区地址
    const memoryAddr = this.exports.getMemoryAddress();
    console.log('内存缓冲区地址:', memoryAddr);
    
    // 将输入写入到内存缓冲区的安全位置（偏移2048）
    const inputOffset = 2048;
    for (let i = 0; i < bytes.length; i++) {
      memory[memoryAddr + inputOffset + i] = bytes[i];
    }
    
    // 验证写入
    const writtenBytes = [];
    for (let i = 0; i < bytes.length; i++) {
      writtenBytes.push(memory[memoryAddr + inputOffset + i]);
    }
    console.log('写入后验证:', writtenBytes);
    
    // 调用WASM反转函数
    const resultLen = this.exports.reverseString(inputOffset, bytes.length);
    
    console.log('WASM 返回长度:', resultLen);
    
    // 从内存缓冲区的偏移1024位置读取结果
    const resultBytes = new Uint8Array(resultLen);
    for (let i = 0; i < resultLen; i++) {
      resultBytes[i] = memory[memoryAddr + 1024 + i];
    }
    
    console.log('输出字节:', Array.from(resultBytes));
    
    // 解码为UTF-8字符串
    const decoder = new TextDecoder('utf-8');
    const result = decoder.decode(resultBytes);
    
    console.log('最终结果:', result);
    
    return result;
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