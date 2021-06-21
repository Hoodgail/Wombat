import Dom from "../../../interface/Dom";

export default class Netflix extends Dom {

     static base = location.origin + "/src/core/applications/netflix";
     static _name = "Netflix";
     static draggable_window = {
          title: Netflix._name,
          height: 400,
          width: 600
     };

     iframe = new Dom("iframe", { className: "netflix" })

     constructor() {
          super("div", { id: "Netflix" });
     }

     create() {
          this.iframe.src = "https://www.netflix.com";

          this.iframe.style = {
               width: "-webkit-fill-available",
               height: "-webkit-fill-available",
               border: "none"
          }

          this.add(this.iframe);
     }


}