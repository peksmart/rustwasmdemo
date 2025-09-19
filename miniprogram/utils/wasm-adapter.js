// utils/wasm-adapter.js
// 微信小程序 WASM 适配器

class WasmAdapter {
  constructor() {
    this.wasmInstance = null;
    this.memory = null;
    this.exports = null;
  }

  // 加载 WASM 模块
  async load(wasmPath) {
    try {
      console.log('开始加载 WASM 模块:', wasmPath);
      
      // 使用微信小程序的 WXWebAssembly
      const wasmModule = await WXWebAssembly.instantiate(wasmPath, {
        env: {
          // 可能需要的环境函数
        }
      });

      this.wasmInstance = wasmModule.instance;
      this.memory = this.wasmInstance.exports.memory;
      this.exports = this.wasmInstance.exports;

      console.log('WASM 模块加载成功');
      console.log('可用导出:', Object.keys(this.exports));

      return this;
    } catch (error) {
      console.error('WASM 加载失败:', error);
      throw error;
    }
  }

  // 获取内存视图
  getUint8ArrayMemory() {
    if (!this.memory) {
      throw new Error('WASM 内存未初始化');
    }
    return new Uint8Array(this.memory.buffer);
  }

  // 字符串编码函数
  encodeString(str) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str);
    
    // 分配内存
    const ptr = this.exports.__wbindgen_malloc(encoded.length);
    const memory = this.getUint8ArrayMemory();
    memory.set(encoded, ptr);
    
    return { ptr, len: encoded.length };
  }

  // 字符串解码函数
  decodeString(ptr, len) {
    if (!ptr || len <= 0) return '';
    
    const memory = this.getUint8ArrayMemory();
    const decoder = new TextDecoder();
    return decoder.decode(memory.subarray(ptr, ptr + len));
  }

  // 包装的函数调用
  add(a, b) {
    if (!this.exports.add) {
      throw new Error('add 函数不可用');
    }
    return this.exports.add(a, b);
  }

  multiply(a, b) {
    if (!this.exports.multiply) {
      throw new Error('multiply 函数不可用');
    }
    return this.exports.multiply(a, b);
  }

  greet(name) {
    if (!this.exports.greet) {
      throw new Error('greet 函数不可用');
    }

    // 编码输入字符串
    const { ptr, len } = this.encodeString(name);
    
    // 调用 WASM 函数
    const resultPtr = this.exports.greet(ptr, len);
    
    // 从返回的指针数组中获取结果
    const memory = this.getUint8ArrayMemory();
    const resultDataPtr = new Uint32Array(memory.buffer, resultPtr, 2);
    const strPtr = resultDataPtr[0];
    const strLen = resultDataPtr[1];
    
    // 解码结果字符串
    const result = this.decodeString(strPtr, strLen);
    
    // 清理内存
    this.exports.__wbindgen_free(ptr, len);
    this.exports.__wbindgen_free(strPtr, strLen);
    
    return result;
  }

  factorial(n) {
    if (!this.exports.factorial) {
      throw new Error('factorial 函数不可用');
    }
    return this.exports.factorial(n);
  }

  isPrime(n) {
    if (!this.exports.is_prime) {
      throw new Error('is_prime 函数不可用');
    }
    return this.exports.is_prime(n);
  }
}

module.exports = WasmAdapter;