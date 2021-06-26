const { createCanvas, loadImage } = require('canvas')
const { readdirSync, createWriteStream } = require('fs')
const { resolve, extname } = require('path')

// 目录
const inputDir = resolve(__dirname, 'input')
const outputDir = resolve(__dirname, 'output')
let inputs = readdirSync(inputDir)

if (!inputs.length) {
  throw Error('无图片需要处理')
}

// 过滤文件
const exts = ['.png', '.jpg']
inputs = inputs.filter(i => exts.includes(extname(i)))

// 创建画布
const height = 500
const width = 500

// 填充图片
inputs.forEach(i => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)

  loadImage(resolve(inputDir, i))
    .then(image => {
      // 居中
      ctx.drawImage(image, (width - image.width) / 2, (height - image.height) / 2)

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
