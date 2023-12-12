import EventManagerService from './event-manager.js';

class FastBootAwareEventManagerService extends EventManagerService {
  get _isFastBoot() {
    return typeof FastBoot !== 'undefined';
  }
}

export { FastBootAwareEventManagerService as default };
//# sourceMappingURL=fastboot-aware-event-manager.js.map
