import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 120_000,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3010",
    trace: "on-first-retry",
    /*
     * `on-first-retry` y no `retain-on-failure`: este último graba TODOS los
     * tests para descartar luego los que pasan, y el screencast de una página
     * que monta 18 `<video>` encarece cada corrida sin aportar nada cuando
     * todo va en verde.
     */
    video: "on-first-retry",
  },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }],
  ...(process.env.PLAYWRIGHT_BASE_URL
    ? {}
    : {
        webServer: {
          command: "node ./node_modules/next/dist/bin/next start -p 3010",
          url: "http://localhost:3010",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
