declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_PUBLIC_URL: string
    PLAYWRIGHT_TEST_BASE_URL: string
    REACT_APP_RPC_URL: string
  }
}
