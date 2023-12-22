class Animation {
  animationMap = new Map()
  animations = []
  from = {}
  to = {}
  delay = 0
  isRunning = false
  isCompleted = false
  isBeforeStart = false
  isAfterEnd = false
  animationIndex = 0
  state = []

  constructor(documents, animations) {
    this.animations = Array.isArray(animations) ? animations : [animations]
    this.documents = documents

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

  updateAnimationMaps(option) {
    const { start, end, from, to, animate, delay = 0 } = option
    this.delay = delay
    this.from = from
    this.to = to
    this.animate = animate
    this.documents.forEach((dom, index) => {
      this.state[index] = {
        running: false,
        completed: false,
        beforeStart: false,
        afterEnd: false
      }
      this.animationMap.set(dom, this.getDomAnimation(start, end, dom, index))
    })
  }

  getAnimation(start, end, index) {
    const styles = {}
    for (const [key, value] of Object.entries(this.from)) {
      const animation = this.create(start, end, value, this.to[key], index)
      if (this.animate) {
        styles[key] = animation
      } else {
        styles[key] = function (x) {
          return animation(x)
        }
      }
    }

    return this.animate?.(styles) || styles
  }

  getDomAnimation(start, end, dom, index) {
    start += (dom.dataset.index || 0) * this.delay
    return this.getAnimation(start, end, index)
  }

  create(scrollStart, scrollEnd, startValue, endValue, index) {
    return (offset) => {
      const { running, beforeStart, afterEnd } = this.state[index]
      if (offset < scrollStart) {
        if (running) {
          this.state[index] = {
            afterEnd,
            beforeStart: true,
            running: false,
            completed: true,
          }
        }
        return startValue
      }
      if (offset > scrollEnd) {
        if (running) {
          this.state[index] = {
            beforeStart,
            afterEnd: true,
            running: false,
            completed: true
          }
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
        dom.style[prop] = animations[prop](y)
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
