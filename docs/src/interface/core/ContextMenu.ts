import EventEmitter from "../../EventEmitter";

export interface ContextMenuItem {
     color: string;
     disabled: boolean;
     text: string;
     hotkey: string;
     subitems: Array<ContextMenuItem>;
     submenu: ContextMenu;
     onclick: Function;
}

export interface ContextMenuEvent {
     handled: boolean,
     item: ContextMenuItem,
     label: HTMLSpanElement,
     hotkey: HTMLSpanElement,
     items: Array<ContextMenuItem> | undefined,
     data: any
};

export default class ContextMenu {

     public parent?: ContextMenu | undefined;
     public dom?: HTMLDivElement;
     public submenus?: Array<ContextMenu>;
     public submenu?: ContextMenu;

     public container: any;
     public ignore?: boolean;

     private _onclick?: Function;
     private _oncontextmenu?: Function;
     private _oncontextmenu_keydown?: Function;
     private _onblur?: Function | any;

     public items?: Array<ContextMenuItem>;

     emitter = new EventEmitter();

     shown = false;
     root = true;

     constructor(container: HTMLElement | Element | null, items: Array<ContextMenuItem>) {

          if (this.container !== null) {
               this.container = container;

               this._onclick = (e: { target: HTMLElement | Node; }) => {
                    if (this.dom && e.target != this.dom &&
                         e.target.parentElement != this.dom &&
                         e.target instanceof HTMLElement &&
                         !e.target.classList.contains('item') &&
                         e.target.parentElement &&
                         !e.target.parentElement.classList.contains('item')) {
                         this.hideAll();
                    }
               };

               this._oncontextmenu = (e: { target: HTMLElement, preventDefault: Function, clientX: number, clientY: number }) => {
                    this.emitter.emit("open", e);
                    e.preventDefault();
                    if (this.ignore) return this.hideAll();
                    if (e.target != this.dom &&
                         e.target.parentElement != this.dom &&
                         e.target instanceof HTMLElement &&
                         !e.target.classList.contains('item') &&
                         e.target.parentElement &&
                         !e.target.parentElement.classList.contains('item')) {
                         this.hideAll();
                         this.show(e.clientX, e.clientY);
                    }
               };

               this._oncontextmenu_keydown = (e: { preventDefault: Function, clientX: number, clientY: number, keyCode: number }) => {
                    if (e.keyCode != 93) return;
                    e.preventDefault();

                    this.hideAll();
                    this.show(e.clientX, e.clientY);
               };

               this._onblur = (e: Event) => {
                    this.hideAll();
               };
          }


     }

     createItems(items: Array<ContextMenuItem>) {
          this.items = items;
     }

     getMenuDom() {
          const menu = document.createElement('div');
          menu.classList.add('context');

          for (const item of this.items || []) {
               menu.appendChild(this.itemToDomEl(item));
          }

          return menu;
     }

     itemToDomEl(data: ContextMenuItem) {
          const item: any = document.createElement('div');

          if (data === null) {
               item.classList = 'separator';
               return item;
          }

          if (data.hasOwnProperty('color') && /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.color.toString())) {
               item.style.cssText = `color: ${data.color}`;
          }

          item.classList.add('item');

          const label: any = document.createElement('span');
          label.classList = 'label'
          label.innerText = data.hasOwnProperty('text') ? data['text'].toString() : '';
          item.appendChild(label);

          if (data.hasOwnProperty('disabled') && data['disabled']) {
               item.classList.add('disabled');
          } else {
               item.classList.add('enabled');
          }

          const hotkey: HTMLSpanElement = document.createElement('span');
          hotkey.classList.add('hotkey')
          hotkey.innerText = data.hasOwnProperty('hotkey') ? data['hotkey'].toString() : '';
          item.appendChild(hotkey);

          if (data.hasOwnProperty('subitems') && Array.isArray(data['subitems']) && data['subitems'].length > 0) {
               const menu = new ContextMenu(this.container, data['subitems']);
               menu.root = false;
               menu.parent = this;

               const openSubItems = (e: Event) => {
                    if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                         return;

                    this.hideSubMenus();

                    if (this.dom !== undefined) {
                         const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                         const y = this.dom.offsetTop + item.offsetTop;

                         if (!menu.shown) {
                              menu.show(x, y);
                         } else {
                              menu.hide();
                         }
                    }


               };

               if (this.submenus !== undefined) this.submenus.push(menu);

               item.classList.add('has-subitems');
               item.addEventListener('click', openSubItems);
               item.addEventListener('mousemove', openSubItems);
          } else if (data.hasOwnProperty('submenu') && data['submenu'] instanceof ContextMenu) {
               const menu = data['submenu'];
               menu.root = false;
               menu.parent = this;

               const openSubItems = () => {
                    if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                         return;

                    this.hideSubMenus();

                    if (this.dom !== undefined) {
                         const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                         const y = this.dom.offsetTop + item.offsetTop;

                         if (!menu.shown) {
                              menu.show(x, y);
                         } else {
                              menu.hide();
                         }
                    }
               };

               if (this.submenus) this.submenus.push(menu);

               item.classList.add('has-subitems');
               item.addEventListener('click', openSubItems);
               item.addEventListener('mousemove', openSubItems);
          } else {
               item.addEventListener('click', () => {
                    this.hideSubMenus();

                    if (item.classList.contains('disabled'))
                         return;

                    if (data.hasOwnProperty('onclick') && typeof data['onclick'] === 'function') {
                         const event: ContextMenuEvent = {
                              handled: false,
                              item: item,
                              label: label,
                              hotkey: hotkey,
                              items: this.items,
                              data: data
                         };

                         data['onclick'](event);

                         if (!event.handled) {
                              this.hide();
                         }
                    } else {
                         this.hide();
                    }
               });

               item.addEventListener('mousemove', () => this.hideSubMenus());
          }

          return item;
     }

     hideAll() {

          if (this.root && this.dom !== undefined) {
               if (this.shown) {
                    this.hideSubMenus();

                    this.shown = false;
                    document.body.removeChild(this.dom);

                    if (this.parent !== undefined && this.parent.shown) {
                         this.parent.hide();
                    }
               }

               return;
          }

          if (this.parent !== undefined) this.parent.hide();

     }

     hide() {
          if (this.dom && this.shown) {
               this.shown = false;
               this.hideSubMenus();
               document.body.removeChild(this.dom);

               if (this.parent && this.parent.shown) {
                    this.parent.hide();
               }
          }
     }

     hideSubMenus(): void {
          if (!this.submenus) return;
          for (const menu of this.submenus) {
               if (menu.dom && menu.shown) {
                    menu.shown = false;
                    document.body.removeChild(menu.dom);
               }
               menu.hideSubMenus();
          }
     }

     show(x: number, y: number) {
          this.dom = this.getMenuDom();

          this.dom.style.left = `${x}px`;
          this.dom.style.top = `${y}px`;

          this.shown = true;
          document.body.appendChild(this.dom);
     }

     install() {
          this.container.addEventListener('contextmenu', this._oncontextmenu);
          this.container.addEventListener('keydown', this._oncontextmenu_keydown);
          this.container.addEventListener('click', this._onclick);
          window.addEventListener('blur', this._onblur);
     }

     uninstall() {
          this.dom = undefined;
          this.container.removeEventListener('contextmenu', this._oncontextmenu);
          this.container.removeEventListener('keydown', this._oncontextmenu_keydown);
          this.container.removeEventListener('click', this._onclick);
          window.removeEventListener('blur', this._onblur);
     }
}