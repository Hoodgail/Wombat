import Folder from "../../../interface/core/Folder";
import Dom from "../../../interface/Dom";
import ContextMenu from "../../../interface/core/ContextMenu";

export default class FileManager extends Dom {

     static base = location.origin + location.pathname + "/src/core/applications/file-system";
     static name = "File Manager";
     static draggable_window = {
          title: FileManager.name,
          height: 400,
          width: 600
     };

     navbar = new Dom("div", { className: "navbar" });
     navbarEvents = new Dom("div", { className: "navbarEvents" });
     navbarInput = new Dom("input", { className: "navbarInput" })

     tree = new Dom("div", { className: "tree" });
     content = new Dom("div", { className: "content" });
     anchor = new Dom("div", { className: "anchor" });

     childrens = new Map();

     constructor() {
          super("div", { id: "FileManager" });

          this.tree.style = `font-family: arial;
          padding: 10px;
          height: -webkit-fill-available;
          background: #ffffff1c;
          width: 138px;`;

          this.style = `height: -webkit-fill-available;display: flex;flex-direction: column;`;
          this.anchor.style = `height: -webkit-fill-available;display: flex;`;

          this.navbar.style = `height: 40px;
          width: -webkit-fill-available;
          display: flex;
          background: #ffffff1c;`

          this.navbarEvents.style = `display: flex;
          height: fit-content;
          margin-top: auto;
          margin-bottom: auto;
          margin-left: 35px;`

          this.navbarInput.style = `border: none;
          outline: none !important;
          font-size: 11px;
          margin: auto;
          width: 66%;
          padding: 5px;
          color: white;
          border-radius: 5px;
          padding-left: 10px;
          font-family: monospace;
          background: #ffffff24;`

          this.scaleContent(80);
     }

     navbarEvent(config) {
          const icon = new Dom("span", { className: "material-icons", innerText: config.icon });
          const body = new Dom("div", {
               className: "navbarEvent",
               append: [icon]
          });

          icon.style = `font-size: 21px;
          color: white;
          display: block;`;

          body.style = `height: fit-content;
          display: inline-block;
          cursor: pointer;`

          body.event("click", e => {
               e.stopPropagation();
               config.then();
          })

          this.navbarEvents.add(body)
     }

     scaleContent(size) {
          this.content.style = {
               transform: `scale(${size / 100}) translate(-${size / 2}px, -${size / 2}px)`
          }
     }

     createFolderTree(folder) {

          const body = new Dom("div", { className: "folder" });
          const children = new Dom("div", { className: "children" });

          const icon = new Dom("span", { className: "material-icons", innerText: "folder" });
          const name = new Dom("span", { innerText: folder.meta.name });

          icon.style = `color:#ffe69a;`;

          children.style = `width: fit-content;
          margin-left: 25px;`;

          name.style = `top: -7px;
          padding-left: 7px;
          position: relative;
          font-size: 11px;
          color: white;
          cursor:pointer;`;

          body.style = `user-select: none;`;

          children.hide();

          children.add(
               ...folder.children
                    .filter(e => e instanceof Folder)
                    .map(e => this.createFolderTree(e))
          )

          const open = () => {
               children.show();

               this.createFolderContent(folder);

               this.navbarInput.value = folder.path;

               if (folder.children.filter(e => e instanceof Folder).length !== 0) {
                    icon.text = "folder_open";
               }
          }

          name.event("dblclick", () => open());

          this.childrens.set(folder, { children, open })

          return body.add(
               icon,
               name,
               children
          )

     };

     createClone(item) {
          const clone = item.createClone()
          const name = clone.get(".name");
          const icon = clone.get(".icon");

          item.createEvents({
               name: name,
               icon: icon,
               open: () => {
                    if (item instanceof Folder) {
                         if (this.childrens.has(item)) {
                              this.childrens.get(item).open();
                         }
                    } else {
                         item.open()
                    }
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


     openFolder(folder) {
          this.tree.clear();
          this.tree.add(
               this.createFolderTree(folder)
          )
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

          this.add(this.navbar, this.anchor);
          this.navbar.add(this.navbarEvents, this.navbarInput)
          this.anchor.add(this.tree, this.content);

          this.createContext()

          this.navbarEvent({
               icon: "arrow_back",
               then() { }
          })
          this.navbarEvent({
               icon: "arrow_forward",
               then() { }
          })

          this.content.style = {
               width: `${this.element.offsetWidth - this.tree.element.offsetWidth}px`
          }
     }

}
