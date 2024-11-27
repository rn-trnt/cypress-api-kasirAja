const { defineConfig } = require("cypress");
const dataGenerator = require("cypress-test-data-generator");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", dataGenerator(on, config));
    },
    baseUrl: "https://kasir-api.zelz.my.id",
    // baseUrl: "https://kasir-api.belajarqa.com",
  },
});
