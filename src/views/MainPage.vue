<template>
  <div id="app">
    <!-- <h1>main page</h1> -->
  </div>
</template>

<script>
import { onMounted } from "@vue/composition-api";

class App {
  constructor() {
    this.container = document.querySelector("#app");
    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    new Tree(this.ctx, this.stageWidth / 2, this.stageHeight);
  }

  resize() {
    this.stageWidth = this.container.clientWidth;
    this.stageHeight = this.container.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  }
}

class Branch {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.color = "#000000";
    this.lineWidth = 10;
  }
  draw(ctx) {
    ctx.beginPath();

    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.startY, this.endY);

    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    ctx.stroke();
    ctx.closePath();
  }
}

class Tree {
  constructor(ctx, posX, posY) {
    this.ctx = ctx;
    this.posX = posX;
    this.posY = posY;
    this.branch = [];

    this.init();
  }
  init() {
    this.createBranch(this.posX, this.posY);
    this.draw(this.ctx);
  }
  createBranch(startX, startY) {
    const len = 200;
    const endX = startX;
    const endY = startY;

    this.branch.push(new Branch(startX, startY, endX, endY));
  }
  draw(ctx) {
    for (let i = 0; i < this.branch.length; i++) {
      this.branch[i].draw(ctx);
    }
  }
}

export default {
  setup() {
    onMounted(() => {
      new App();
    });
  },
};
</script>

<style>
canvas {
  border: 3px solid orange;
}
</style>
