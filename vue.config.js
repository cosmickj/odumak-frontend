const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "오두막",
    themeColor: "#f8f9fa",
  },
  devServer: {
    client: {
      overlay: false,
    },
  },
});
