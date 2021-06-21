import Folder from "../../../interface/core/Folder";
import Dom from "../../../interface/Dom";

export default class FileManager extends Dom {

     static base = location.origin + "/src/core/applications/file-system";
     static _name = "File Manager";
     static draggable_window = {
          title: FileManager._name,
          height: 400,
          width: 600
     };

     navbar = new Dom("div", { className: "navbar" });

     tree = new Dom("div", { className: "tree" });
     content = new Dom("div", { className: "content" });

     constructor() {
          super("div", { id: "FileManager" });

          // @ts-ignore
          this.tree.style = `font-family: arial;
          padding: 10px;
          height: -webkit-fill-available;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin: 10px;
          width: 138px;
          box-shadow: 0px 4px 6px #00000021;`;

          // @ts-ignore
          this.style = `height: -webkit-fill-available;display: flex;`;

          this.scaleContent(80);
     }

     scaleContent(size) {
          this.content.style = {
               transform: `scale(${size / 100}) translate(-${size / 2}px, -${size / 2}px)`
          }
     }

     /**
      * 
      * @param {Folder} folder 
      */
     createFolderTree(parent, folder, open?: boolean, op?: boolean) {
          if (typeof open === 'undefined') open = false;
          if (typeof op === 'undefined') op = true;

          const body = new Dom("div", { className: "folder" });
          const children = new Dom("div", { className: "children" });

          const icon = new Dom("span", { className: "material-icons", innerText: "folder" });
          const name = new Dom("span", { innerText: folder.name });

          // @ts-ignore
          icon.style = `color:#ffe69a;`;

          // @ts-ignore
          children.style = `width: fit-content;
          margin-left: 25px;`;

          // @ts-ignore
          name.style = `top: -7px;
          padding-left: 7px;
          position: relative;
          font-size: 11px;
          color: white;
          cursor:pointer;`;

          // @ts-ignore
          body.style = `user-select: none;`;

          const openList = () => {
               children.clear();
               folder.children.forEach(item => {
                    if (item instanceof Folder) {
                         if (item == item.folder) return;
                         this.createFolderTree(children, item, false)
                    }
               });

               this.createFolderContent(folder);
          }

          name.event("dblclick", () => openList())

          if (open) openList();

          if (op == true) {
               parent.add(
                    body.add(
                         icon,
                         name,
                         children
                    )
               );
          }
     };

     createClone(item) {
          const clone = item.createClone()
          const name = clone.get(".name");
          const icon = clone.get(".icon");

          item.createEvents({
               name: name,
               icon: icon,
               open: () => {
                    if (item instanceof Folder) this.openFolder(item, false);
                    else item.open()
               },
               update() {
                    const newClone = this.createClone(item)
                    clone.element.replaceWith(newClone.element)
               }
          });

          return clone;
     }

     createFolderContent(folder) {
          this.content.clear();

          this.content.add(
               ...folder.children.map(item => {

                    return this.createClone(item);
               })
          )
     }

     /**
      * 
      * @param {Folder} folder 
      */
     openFolder(folder, op?) {
          this.createFolderTree(this.tree, folder, true, op);
     }

     create(root, folder) {
          this.openFolder(folder || root.desktop.folder)

          this.add(this.tree, this.content);

          this.content.style = {
               width: `${this.element.offsetWidth - this.tree.element.offsetWidth}px`
          }
     }

}
