// zigwasm.js - 紧凑版本
const ZigWasmAdapter = require('../../utils/zig-wasm-adapter.js');

Page({
  data: {
    // WASM 模块状态
    wasmReady: false,
    wasmAdapter: null,
    wasmStatus: {
      text: '🔄 正在加载 Zig WASM 模块...',
      class: 'loading'
    },

    // 数学运算
    addA: '10',
    addB: '20',
    addResult: '',
    mulA: '5',
    mulB: '8',
    mulResult: '',
    fibN: '10',
    fibResult: '',
    
    // 字符串处理
    greetName: '',
    greetResult: '',
    reverseText: '',
    reverseResult: ''
  },

  async onLoad() {
    console.log('Zig WASM 页面加载');
    await this.loadWasmModule();
  },

  // 加载 WASM 模块
  async loadWasmModule() {
    try {
      console.log('开始加载 Zig WASM 模块...');
      
      this.setData({
        wasmStatus: {
          text: '🔄 正在加载 Zig WASM 模块...',
          class: 'loading'
        }
      });

      // 使用适配器加载 WASM
      const adapter = new ZigWasmAdapter();
      await adapter.load('/zigwasm.wasm');

      this.setData({
        wasmAdapter: adapter,
        wasmReady: true,
        wasmStatus: {
          text: '✅ Zig WASM 模块就绪！',
          class: 'ready'
        }
      });

      console.log('Zig WASM 模块加载成功');
      console.log('可用的导出函数:', adapter.getAvailableFunctions());

    } catch (error) {
      console.error('Zig WASM 模块加载失败:', error);
      this.setData({
        wasmStatus: {
          text: `❌ 加载失败: ${error.message}`,
          class: 'error'
        }
      });

      wx.showToast({
        title: 'WASM加载失败',
        icon: 'error',
        duration: 3000
      });
    }
  },

  // 数学运算方法
  calculateAdd() {
    if (!this.data.wasmReady || !this.data.wasmAdapter) {
      wx.showToast({ title: 'WASM 模块未就绪', icon: 'error' });
      return;
    }

    try {
      const a = parseInt(this.data.addA) || 0;
      const b = parseInt(this.data.addB) || 0;
      const result = this.data.wasmAdapter.add(a, b);
      this.setData({ addResult: result.toString() });
      console.log(`加法: ${a} + ${b} = ${result}`);
    } catch (error) {
      console.error('加法计算失败:', error);
      this.setData({ addResult: '计算错误' });
    }
  },

  calculateMul() {
    if (!this.data.wasmReady || !this.data.wasmAdapter) {
      wx.showToast({ title: 'WASM 模块未就绪', icon: 'error' });
      return;
    }

    try {
      const a = parseInt(this.data.mulA) || 0;
      const b = parseInt(this.data.mulB) || 0;
      const result = this.data.wasmAdapter.multiply(a, b);
      this.setData({ mulResult: result.toString() });
      console.log(`乘法: ${a} × ${b} = ${result}`);
    } catch (error) {
      console.error('乘法计算失败:', error);
      this.setData({ mulResult: '计算错误' });
    }
  },

  calculateFib() {
    if (!this.data.wasmReady || !this.data.wasmAdapter) {
      wx.showToast({ title: 'WASM 模块未就绪', icon: 'error' });
      return;
    }

    try {
      const n = parseInt(this.data.fibN) || 0;
      if (n < 0 || n > 40) {
        this.setData({ fibResult: '请输入 0-40 的数字' });
        return;
      }
      
      const startTime = Date.now();
      const result = this.data.wasmAdapter.fibonacci(n);
      const duration = Date.now() - startTime;
      
      this.setData({ fibResult: `${result} (${duration}ms)` });
      console.log(`斐波那契: fib(${n}) = ${result}, 耗时: ${duration}ms`);
    } catch (error) {
      console.error('斐波那契计算失败:', error);
      this.setData({ fibResult: '计算错误' });
    }
  },

  // 字符串处理方法
  processGreet() {
    if (!this.data.wasmReady || !this.data.wasmAdapter) {
      wx.showToast({ title: 'WASM 模块未就绪', icon: 'error' });
      return;
    }

    try {
      const name = this.data.greetName.trim();
      if (!name) {
        this.setData({ greetResult: '请输入姓名' });
        return;
      }
      
      const result = this.data.wasmAdapter.greet(name);
      this.setData({ greetResult: result });
      console.log(`问候处理: ${name} -> ${result}`);
    } catch (error) {
      console.error('问候处理失败:', error);
      this.setData({ greetResult: '处理错误' });
    }
  },

  processReverse() {
    if (!this.data.wasmReady || !this.data.wasmAdapter) {
      wx.showToast({ title: 'WASM 模块未就绪', icon: 'error' });
      return;
    }

    try {
      const text = this.data.reverseText.trim();
      if (!text) {
        this.setData({ reverseResult: '请输入文本' });
        return;
      }
      
      const result = this.data.wasmAdapter.reverseString(text);
      this.setData({ reverseResult: result });
      console.log(`字符串反转: ${text} -> ${result}`);
    } catch (error) {
      console.error('字符串反转失败:', error);
      this.setData({ reverseResult: '处理错误' });
    }
  },

  // 输入事件处理
  onAddAInput(e) { this.setData({ addA: e.detail.value }); },
  onAddBInput(e) { this.setData({ addB: e.detail.value }); },
  onMulAInput(e) { this.setData({ mulA: e.detail.value }); },
  onMulBInput(e) { this.setData({ mulB: e.detail.value }); },
  onFibNInput(e) { this.setData({ fibN: e.detail.value }); },
  onGreetNameInput(e) { this.setData({ greetName: e.detail.value }); },
  onReverseTextInput(e) { this.setData({ reverseText: e.detail.value }); }
});