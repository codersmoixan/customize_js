const isEmptyObject = obj => Object.keys(obj).length === 0
const isNumber = val => typeof val === 'number'

class Animation {
  animationMap = new Map()
  animations = []
  elements = []
  from = {}
  to = {}
  delay = null
  isRunning = false
  isCompleted = false
  isBeforeStart = false
  isAfterEnd = false
  animationIndex = 0
  state = []
  fromTo = null
  effect = null

  constructor(elements = [], animations = []) {
    this.animations = Array.isArray(animations) ? animations : [animations]
    this.elements = Array.isArray(elements) ? elements : [elements]

    this.updateAnimationMaps(this.animations[this.animationIndex])
    this.observer(['isBeforeStart', 'isAfterEnd'], newValue => {
      if (newValue.isAfterEnd && this.animationIndex < this.animations.length - 1) {
        this.animationIndex += 1
      }
      if (newValue.isBeforeStart) {
        this.animationIndex -= 1
      }
      this.animationIndex = this.animationIndex <= 0 ? 0 : this.animationIndex
      this.updateAnimationMaps(this.animations[this.animationIndex])
    })
  }

  updateAnimationMaps(option = {}) {
    if (isEmptyObject(option)) {
      return
    }
    const { start, end, from, to, delay = 0, fromTo, effect } = option
    this.delay = delay
    this.from = from
    this.to = to
    this.fromTo = fromTo
    this.effect = effect
    this.elements.forEach((dom, index) => {
      this.state[index] = {
        running: false,
        completed: false,
        beforeStart: false,
        afterEnd: false
      }
      this.animationMap.set(dom, this.getDomAnimation(start, end, dom, index))
    })
  }

  getAnimation(start, end, dom, index) {
    const styles = {}

    if (this.fromTo) {
      const fromTo = this.fromTo?.(dom, { start, end, index }) || {}
      for (const [key, value] of Object.entries(fromTo)) {
        this.from[key] = value.from
        this.to[key] = value.to
      }
    }

    for (const [key, value] of Object.entries(this.from)) {
      const animation = this.create(start, end, value, this.to[key], index)
      if (this.effect) {
        styles[key] = animation
      } else {
        styles[key] = function (x) {
          return animation(x)
        }
      }
    }

    return this.effect?.(styles, dom, index) || styles
  }

  getDomAnimation(start, end, dom, index) {
    start += isNumber(this.delay) ? ((dom.dataset.index || index) * this.delay) : (this.delay?.(dom, index) || 0)
    return this.getAnimation(start, end, dom, index)
  }

  create(scrollStart, scrollEnd, startValue, endValue, index) {
    return (offset) => {
      const { beforeStart, afterEnd } = this.state[index]
      if (offset < scrollStart) {
        this.state[index] = {
          afterEnd,
          beforeStart: true,
          running: false,
          completed: true,
        }

        return startValue
      }
      if (offset > scrollEnd) {
        this.state[index] = {
          beforeStart,
          afterEnd: true,
          running: false,
          completed: true
        }
        return endValue
      }

      this.state[index] = {
        running: true,
        beforeStart: false,
        afterEnd: false,
        completed: false
      }
      const progress = (offset - scrollStart) / (scrollEnd - scrollStart)

      return startValue + (endValue - startValue) * progress
    }
  }

  update(y) {
    for (const [dom, animations] of this.animationMap) {
      for (const prop in animations) {
        dom.style[prop] = animations[prop]?.(y)
      }
    }

    this.isCompleted = this.state.every(item => item.completed)
    this.isBeforeStart = this.state.every(item => item.beforeStart)
    this.isAfterEnd = this.state.every(item => item.afterEnd)
    this.isRunning = this.state.some(item => item.running)
    return this
  }

  observer(keys, callback) {
    keys = Array.isArray(keys) ? keys : [keys]
    const watchKeys = {}
    keys.forEach(key => {
      let newValue
      Object.defineProperty(this, key, {
        set: value => {
          if (newValue !== value) {
            newValue = value
            watchKeys[key] = newValue
            callback?.(watchKeys)
          }
        }
      })
    })
  }

  push(animations) {
    this.animations.push(animations)
  }
}
