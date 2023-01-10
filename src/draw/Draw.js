import isEmpty from "lodash/isEmpty";

export class Draw {
  constructor(config = {}) {
    this.offset = {}
    this.canvas = null
    this.ctx = null
    this.dpr = null
  }

  /**
   * @description
   * @param canvas any
   * @param {
   *   width: number,
   *   height: number
   * }
   * @param [callback?:] function
   * */
  init(canvas, { width, height }, callback) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.dpr = window.devicePixelRatio

    canvas.width = width * this.dpr + 8 * this.dpr
    canvas.height = height * this.dpr + 8 * this.dpr
    this.ctx.scale(this.dpr, this.dpr)

    if (callback) {
      callback(canvas, this)
    }

    return this
  }

  /**
   * @description
   * @param {object: {
   *   x: number,
   *   y: number,
   *   x1: number,
   *   y1: number,
   *   lineWidth?: number,
   *   color?: string,
   *   callback?: Function
   * }} options
   *
   * @return Draw
   * */
  drawLine({
    x,
    y,
    x1,
    y1,
    lineWidth = 1,
    color = '#BFBFBF',
    callback
  }) {
    this.ctx.beginPath()

    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x1, y1)
    this.ctx.lineWidth = lineWidth
    this.ctx.strokeStyle = color
    this.ctx.stroke()

    const offset = {
      startX: x,
      startY: y,
      x: x1,
      y: y1
    }
    this.offset = offset

    if (callback) callback(this.ctx, offset)

    return this
  }

  /**
   * @description
   * @param {object: {
   *   x: number,
   *   y: number,
   *   width: number,
   *   height: number,
   *   color: string,
   *   callback: Function
   * }} options
   *
   * @return Draw
   * */
  drawRect({
    x,
    y,
    width,
    height,
    color,
    callback
  }) {
    this.ctx.rect(x, y, width, height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);

    const offset = { x, y }
    this.offset = offset

    if (callback) callback(this.ctx, offset)

    return this
  }

  /**
   * @description
   * @param {object: {
   *   text: string,
   *   x: number,
   *   y: number,
   *   width?: number,
   *   height?: number,
   *   color?: string,
   *   font?: number,
   *   textAlign?: string,
   *   initMaxWidth?: number,
   *   initLineHeight?: number,
   *   bold?: string | number,
   *   callback?: Function
   * }} options
   *
   * @return Draw
   * */
  drawText({
    text,
    x,
    y,
    color = '#4D4D4D',
    fontSize = '16px',
    bold = 'normal',
    font = 16,
    fontFamily = 'Roboto',
    textAlign = 'left',
    initMaxWidth,
    initLineHeight,
    callback
  }) {
    let maxWidth = initMaxWidth;
    let lineHeight = initLineHeight;
    const offsetX = x;
    let offsetY = y;

    if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
      return this;
    }

    if (typeof maxWidth === 'undefined') {
      maxWidth = (this.canvas && this.canvas.width) || 300;
    }
    if (typeof lineHeight === 'undefined') {
      lineHeight =
        (this.canvas && parseInt(window.getComputedStyle(this.canvas).lineHeight, 10)) ||
        parseInt(window.getComputedStyle(document.body).lineHeight, 10);
    }

    this.ctx.restore()

    // 字符分隔为数组
    const arrText = text.split('');
    let line = '';

    this.ctx.fillStyle = color
    this.ctx.font = `${bold} ${fontSize} ${fontFamily}`
    this.ctx.textAlign = textAlign

    for (let n = 0; n < arrText.length; n += 1) {
      const testLine = line + arrText[n];
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;
      this.ctx.font = `${font}px Verdana`
      if (testWidth > maxWidth && n > 0) {
        this.ctx.fillText(line, offsetX, offsetY);
        line = arrText[n];
        offsetY += lineHeight;
      } else {
        line = testLine;
      }
    }


    const offset = {x: offsetX, y: offsetY}
    this.offset = offset

    this.ctx.fillText(line, offsetX, offsetY);

    if (callback) {
      callback(this.ctx, { ...offset, text: line })
    }

    return this;
  }

  /**
   * @description
   * @param {object: {
   *   radius: number,
   *   x: number,
   *   y: number,
   *   width: number,
   *   height: number,
   *   fillStyle: string,
   *   strokeStyle?: string,
   *   shadow?: {
   *     color: string,
   *     offsetX: number,
   *     offsetY: number,
   *     blur: string
   *   },
   *   callback?: Function
   * }} options
   *
   * @return Draw
   * */
  drawRoundRect({
    radius = 0,
    x = 0,
    y = 0,
    width,
    height,
    fillStyle,
    strokeStyle,
    shadow,
    callback
  }) {
    if (x) width += x
    if (y) height += y

    this.ctx.restore()
    this.ctx.beginPath()

    this.ctx.save();

    this.ctx.moveTo(x + radius, y);           // 绘制起点
    this.ctx.lineTo(width - radius, y);          // 创建水平线
    this.ctx.arcTo(width, y, width, y + radius, radius); // 创建右上弧
    this.ctx.lineTo(width, height - radius);         // 创建垂直线
    this.ctx.arcTo(width, height, width - radius, height, radius) // 创建右下弧
    this.ctx.lineTo(x + radius, height);         // 创建水平线
    this.ctx.arcTo(x, height, x, height - radius, radius) // 创建左下弧
    this.ctx.lineTo(x, y + radius); // 创建垂直线
    this.ctx.arcTo(x, y, x + radius, y, radius) // 创建左上弧

    this.ctx.fillStyle = fillStyle
    this.ctx.strokeStyle = strokeStyle || fillStyle

    if (!isEmpty(shadow)) {
      this.ctx.shadowColor = shadow.color
      this.ctx.shadowOffsetX = shadow.offsetX
      this.ctx.shadowOffsetY = shadow.offsetY
      this.ctx.shadowBlur = shadow.blur
    }

    this.ctx.fill()
    this.ctx.stroke(); // 绘制

    this.offset = {
      x,
      y: height
    }

    if (callback) callback(this.ctx, this.offset)

    return this
  }

  /**
   * @description 绘制图片
   * @param {object: {
   *   img: any,
   *   w: number,
   *   h: number,
   *   x?: number,
   *   y?: number,
   *   rgb?: number[]
   * }}
   * @return Draw
   * */
  drawImage({
    img,
    width,
    height,
    x = this.offset.x,
    y = this.offset.y,
    rgba = [],
  }) {
    this.ctx.drawImage(img, x, y, width, height)


    if (rgba.length >= 3) {
      const imageData = this.ctx.getImageData(x * this.dpr, y * this.dpr, width * this.dpr, height * this.dpr)
      const data = imageData.data
      const length = data.length
      for (let ipx = 0; ipx < length; ipx += 4) {
        const flag = [imageData.data[ipx], imageData.data[ipx + 1], imageData.data[ipx + 2]].includes(255)

        if (!flag) {
          imageData.data[ipx] = rgba[0]
          imageData.data[ipx + 1] = rgba[1]
          imageData.data[ipx + 2] = rgba[2]
          imageData.data[ipx + 3] = rgba[3] || 255
        }
      }

      this.ctx.putImageData(imageData, x * this.dpr, y * this.dpr)
    }

    this.offset = { x, y }

    return this
  }

  done() {
    this.offset = {}
    this.ctx.textAlign = 'left'

    return this
  }
}

const draw = new Draw()

export default draw
