export default class ResourceNotFoundException extends Error {
   constructor (message = "Resource not found Exception") {
      super(message);
      this.name = "ResourceNotFoundException";
      this.statusCode = 404;
   }
}