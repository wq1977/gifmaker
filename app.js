const GIFEncoder = require("gifencoder");
const { registerFont, createCanvas } = require("canvas");
registerFont("font.ttf", {
  family: "song",
});

// app.js
const Koa = require("koa");
const app = new Koa();

const main = (ctx) => {
  ctx.type = "image/gif";
  const { s } = ctx.request.query;
  const WIDTH = parseInt(ctx.request.query.w) || 650;
  const HEIGHT = parseInt(ctx.request.query.h) || 50;
  const FONT_SIZE = ctx.request.query.fs || 42;
  const BG_COLOR = ctx.request.query.bg || "#B0171F";
  const COLOR = ctx.request.query.c || "#FFFFFF";

  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  ctx.body = encoder.createReadStream();

  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(200); // frame delay in ms
  encoder.setQuality(10); // image quality. 10 is default.

  const canvas = createCanvas(WIDTH, HEIGHT);
  const drawctx = canvas.getContext("2d");

  const string = s || "hello GIF！";

  const txtFont = `${FONT_SIZE}px "song"`;
  const bgcolor = BG_COLOR;

  drawctx.fillStyle = bgcolor;
  drawctx.fillRect(0, 0, WIDTH, HEIGHT);
  encoder.addFrame(ctx);

  drawctx.font = txtFont;
  const matrics = drawctx.measureText(string);
  const left =
    (WIDTH - matrics.actualBoundingBoxRight + matrics.actualBoundingBoxLeft) /
    2;
  const top = (HEIGHT - FONT_SIZE) / 2 + matrics.actualBoundingBoxAscent;

  for (let i = 0; i < string.length; i++) {
    drawctx.fillStyle = bgcolor;
    drawctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawctx.fillStyle = COLOR;
    drawctx.font = txtFont;
    drawctx.fillText(string.substring(0, i + 1), left, top);
    encoder.addFrame(drawctx);
  }

  for (let i = 0; i < 3; i++) {
    drawctx.fillStyle = bgcolor;
    drawctx.fillRect(0, 0, WIDTH, HEIGHT);
    drawctx.fillStyle = COLOR;
    drawctx.font = txtFont;
    drawctx.fillText(string, left, top);
    encoder.addFrame(drawctx);
  }

  encoder.finish();
};

app.use(main);
app.listen(9000, "0.0.0.0");
