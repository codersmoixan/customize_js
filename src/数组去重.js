const arr = [
  {scheduleDate: 1659456000000, allocationName: "你看看就好"},
  {scheduleDate: 1659369600000, allocationName: "你看看就好", isNew: true},
  {scheduleDate: 1659369600000, allocationName: "新班次1",isNew: true},
  {scheduleDate: 1659369600000, allocationName: "你看看就好"},
  {scheduleDate: 1659542400000, allocationName: "新班次2",isNew: true},
  {scheduleDate: 123456, allocationName: "656"},
  {scheduleDate: 123456, allocationName: "2256"},
  {scheduleDate: 12345556, allocationName: "哈哈哈",isNew: true},
  {scheduleDate: 12345556, allocationName: "嘿嘿嘿"},
]

const arrayNoRepeat = (arr = [], key = 'scheduleDate') => {
  const repeatArr = []
  const stack = []

  while(arr.length) {
    const last = arr.pop()
    const findIndex = stack.indexOf(last[key])
    if (findIndex !== -1) {
      if (last.isNew) {
        repeatArr.splice(findIndex, 1, last)
      }
    } else {
      stack.push(last[key])
      repeatArr.push(last)
    }
  }

  return repeatArr
}

const arrayReduceNoRepeat = (arr = [], key = 'scheduleDate') => {
  const stack = [] // 临时存储区

  return arr.reduce((cur, next) => {
    if (!stack.includes(next[key])) { // 判断临时存储区里面是否存在当前的key
      cur.push(next) // 如果没有的话，将当前项推入新数组
      stack.push(next[key]) // 如果当前项在临时存储区不存在 则将当前项的key推入临时存储区
    }

    return cur // 返回处理后的新数组
  }, [])
}

const arrayFlatMapNoRepeat = (arr = [], key = 'scheduleDate') => {
  const stack = [] // 临时存储区

  // todo 利用flatMap 只有当条件为真时将某一项返回到新数组里面，不为真时则不返回任何数据
  return arr.flatMap(item => {
    // todo 临时存储区没有当前项的key 将当前的key推入临时存储区 并且把当前项推入新数组
    if (!stack.includes(item[key])) {
      stack.push(item[key])
      return item
    } else {
      return []
    }
  })
}

const arrStackNoRepeat = (arr = [], key = 'scheduleDate') => {
  const stack = [] // 定义一个临时存储区
  const noRepeatArr = [] // 用来存储处理后的数据

  while(arr.length) {
    const next = arr.pop() // 取出最后数组的一项

    // todo 判断临时存储区是否有当前项
    //  如果没有则将当前项推入noRepeatArr
    //  并且将当前项的key推入临时存储区
    if (!stack.includes(next[key])) {
      noRepeatArr.push(next)
      stack.push(next[key])
    }
  }

  return noRepeatArr
}

console.log(arrStackNoRepeat(arr))
