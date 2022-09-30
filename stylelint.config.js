module.exports = {
  extends: [ `stylelint-prettier/recommended` ],
  rules: {
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          `tailwind`,
          `apply`,
          `variants`,
          `responsive`,
          `screen`,
          `layer`
        ]
      }
    ]
  }
};
