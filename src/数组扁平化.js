const arr = [1, 2, 3, 4, [1, 2, 3, 4, [3, 2, 1], [1, 2, 3]], [3, 2, 1]]

/**
 * 使用堆栈来进行扁平数组
 * 1. 将数组存储在栈中来维护
 * 2. 当栈不为空时循环处理
 * 3. pop()将栈尾出栈
 * 4. 判断出栈的元素是否为数组，如果是数组解构数组再push()推入栈中，如果不是则将当前元素push()推进res栈中
 * 5. 将stack栈中的数组全部处理完毕之后，将res栈中的数据进行reverse反转恢复顺序
 **/
function stackFlat(arr) {
  const stack = [...arr]
  const res = []

  while(stack.length) {
    const next = stack.pop()
    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      res.push(next)
    }
  }

  return res.reverse()
}

/**
 * 使用while和some进行扁平化数组
 *
 */
function someWhileFlat(arr) {
  let stack = [...arr]

  while(stack.some(item => Array.isArray(item))) {
    stack = [].concat(...stack)
  }

  return stack
}

/**
 * 使用递归扁平化数组
 */
function recursionFlat(arr) {
  let res = []

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(recursionFlat(arr[i]))
    } else {
      res.push(arr[i])
    }
  }

  return res
}

console.log(recursionFlat(arr))
