const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    themeColor: "#f8f9fa",
    backgroundColor: "#f8f9fa",
    display: "standalone",
    scope: "/",
    startUrl: "/",
    name: "오두막",
    shortName: "오두막",
    description: "영은교회 초등부 출석부 웹앱",
  },
  devServer: {
    client: { overlay: false },
  },
});
