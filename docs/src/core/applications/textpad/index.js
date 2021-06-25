import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import Dom from "../../../interface/Dom";

export default class Textpad extends Dom {

     static base = location.origin + location.pathname + "/src/core/applications/textpad";
     static name = "Textpad";
     static draggable_window = {
          title: Textpad.name,
          height: 400,
          width: 600
     };

     textarea = new Dom("div", { className: "textpad" })

     /** @type {monaco.editor.IStandaloneEditorConstructionOptions} */
     config = {
          lineNumbers: true,
          autoRefresh: true,
          theme: "vs-dark"
     }

     /** @type {monaco.editor.IStandaloneCodeEditor} */
     editor = null;

     constructor() {
          super("div", { id: "Textpad" });
     }

     clearEditor() {
          if (!this.editor) throw new Error("The editor is not yet created to be cleared")
          this.editor.clear();
     }

     resize() {
          const height = this.element.offsetHeight;
          const width = this.element.offsetWidth;

          this.editor.layout({ height, width })
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
          opacity: 0.5;
          transition:all 0.5s;
          color: #ffffff96;
          background: #00000070;
          position: relative;`

          this.add(this.textarea);

          setTimeout(() => {
               this.textarea.style = { height: "-webkit-fill-available" }

               this.editor = monaco
                    .editor
                    .create(this.textarea.element, { ...this.config, value: data });

               //monaco.editor.defineTheme("github-dark", GithubDark)
               //monaco.editor.setTheme('github-dark');

               this.resize();
          }, 500);
     }


}
