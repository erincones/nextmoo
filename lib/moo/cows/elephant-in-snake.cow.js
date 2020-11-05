export default {
  name: `elephant-in-snake`,
  cow: (action = `\\`) => (
    `   ${action}
    ${action}              ....
           ........    .
          .            .
         .             .
.........              .......
..............................
Elephant inside ASCII snake`
  )
};
