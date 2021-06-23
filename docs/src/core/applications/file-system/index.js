import Folder from "../../../interface/core/Folder";
import Dom from "../../../interface/Dom";
import ContextMenu from "../../../interface/core/ContextMenu"

export default class FileManager extends Dom {

     static base = location.origin + location.pathname + "/src/core/applications/file-system";
     static name = "File Manager";
     static draggable_window = {
          title: FileManager.name,
          height: 400,
          width: 600
     };

     navbar = new Dom("div", { className: "navbar" });

     tree = new Dom("div", { className: "tree" });
     content = new Dom("div", { className: "content" });

     constructor() {
          super("div", { id: "FileManager" });

          this.tree.style = `font-family: arial;
          padding: 10px;
          height: -webkit-fill-available;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          margin: 10px;
          width: 138px;
          box-shadow: 0px 4px 6px #00000008;`;

          this.style = `height: -webkit-fill-available;display: flex;`;

          this.scaleContent(80);
     }

     scaleContent(size) {
          this.content.style = {
               transform: `scale(${size / 100}) translate(-${size / 2}px, -${size / 2}px)`
          }
     }

     createFolderTree(parent, folder, open, op = true, child) {


          const body = new Dom("div", { className: "folder" });
          const children = new Dom("div", { className: "children" });

          const icon = new Dom("span", { className: "material-icons", innerText: "folder" });
          const name = new Dom("span", { innerText: folder.meta.name });

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

          children.hide();

          folder.children.forEach(item => {
               if (item instanceof Folder) {
                    if (item == item.folder) return;

                    this.createFolderTree(children, item, item == child)
               }
          });

          name.event("dblclick", () => {
               children.show();
               this.createFolderContent(folder);
          });

          if (child && child.parent == folder) open = true;

          if (open) children.show();

          this.createFolderContent(child || folder);

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
                    if (item instanceof Folder) this.openFolder(item, false, null);
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


     openFolder(folder, op, child) {
          this.createFolderTree(this.tree, folder, true, op, child);
     }

     createContext() {
          const contextMenu = new ContextMenu(this.element, []);

          contextMenu.emitter.addEventListener("open", e => {
               const items = [];

               const element = e.path.filter(e => e.id == "Item").pop();

               if (element && element.item.context) {
                    items.push(...element.item.context);

                    contextMenu.ignore = false
               } else {
                    contextMenu.ignore = true;
               }

               contextMenu.createItems(items);
          })

          contextMenu.install();
     }


     create(root, folder) {
          this.openFolder(root.desktop.folder, true, folder);

          this.add(this.tree, this.content);

          this.createContext()

          this.content.style = {
               width: `${this.element.offsetWidth - this.tree.element.offsetWidth}px`
          }
     }

}
