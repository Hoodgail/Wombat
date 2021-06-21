import { stylesheet } from "./global.js";
import Root from "./interface/Root.js";

stylesheet("/stylesheet/Taskbar.css")
stylesheet("/stylesheet/Root.css")
stylesheet("/stylesheet/Desktop.css")
stylesheet("/stylesheet/Item.css")
stylesheet("/stylesheet/ContextMenu.css")
stylesheet("/stylesheet/material-icons/material-icons.css")
stylesheet("/stylesheet/DraggableWindow.css")

const root = new Root();

root.create();