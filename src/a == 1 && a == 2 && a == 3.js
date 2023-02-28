/**
 * 重写对象的valueOf()/toString()方法
 * 
 * 双等号 == 比较规则：如果操作数之一是对象，另一个是数字或者字符串，会尝试隐式调用对象的valueOf()和toString()方法将对象转为原始值。
 * 
 * 分析：a == 1 && a == 2 && a == 3，若a为一个对象，那么a与数字类型之间的比较就会触发valueOf()方法，若此方法返回一个对象则继续调用toString()方法，所以我们可以重写valueOf()或者toString()方法
*/

const a = {
    number: 1,
    valueOf() {
        return this.number++
    },
    toString() {
        return this.number++
    }
}

// 测试
if (a == 1 && a == 2 && a == 3) {
    console.log(a)
}

/**
 * 使用Object.defineProperty改写数组的join方法
 * 
 * 结合例子： 【1, 2, 3】 == ‘1,2,3’
 * 
 * 分析：1. Array.prototype.toString() == Array.prototype.join() 对于任何数组，默认方法也成立，且方法无参数
 *      2. 数组在调用toString方法的时候，若toString方法没有被重写，而join方法重写了，则数组会去调用join方法
 *      3. 我们不再使用前一种思维模式，使用number自增，而是可以让数组的join方法赋值为shift方法，这样每次与数字比较，都会执行join方法，然后间接的执行了shift方法，移除数组的首位元素，然后与数字做比较
 */
const b = Object.defineProperty([1, 2, 3], 'join', {
    get: function () {
        return () => this.shift()
    }
})

// 测试
if (b == 1 && b == 2) {
    console.log(b)
}

/** 
 * 使用Proxy代理构造get捕获器
 * 
 * Proxy能够代理目标对象的一些行为，例如在获取目标对象的一些属性和方法的时候进行拦截或进一步处理后再返回结果，这个思路和第一种改写valueOf方法然后每次递增1的方法思想一致，只是换成了Proxy代理模式
 * 
*/
const c = new Proxy(
    { number: 1 },
    {
        get(target, property, receiver) {
            // 隐式转换会调用Symbool.toPrimitive函数
            if (property === Symbol.toPrimitive) {
                // 返回一个函数，会被自动执行
                return () => target.number++
            }
        }
    }
)

// 测试
if (c == 1 && c == 2 && c == 3) {
    console.log(c)
}