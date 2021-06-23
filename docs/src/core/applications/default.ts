import Application from "../../interface/core/Application";

// @ts-ignore
import Calculator from "./calculator/index";

// @ts-ignore
import FileSystem from "./file-system/index";

// @ts-ignore
import Textpad from "./textpad/index"

/**
 * Default external applications.
 */
export const applications = [

     new Application(
          Calculator
     ),
     new Application(
          FileSystem
     ),
     new Application(
          Textpad
     )

];