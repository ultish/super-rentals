import Route from '@ember/routing/route';
import { DEBUG } from '@glimmer/env';
import { service } from '@ember/service';

import { registerDestructor } from '@ember/destroyable';

export default class ApplicationRoute extends Route {
  @service store;

  async beforeModel() {
    // Don't include MSW in production, only in DEBUG (tests, development)
    if (DEBUG) {
      await this.setupMSW(this);
    }
  }

  async setupMSW(context) {
    let { worker } = await import('/mocks/browser.js');
    await worker.start();

    // Prevent duplication in tests,
    // where the app is setup and torn down a lot
    registerDestructor(context, () => worker.stop());
  }
}
