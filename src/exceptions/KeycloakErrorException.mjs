export default class KeycloakErrorException extends Error {
   constructor (message) {
      super(message);
      this.name = "Keycloak Error";
      this.statusCode = 500;
   }
}