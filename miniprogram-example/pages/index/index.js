// index.js
// 引入WASM模块 - 需要将生成的文件复制到项目中
// 注意：在实际项目中，需要将pkg-miniprogram文件夹中的文件复制到小程序项目目录
import('./rustwasmdemo.js').then(async () => {
  // WASM模块已加载
}).catch(err => {
  console.error('WASM模块加载失败:', err);
});

Page({
  data: {
    wasmLoaded: false,
    wasmStatus: '正在加载WASM模块...',
    numberA: 10,
    numberB: 5,
    name: '微信用户',
    factorialNumber: 5,
    primeNumber: 17,
    result: null,
    greetResult: '',
    otherResult: ''
  },

  onLoad() {
    this.initWasm();
  },

  async initWasm() {
    try {
      // 在微信小程序中，我们需要使用wx.request来加载WASM文件
      // 这里演示了基本的初始化流程
      
      // 模拟WASM加载过程
      setTimeout(() => {
        // 在实际项目中，这里应该是真正的WASM初始化
        // const wasmModule = await wasm_bindgen('./rustwasmdemo_bg.wasm');
        // getApp().globalData.wasmModule = wasmModule;
        
        this.setData({
          wasmLoaded: true,
          wasmStatus: 'WASM模块已加载'
        });
        
        console.log('WASM模块初始化完成');
      }, 1000);
      
    } catch (error) {
      console.error('WASM初始化失败:', error);
      this.setData({
        wasmStatus: 'WASM模块加载失败'
      });
    }
  },

  // 模拟WASM函数调用 - 在实际项目中这些会调用真正的WASM函数
  callWasmFunction(funcName, ...args) {
    // 在实际项目中，这里会调用：
    // const wasmModule = getApp().globalData.wasmModule;
    // return wasmModule[funcName](...args);
    
    // 这里提供模拟实现用于演示
    switch(funcName) {
      case 'add':
        return args[0] + args[1];
      case 'multiply':
        return args[0] * args[1];
      case 'greet':
        return `你好, ${args[0]}! 欢迎使用 Rust WebAssembly!`;
      case 'factorial':
        let result = 1;
        for(let i = 1; i <= args[0]; i++) {
          result *= i;
        }
        return result;
      case 'is_prime':
        const n = args[0];
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) return false;
        }
        return true;
      default:
        return null;
    }
  },

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

  onFactorialNumberChange(e) {
    this.setData({
      factorialNumber: parseInt(e.detail.value) || 0
    });
  },

  onPrimeNumberChange(e) {
    this.setData({
      primeNumber: parseInt(e.detail.value) || 0
    });
  },

  testAdd() {
    if (!this.data.wasmLoaded) return;
    
    try {
      const result = this.callWasmFunction('add', this.data.numberA, this.data.numberB);
      this.setData({
        result: `${this.data.numberA} + ${this.data.numberB} = ${result}`
      });
      console.log('加法运算结果:', result);
    } catch (error) {
      console.error('加法运算失败:', error);
      this.setData({ result: '计算失败' });
    }
  },

  testMultiply() {
    if (!this.data.wasmLoaded) return;
    
    try {
      const result = this.callWasmFunction('multiply', this.data.numberA, this.data.numberB);
      this.setData({
        result: `${this.data.numberA} × ${this.data.numberB} = ${result}`
      });
      console.log('乘法运算结果:', result);
    } catch (error) {
      console.error('乘法运算失败:', error);
      this.setData({ result: '计算失败' });
    }
  },

  testGreet() {
    if (!this.data.wasmLoaded) return;
    
    try {
      const result = this.callWasmFunction('greet', this.data.name);
      this.setData({
        greetResult: result
      });
      console.log('问候语生成结果:', result);
    } catch (error) {
      console.error('问候语生成失败:', error);
      this.setData({ greetResult: '生成失败' });
    }
  },

  testFactorial() {
    if (!this.data.wasmLoaded) return;
    
    try {
      const result = this.callWasmFunction('factorial', this.data.factorialNumber);
      this.setData({
        otherResult: `${this.data.factorialNumber}! = ${result}`
      });
      console.log('阶乘计算结果:', result);
    } catch (error) {
      console.error('阶乘计算失败:', error);
      this.setData({ otherResult: '计算失败' });
    }
  },

  testPrime() {
    if (!this.data.wasmLoaded) return;
    
    try {
      const result = this.callWasmFunction('is_prime', this.data.primeNumber);
      this.setData({
        otherResult: `${this.data.primeNumber} ${result ? '是' : '不是'}质数`
      });
      console.log('质数判断结果:', result);
    } catch (error) {
      console.error('质数判断失败:', error);
      this.setData({ otherResult: '判断失败' });
    }
  }
})