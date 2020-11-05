export default {
  name: `udder`,
  cow: (action = `\\`, eyes = `oo`, tongue = `  `) => (
    `  ${action}
   ${action}    (__)
        ${eyes[0] || ``} ${eyes[1] || ``}\\
       ('') \\---------
        ${tongue}\\           \\
           |          |\\
           ||---(  )_|| *
           ||    UU  ||
           ==        ==    `
  )
};
