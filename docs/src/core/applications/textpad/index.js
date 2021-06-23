import Dom from "../../../interface/Dom";

export default class Textpad extends Dom {

     static base = location.origin + location.pathname + "/src/core/applications/textpad";
     static name = "Textpad";
     static draggable_window = {
          title: Textpad.name,
          height: 400,
          width: 600
     };

     textarea = new Dom("textarea", { className: "textpad" })

     constructor() {
          super("div", { id: "Textpad" });
     }

     create(root, data) {

          this.root = root;

          this.style = {
               width: "-webkit-fill-available",
               height: "-webkit-fill-available"
          };

          this.textarea.style = `width: -webkit-fill-available;
          border: none;
          outline: none;
          transition:all 0.5s;
          padding-left: 5px;
          color: #ffffff96;
          padding-top: 5px;
          background: #00000070;
          position: relative;`

          this.add(this.textarea);

          setTimeout(() => {
               this.textarea.style = { height: "-webkit-fill-available" }
          }, 500);

          console.log(this.textarea);

          if (typeof data == "string") this.textarea.value = data
     }


}
