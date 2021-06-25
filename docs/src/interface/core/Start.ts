import Dom from "../Dom";
import Item from "./Item";

import { applications } from "../../core/applications/default";
import Application from "./Application";

export default class Start extends Dom {

     //** Apps, files or folders pinged on the start nav */
     public pinned: Array<Item> = [];

     //** Apps, files or folders recommended on the start nav */
     public recommended: Array<Item> = [];

     private searchInputBody: Dom = new Dom("div", { className: "searchInputBody" });
     private searchInputIcon: Dom = new Dom("span", { className: "material-icons", innerText: "search" });
     public searchInput: Dom = new Dom("input", { className: "searchInput", placeholder: "Type here to search." });

     /** start button placed on the task bar to lauch the start nav on click */
     public launcherBody: Dom = new Dom("div", { id: "StartLauncher" })
     private launcherIcon: Dom = new Dom("img", { className: "icon", src: "./images/icon.png" });

     private contentBody: Dom = new Dom("div", { className: "content" });

     public height: number = 400;

     public opened: boolean = false;

     constructor() {
          super("div", { id: "Start" });

          this.searchInputBody.add(
               this.searchInputIcon,
               this.searchInput
          );

          this.launcherBody.add(this.launcherIcon);

          this.add(this.searchInputBody, this.contentBody);

          this.launcherBody.event("click", () => this.open());

          document.addEventListener("pointerdown", e => {
               let path = e.composedPath();

               if (this.element instanceof EventTarget && this.launcherBody.element instanceof EventTarget) {
                    let ignore = path.includes(this.element)
                         || path.includes(this.launcherBody.element);

                    if (!ignore) return this.close()
               }

          });

          this.searchInput.event("keydown", (e: any) => {
               if (e.key !== "Enter") {

                    this.listItems(
                         applications
                              .filter(e => e.meta.name.toLowerCase().includes(this.searchInput.value.toString()))
                    );

                    this.scaleContent(80)

               }
          })

          this.hide();
     };

     scaleContent(size: number) {

          this.contentBody.style = size !== 100 ? {
               transform: `scale(${size / 100}) translate(-${size / 2}px, -${size / 4}px)`
          } : {
               transform: "scale(1)"
          };

     }

     listItems(items: Array<Application>) {
          this.contentBody.clear();

          this.contentBody.add(
               ...items.map(item => this.createItemBody(item))
          )
     }

     createItemBody(item: Item | Application) {
          const clone = item.createClone()

          const name = clone.get(".name");
          const icon = clone.get(".icon");

          item.createEvents({

               //@ts-ignore
               name: name,

               //@ts-ignore
               icon: icon,
               open: () => item.open(),
               update: () => {
                    const newClone = this.createItemBody(item);

                    if (clone.element instanceof Element)
                         if (newClone.element instanceof Element)
                              clone.element.replaceWith(newClone.element)
               }
          });

          return clone;
     }

     close() {

          this.opened = false;

          this.style = {
               top: "0px",
               height: "0px"
          };

          setTimeout(() => this.hide(), 100);

          this.launcherBody.attribute("active", "false");

          this.contentBody.clear();

          this.searchInput.value = "";

          this.scaleContent(100);
     }

     open() {

          if (this.opened) return this.close();

          this.opened = true;

          const { top, bottom, left, right } = this.launcherBody.rect;

          this.launcherBody.attribute("active", "true");

          this.show()

          this.style = {
               top: "0px",
               height: "0px"
          };

          setTimeout(() => {
               this.style = {
                    top: `${top - (this.height + 10)}px`,
                    left: `${left}px`,
                    right: `${right}px`,
                    bottom: `${bottom}px`,
                    height: this.height + "px"
               };
          }, 10)
     }

     create() {

     }

}