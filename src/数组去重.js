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
  const stack = []

  return arr.reduce((cur, next) => {
    if (!stack.includes(next[key])) {
      cur.push(next)
      stack.push(next[key])
    }

    return cur
  }, [])
}

const arrayFlatMapNoRepeat = (arr = [], key = 'scheduleDate') => {
  const stack = []

  return arr.flatMap(item => {
    if (!stack.includes(item[key])) {
      stack.push(item[key])
      return item
    } else {
      return []
    }
  })
}

const arrStackNoRepeat = (arr = [], key = 'scheduleDate') => {
  const stack = []
  const noRepeatArr = []

  while(arr.length) {
    const next = arr.pop()
    if (!stack.includes(next[key])) {
      noRepeatArr.push(next)
      stack.push(next[key])
    }
  }

  return noRepeatArr
}

console.log(arrStackNoRepeat(arr))
