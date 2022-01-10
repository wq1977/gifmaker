const GIFEncoder = require("gifencoder");
const { registerFont, createCanvas } = require("canvas");
registerFont("font.ttf", {
  family: "song",
});
const WIDTH = 650;
const HEIGHT = 50;

// app.js
const Koa = require("koa");
const app = new Koa();

const main = (ctx) => {
  ctx.type = "image/gif";
  const { s } = ctx.request.query;
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  ctx.body = encoder.createReadStream();

  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(200); // frame delay in ms
  encoder.setQuality(10); // image quality. 10 is default.

  const canvas = createCanvas(WIDTH, HEIGHT);
  const drawctx = canvas.getContext("2d");

  const string = s || "hello GIF！";

  const txtFont = '42px "song"';
  const bgcolor = "#B0171F";

  drawctx.fillStyle = bgcolor;
  drawctx.fillRect(0, 0, WIDTH, HEIGHT);
  encoder.addFrame(ctx);

  drawctx.font = txtFont;
  const left = (WIDTH - drawctx.measureText(string).width) / 2;

  for (let i = 0; i < string.length; i++) {
    drawctx.fillStyle = bgcolor;
    drawctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawctx.fillStyle = "#FFFFFF";
    drawctx.font = txtFont;
    drawctx.fillText(string.substring(0, i + 1), left, 37);
    encoder.addFrame(drawctx);
  }

  for (let i = 0; i < 3; i++) {
    drawctx.fillStyle = bgcolor;
    drawctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawctx.fillStyle = "#FFFFFF";
    drawctx.font = txtFont;
    drawctx.fillText(string, left, 37);
    encoder.addFrame(drawctx);
  }

  encoder.finish();
  //   ctx.response.body = s || "Hello World";
};

app.use(main);
app.listen(9000, "0.0.0.0");
