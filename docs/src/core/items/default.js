import Folder from "../../interface/core/Folder.js";
import File from "../../interface/core/File.js";


export const folders = [
     new Folder({
          name: "Testing",
          children: [
               new File({ name: "Test.txt", data: "Hello World", dataType: "utf8" })
          ]
     })
]