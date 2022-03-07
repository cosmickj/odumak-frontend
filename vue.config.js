const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "오두막",
    themeColor: "#005d9a",
  },
  devServer: {
    client: {
      overlay: false,
    },
  },
});
