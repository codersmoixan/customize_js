class Animation {
  animationMap = new Map()
  from = {}
  to = {}
  delay = 0

  constructor({ documents = [], start, end, from, to, animate, delay = 0 } = {}) {
    this.delay = delay
    this.from = from
    this.to = to
    this.animate = animate
    for (const dom of documents) {
      this.animationMap.set(dom, this.getDomAnimation(start, end, dom))
    }
  }

  getAnimation(start, end) {
    const styles = {}
    for (const [key, value] of Object.entries(this.from)) {
      const animation = this.create(start, end, value, this.to[key])
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

  getDomAnimation(start, end, dom) {
    start += (dom.dataset.index || 0) * this.delay
    return this.getAnimation(start, end, this.from, this.to)
  }

  create(scrollStart, scrollEnd, startValue, endValue) {
    return function(x) {
      if (x < scrollStart) {
        return startValue
      }
      if (x > scrollEnd) {
        return endValue
      }

      const progress = (x - scrollStart) / (scrollEnd - scrollStart)
      return startValue + (endValue - startValue) * progress
    }
  }

  update(y) {
    for (const [dom, animations] of this.animationMap) {
      for (const prop in animations) {
        const style = animations[prop](y)
        dom.style[prop] = animations[prop](y)
      }
    }
  }
}
