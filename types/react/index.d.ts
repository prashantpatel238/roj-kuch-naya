declare module 'react' {
  const React: any;
  export default React;
  export = React;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
