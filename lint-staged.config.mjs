export default {
  "**/*.ts?(x)": () => "tsc",
  "**/*": "eslint --cache",
};
