// index.js
Page({
  navigateToWasm() {
    wx.navigateTo({
      url: '/pages/wasm/wasm'
    });
  },

  navigateToZigWasm() {
    wx.navigateTo({
      url: '/pages/zigwasm/zigwasm'
    });
  }
})
