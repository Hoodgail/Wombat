export default class Vector2 {

     /** @type {number} */
     x = 0;
     y = 0;

     /**
      * 
      * @param {number} x 
      * @param {number} y 
      */
     set(x, y) {
          this.x = x;
          this.y = y;
     }

     /**
      * 
      * @param {Vector2} vector2 
      * @param {number} interpolation 
      */
     lerp(vector2, interpolation) {
          this.set(
               this.x * (1 - interpolation) + vector2.x * interpolation,
               this.y * (1 - interpolation) + vector2.y * interpolation,
          )
     }

}