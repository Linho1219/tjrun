/// <reference types="vite/client" />

// Workaround to solve TS error in main.ts
declare module 'vuetify/styles' {
  const content: any
  export default content
}
