export default class ExternalError {

     constructor(message: string) {
          const error = new Error(message);

          console.error(error);

          return error;
     }

}