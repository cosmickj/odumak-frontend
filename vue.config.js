const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false,
    },
  },
  pwa: {
    name: "영은교회 출석부",
    themeColor: "#005d9a",
  },
});
