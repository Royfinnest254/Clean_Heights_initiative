import("./dist/index.js").catch((error) => {
  console.error("The Clean Heights server has not been built yet or failed to start.", error);
  process.exit(1);
});
