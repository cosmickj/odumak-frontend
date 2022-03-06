const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false,
    },
  },
  pwa: {
    name: "오두막",
    themeColor: "#005d9a",
  },
});
