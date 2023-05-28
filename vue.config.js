// const fs = require("fs");

module.exports = {
  // devServer: {
  //   port: 8081,
  //   // https: {
  //   //   key: fs.readFileSync("./certs/example.com+5-key.pem"),
  //   //   cert: fs.readFileSync("./certs/example.com+5.pem"),
  //   // },
  //   public: "https://localhost:8081/",
  // },
  devServer: {
    port: 8081,
    public: "cekasiekhos.beget.app",
    compress: true,
    disableHostCheck: true, // That solved it
  },
};
