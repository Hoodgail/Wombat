import Dom from "../../../interface/Dom";

export default class Calculator extends Dom {

     static base = location.origin + "/src/core/applications/calculator";
     static _name = "Calculator";
     static draggable_window = {
          title: Calculator._name,
          height: 400,
          width: 300
     };

     input = new Dom("input", { value: 0, className: "input" });
     content = new Dom("div", { className: "content" });
     buttons = [];

     constructor() {
          super("div", { id: Calculator._name });

          this.input.style = {
               margin: "10px",
               width: "-webkit-fill-available",
               border: "none",
               height: "45px",
               fontSize: "30px",
               background: "#ffffff2e",
               borderRadius: "10px",
               paddingLeft: "10px",
               color: "white"
          };

          this.content.style = {
               // width: "fit-content", // no duplicates noob
               margin: "auto",
               marginTop: "40px",
               width: "67%"
          }
     }

     createInput(config) {
          const input = new Dom("input", { type: "button", value: config.value, name: config.name });

          input.style = {
               margin: "5px",
               border: "none",
               height: "40px",
               width: "40px",
               fontSize: "25px",
               color: "white",
               borderRadius: typeof config.value == "number" ? "5px" : "50px",
               background: "#0000004d",
               transition: "all 0.1s",
               boxShadow: "0px 2px 6px #00000052"
          };

          input.event("mouseover", () => {
               input.style = {
                    background: "rgb(0 0 0 / 50%)",
                    boxShadow: "rgb(0 0 0 / 65%) 0px 2px 6px"
               }
          })

          input.event("mouseleave", () => {
               input.style = {
                    background: "#0000004d",
                    boxShadow: "0px 2px 6px #00000052"
               }
          })

          input.event("click", () => {
               if (config.then) this.input.value = config.then(this.input)
               else this.input.value += config.value
          });

          return input;
     }

     create() {
          this.content.add(
               this.createInput({ name: "one", value: 1 }),
               this.createInput({ name: "one", value: 2 }),
               this.createInput({ name: "one", value: 3 }),
               this.createInput({ name: "plus", value: "+" }),
               new Dom("br", {}),

               this.createInput({ name: "one", value: 4 }),
               this.createInput({ name: "one", value: 5 }),
               this.createInput({ name: "one", value: 6 }),
               this.createInput({ name: "minus", value: "-" }),
               new Dom("br", {}),

               this.createInput({ name: "one", value: 7 }),
               this.createInput({ name: "one", value: 8 }),
               this.createInput({ name: "one", value: 9 }),
               this.createInput({ name: "times", value: "*" }),
               new Dom("br", {}),

               this.createInput({ name: "clear", value: "C", then: () => "" }),
               this.createInput({ name: "zero", value: 0 }),
               this.createInput({ name: "doit", value: "=", then: input => this.calculate(this.parseCalculationString(input.value)) }),
               this.createInput({ name: "div", value: "/" }),
               new Dom("br", {})
          );

          this.add(
               this.input,
               this.content
          )
     };

     parseCalculationString(s) {
          // --- Parse a calculation string into an array of numbers and operators
          let calculation = [];
          let current = '';

          for (var i = 0, ch; ch = s.charAt(i); i++) {

               if ('^*/+-'.indexOf(ch) > -1) {

                    if (current == '' && ch == '-') { current = '-' }
                    else { calculation.push(parseFloat(current), ch); current = '' };

               } else {
                    current += s.charAt(i);
               }

          }

          if (current != '') calculation.push(parseFloat(current));

          return calculation;
     };

     calculate(c) {

          // --- Perform a calculation expressed as an array of operators and numbers
          const ops = [
               { '^': (a, b) => Math.pow(a, b) },
               { '*': (a, b) => a * b, '/': (a, b) => a / b },
               { '+': (a, b) => a + b, '-': (a, b) => a - b }
          ]

          let nc = [];

          let co;

          for (var i = 0; i < ops.length; i++) {

               for (var j = 0; j < c.length; j++) {

                    if (ops[i][c[j]]) { co = ops[i][c[j]]; }

                    else if (co) { nc[nc.length - 1] = co(nc[nc.length - 1], c[j]); co = null; }
                    else { nc.push(c[j]); }

               }

               c = nc;
               nc = [];
          }


          if (c.length > 1) return c || 'Error.';
          else return c[0] || 'Error.';

     }
}
