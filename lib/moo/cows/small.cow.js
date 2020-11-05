export default {
  name: `small`,
  cow: (action = `\\`, eyes = `oo`, tongue = `  `) => (
    `       ${action}   ,__,
        ${action}  (${eyes.length ? eyes : `..`})____
           (__)    )\\
            ${tongue}||--|| *`
  )
};
