export default {
  name: `three-eyes`,
  cow: (action = `\\`, eyes = `oo`, tongue = `  `) => (
    `        ${action}  ^___^
         ${action} (${eyes}${eyes[1] || ``})\\_______
           (___)\\       )\\/\\
            ${tongue}  ||----w |
                ||     ||`
  )
};
