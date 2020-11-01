module.exports = {
  extends: [ `stylelint-config-recommended` ],
  plugins: [ `stylelint-scss` ],
  rules: {
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "string-quotes": `double`,
    "at-rule-no-unknown": null,
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
