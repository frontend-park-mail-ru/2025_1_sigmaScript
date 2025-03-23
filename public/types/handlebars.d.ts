declare module '*.hbs' {
  const template: (context?: unknown) => string;
  export default template;
}
