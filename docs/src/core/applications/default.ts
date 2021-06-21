import Application from "../../interface/core/Application";

import Calculator from "./calculator/index";
import FileSystem from "./file-system/index";
import Netflix from "./netflix/index"

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
          Netflix
     )

];