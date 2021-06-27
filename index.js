const { createCanvas, loadImage } = require('canvas')
const { readdirSync, createWriteStream } = require('fs')
const { resolve, extname } = require('path')
require('dotenv').config()
const config = require('./config')

// 配置
const { CANVAS_SIZE = config.CANVAS_SIZE, CANVAS_BG_COLOR = config.CANVAS_BG_COLOR, EXTS = config.EXTS } = process.env
const exts = EXTS.split(',').map(e => `.${e}`)
let CanvasWidth, CanvasHeight

try {
  const [width, height] = CANVAS_SIZE.split('*')
  CanvasWidth = Number(width)
  CanvasHeight = Number(height)
} catch {
  const [width, height] = config.CANVAS_SIZE.split('*')
  CanvasWidth = Number(width)
  CanvasHeight = Number(height)
}

// 目录
const inputDir = resolve(__dirname, 'input')
const outputDir = resolve(__dirname, 'output')
let inputs = readdirSync(inputDir)

// 过滤文件
inputs = inputs.filter(i => exts.includes(extname(i)))

if (!inputs.length) {
  throw Error('无图片需要处理')
}

// 填充图片
inputs.forEach(i => {
  const canvas = createCanvas(CanvasWidth, CanvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = `${CANVAS_BG_COLOR}`
  ctx.fillRect(0, 0, CanvasWidth, CanvasHeight)

  loadImage(resolve(inputDir, i))
    .then(image => {
      // 居中
      ctx.drawImage(image, (CanvasWidth - image.width) / 2, (CanvasHeight - image.height) / 2)

      // 生成图片
      const png = createWriteStream(resolve(outputDir, i))
      const stream = canvas.createPNGStream()
      stream.on('data', chunk => {
        png.write(chunk)
      })
      stream.on('end', () => {
        console.log(i, '已生成')
      })
    })
})
