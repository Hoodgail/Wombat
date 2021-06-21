export default class ExternalError {

     constructor(message) {
          const error = new Error(message);

          console.error(error);

          return error;
     }

}