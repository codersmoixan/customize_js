function mergeObject(target = {}, source = {}) {
  Object.keys(source).forEach(key => {
    if (Object.prototype.toString.call(source[key]) === '[object Object]') {
      target[key] = mergeObject(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  })

  return target
}

module.exports = mergeObject
