import Application from "../../interface/core/Application.js";

/**
 * Default external applications.
 */
export const applications = [

     new Application(
          await import("./calculator/index.js")
     ),
     new Application(
          await import("./file-system/index.js")
     ),
     new Application(
          await import("./netflix/index.js")
     )

];