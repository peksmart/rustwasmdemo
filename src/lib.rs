use wasm_bindgen::prelude::*;

// 导入 `console.log` 函数用于调试
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// 定义一个宏来简化 console.log 的使用
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// 基础的数学运算函数
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    console_log!("计算 {} + {} = {}", a, b, a + b);
    a + b
}

#[wasm_bindgen]
pub fn multiply(a: i32, b: i32) -> i32 {
    console_log!("计算 {} * {} = {}", a, b, a * b);
    a * b
}

// 字符串处理函数
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    let result = format!("你好, {}! 欢迎使用 Rust WebAssembly!", name);
    console_log!("生成问候语: {}", result);
    result
}

// 计算阶乘
#[wasm_bindgen]
pub fn factorial(n: u32) -> u32 {
    let result = if n <= 1 {
        1
    } else {
        (1..=n).product()
    };
    console_log!("计算 {}! = {}", n, result);
    result
}

// 判断是否为质数
#[wasm_bindgen]
pub fn is_prime(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    for i in 2..=(n as f64).sqrt() as u32 {
        if n % i == 0 {
            return false;
        }
    }
    console_log!("{} 是质数", n);
    true
}

// 初始化函数，在模块加载时调用
#[wasm_bindgen(start)]
pub fn main() {
    console_log!("Rust WebAssembly 模块已成功加载!");
}