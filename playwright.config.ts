import {defineConfig, devices} from '@playwright/test'

/**
 * End-to-end tests run against a PRODUCTION build (`npm run build` first).
 *
 *   :3100  "integrated" — OpenAI + Resend pointed at the local mock (tests/mocks/server.mjs)
 *   :3101  "unconfigured" — no OpenAI/Resend keys, to verify honest unavailable states
 *
 * Both read real, published content from the configured Sanity dataset.
 */
const MOCK = 'http://localhost:4010'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  reporter: [['list']],
  use: {baseURL: 'http://localhost:3100', trace: 'retain-on-failure'},
  projects: [
    {
      name: 'desktop',
      use: {...devices['Desktop Chrome'], viewport: {width: 1280, height: 900}},
      testIgnore: /mobile\.spec/,
    },
    {name: 'mobile', use: {...devices['iPhone 13'], browserName: 'chromium'}, testMatch: /mobile\.spec/},
  ],
  webServer: [
    {command: 'node tests/mocks/server.mjs', url: `${MOCK}/__last/openai`, reuseExistingServer: false},
    {
      command: 'npx next start -p 3100',
      url: 'http://localhost:3100/robots.txt',
      reuseExistingServer: false,
      env: {
        IWC_LOCAL_INTEGRATION_TEST: 'true',
        FORM_SECRET: 'local-form-signing-test-only',
        OPENAI_API_KEY: 'test-key-not-real',
        OPENAI_BASE_URL: `${MOCK}/v1`,
        RESEND_API_KEY: 'test-key-not-real',
        RESEND_API_BASE: MOCK,
        RESEND_AUDIENCE_ID: 'aud_test',
        CONTACT_TO_EMAIL: 'frontdesk@example.test',
        CONTACT_FROM_EMAIL: 'website@example.test',
        PROVIDER_TO_EMAIL: 'referrals@example.test',
      },
    },
    {
      command: 'npx next start -p 3101',
      url: 'http://localhost:3101/robots.txt',
      reuseExistingServer: false,
      env: {OPENAI_API_KEY: '', RESEND_API_KEY: '', FORM_SECRET: 'local-form-signing-test-only'},
    },
    {
      command: 'npx next start -p 3104',
      url: 'http://localhost:3104/robots.txt',
      reuseExistingServer: false,
      env: {
        OPENAI_API_KEY: 'test-key-not-real',
        IWC_ASSISTANT_APPROVED: '',
        IWC_LOCAL_INTEGRATION_TEST: '',
        UPSTASH_REDIS_REST_URL: '',
        UPSTASH_REDIS_REST_TOKEN: '',
      },
    },
  ],
})
