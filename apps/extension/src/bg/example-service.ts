import { defineProxyService } from '@webext-core/proxy-service'

class ExampleService {
  doSomething() {
    const randomHex = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')}`
    // console.log(`Example service generating random color: ${randomHex}`);
    return randomHex
  }
}

export const [registerExampleService, getExampleService] = defineProxyService(
  'ExampleService',
  () => new ExampleService(),
)
