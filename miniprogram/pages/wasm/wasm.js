// pages/wasm/wasm.js
const WasmAdapter = require('../../utils/wasm-adapter.js');

Page({
  data: {
    wasmStatus: '未加载',
    wasmAdapter: null,
    numberA: 10,
    numberB: 5,
    mathResult: null,
    name: '',
    greetResult: '',
    factorialInput: 5,
    factorialResult: null
  },

  onLoad() {
    console.log('WASM 页面加载');
    this.loadWasm();
  },

  // 加载 WASM 模块
  async loadWasm() {
    try {
      this.setData({
        wasmStatus: '正在加载...'
      });

      console.log('开始加载 WASM 文件');
      
      // 使用适配器加载 WASM
      const adapter = new WasmAdapter();
      await adapter.load('/rustwasmdemo_bg.wasm');

      this.setData({
        wasmAdapter: adapter,
        wasmStatus: '加载成功'
      });

      // 测试基本功能
      this.testWasmFunctions();

    } catch (error) {
      console.error('WASM 加载失败:', error);
      this.setData({
        wasmStatus: '加载失败: ' + error.message
      });
      
      // 显示错误提示
      wx.showToast({
        title: 'WASM加载失败',
        icon: 'error',
        duration: 3000
      });
    }
  },

  // 测试 WASM 函数
  testWasmFunctions() {
    if (!this.data.wasmAdapter) {
      console.log('WASM 适配器不可用');
      return;
    }

    try {
      // 测试数学函数
      const testResult = this.data.wasmAdapter.add(2, 3);
      console.log('WASM 测试调用成功，2 + 3 =', testResult);
      
      // 测试字符串函数
      const greetTest = this.data.wasmAdapter.greet('测试');
      console.log('WASM 问候测试:', greetTest);
      
    } catch (error) {
      console.error('WASM 函数测试失败:', error);
    }
  },

  // 输入框事件处理
  onNumberAChange(e) {
    this.setData({
      numberA: parseInt(e.detail.value) || 0
    });
  },

  onNumberBChange(e) {
    this.setData({
      numberB: parseInt(e.detail.value) || 0
    });
  },

  onNameChange(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onFactorialInputChange(e) {
    this.setData({
      factorialInput: parseInt(e.detail.value) || 0
    });
  },

  // WASM 函数调用
  onAdd() {
    if (!this.data.wasmAdapter) {
      wx.showToast({
        title: 'WASM未加载',
        icon: 'error'
      });
      return;
    }

    try {
      const result = this.data.wasmAdapter.add(this.data.numberA, this.data.numberB);
      this.setData({
        mathResult: result
      });
      
      wx.showToast({
        title: '计算完成',
        icon: 'success'
      });
    } catch (error) {
      console.error('加法运算失败:', error);
      wx.showToast({
        title: '计算失败',
        icon: 'error'
      });
    }
  },

  onMultiply() {
    if (!this.data.wasmAdapter) {
      wx.showToast({
        title: 'WASM未加载',
        icon: 'error'
      });
      return;
    }

    try {
      const result = this.data.wasmAdapter.multiply(this.data.numberA, this.data.numberB);
      this.setData({
        mathResult: result
      });
      
      wx.showToast({
        title: '计算完成',
        icon: 'success'
      });
    } catch (error) {
      console.error('乘法运算失败:', error);
      wx.showToast({
        title: '计算失败',
        icon: 'error'
      });
    }
  },

  onGreet() {
    if (!this.data.wasmAdapter) {
      wx.showToast({
        title: 'WASM未加载',
        icon: 'error'
      });
      return;
    }

    if (!this.data.name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }

    try {
      const result = this.data.wasmAdapter.greet(this.data.name);
      this.setData({
        greetResult: result
      });
      
      wx.showToast({
        title: '生成成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('问候语生成失败:', error);
      // 提供降级方案
      this.setData({
        greetResult: `你好, ${this.data.name}! 欢迎使用 Rust WebAssembly!`
      });
    }
  },

  onFactorial() {
    if (!this.data.wasmAdapter) {
      wx.showToast({
        title: 'WASM未加载',
        icon: 'error'
      });
      return;
    }

    if (this.data.factorialInput < 0 || this.data.factorialInput > 20) {
      wx.showToast({
        title: '请输入0-20的数字',
        icon: 'none'
      });
      return;
    }

    try {
      const result = this.data.wasmAdapter.factorial(this.data.factorialInput);
      this.setData({
        factorialResult: result
      });
      
      wx.showToast({
        title: '计算完成',
        icon: 'success'
      });
    } catch (error) {
      console.error('阶乘计算失败:', error);
      wx.showToast({
        title: '计算失败',
        icon: 'error'
      });
    }
  },

  onShareAppMessage() {
    return {
      title: 'Rust WebAssembly 示例',
      path: '/pages/wasm/wasm'
    };
  }
});