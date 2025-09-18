// zigwasm.js
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

    // 加法输入
    addInputA: 10,
    addInputB: 20,
    addResult: {
      text: '点击按钮开始计算',
      class: ''
    },

    // 乘法输入
    multiplyInputA: 5,
    multiplyInputB: 8,
    multiplyResult: {
      text: '点击按钮开始计算',
      class: ''
    },

    // 斐波那契输入
    fibInput: 10,
    fibResult: {
      text: '点击按钮开始计算',
      class: ''
    }
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
          text: '✅ Zig WASM 模块加载成功！',
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

      // 显示错误提示
      wx.showToast({
        title: 'WASM加载失败',
        icon: 'error',
        duration: 3000
      });
    }
  },

  // 输入处理函数
  onAddInputA(e) {
    this.setData({ addInputA: parseInt(e.detail.value) || 0 });
  },

  onAddInputB(e) {
    this.setData({ addInputB: parseInt(e.detail.value) || 0 });
  },

  onMultiplyInputA(e) {
    this.setData({ multiplyInputA: parseInt(e.detail.value) || 0 });
  },

  onMultiplyInputB(e) {
    this.setData({ multiplyInputB: parseInt(e.detail.value) || 0 });
  },

  onFibInput(e) {
    this.setData({ fibInput: parseInt(e.detail.value) || 0 });
  },

  // 计算函数
  onCalculateAdd() {
    try {
      if (!this.data.wasmReady || !this.data.wasmAdapter) {
        throw new Error('WASM 模块未准备就绪');
      }

      const a = this.data.addInputA;
      const b = this.data.addInputB;
      
      console.log(`调用 Zig WASM add(${a}, ${b})`);
      const result = this.data.wasmAdapter.add(a, b);
      
      this.setData({
        addResult: {
          text: `结果: ${a} + ${b} = ${result}`,
          class: 'success'
        }
      });

      console.log(`加法计算结果: ${result}`);
    } catch (error) {
      console.error('加法计算错误:', error);
      this.setData({
        addResult: {
          text: `计算错误: ${error.message}`,
          class: 'error'
        }
      });
    }
  },

  onCalculateMultiply() {
    try {
      if (!this.data.wasmReady || !this.data.wasmAdapter) {
        throw new Error('WASM 模块未准备就绪');
      }

      const a = this.data.multiplyInputA;
      const b = this.data.multiplyInputB;
      
      console.log(`调用 Zig WASM multiply(${a}, ${b})`);
      const result = this.data.wasmAdapter.multiply(a, b);
      
      this.setData({
        multiplyResult: {
          text: `结果: ${a} × ${b} = ${result}`,
          class: 'success'
        }
      });

      console.log(`乘法计算结果: ${result}`);
    } catch (error) {
      console.error('乘法计算错误:', error);
      this.setData({
        multiplyResult: {
          text: `计算错误: ${error.message}`,
          class: 'error'
        }
      });
    }
  },

  onCalculateFib() {
    try {
      if (!this.data.wasmReady || !this.data.wasmAdapter) {
        throw new Error('WASM 模块未准备就绪');
      }

      const n = this.data.fibInput;
      
      if (n < 0 || n > 40) {
        throw new Error('请输入 0-40 之间的数字');
      }
      
      console.log(`调用 Zig WASM fibonacci(${n})`);
      const startTime = Date.now();
      const result = this.data.wasmAdapter.fibonacci(n);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.setData({
        fibResult: {
          text: `第 ${n} 个斐波那契数: ${result}\n计算耗时: ${duration}ms`,
          class: 'success'
        }
      });

      console.log(`斐波那契计算结果: ${result}, 耗时: ${duration}ms`);
    } catch (error) {
      console.error('斐波那契计算错误:', error);
      this.setData({
        fibResult: {
          text: `计算错误: ${error.message}`,
          class: 'error'
        }
      });
    }
  }
});