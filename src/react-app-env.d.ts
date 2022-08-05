/// <reference types="react-scripts" />
//declare module '*.css';

/*
declare module "*.css" {
    const styles: { [className: string]: string };
    export default styles;
  }
  declare module "*.css" {
  const content: any;
  export default content;
}
*/

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}