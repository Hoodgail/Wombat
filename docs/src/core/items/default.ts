import Folder from "../../interface/core/Folder";
import File from "../../interface/core/File";

export const folders: Array<Folder> = [
     new Folder({
          name: "Testing",
          children: [
               new File({
                    name: "Test.txt",
                    data: "Hello World",
                    dataType: "utf8"
               })
          ]
     })
]