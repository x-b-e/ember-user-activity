import { a as _applyDecoratedDescriptor, b as _initializerDefineProperty, _ as _defineProperty } from '../_rollupPluginBabelHelpers-241f4bb8.js';
import Ember from 'ember';
import EventManagerService from './-private/event-manager.js';
import { inject } from '@ember/service';
import { cancel, debounce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

var _dec, _class, _descriptor, _descriptor2;
let UserIdleService = (_dec = inject('user-activity'), (_class = class UserIdleService extends EventManagerService {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "userActivity", _descriptor, this);
    _defineProperty(this, "_debouncedTimeout", null);
    _defineProperty(this, "activeEvents", ['userActive']);
    _defineProperty(this, "IDLE_TIMEOUT", 600000);
    // 10 minutes
    _initializerDefineProperty(this, "isIdle", _descriptor2, this);
  }
  _setupListeners(method) {
    this.activeEvents.forEach(event => {
      this.userActivity[method](event, this, this.resetTimeout);
    });
  }

  // TODO: migrate to constructor
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init(...arguments);
    if (Ember.testing) {
      // Shorter debounce in testing mode
      this.IDLE_TIMEOUT = 10;
    }
    this._setupListeners('on');
    this.resetTimeout();
  }
  willDestroy() {
    this._setupListeners('off');
    if (this._debouncedTimeout) {
      cancel(this._debouncedTimeout);
    }
    super.willDestroy(...arguments);
  }
  resetTimeout() {
    let oldIdle = this.isIdle;
    this.isIdle = false;
    if (oldIdle) {
      this.trigger('idleChanged', false);
    }
    this._debouncedTimeout = debounce(this, this.setIdle, this.IDLE_TIMEOUT);
  }
  setIdle() {
    if (this.isDestroyed) {
      return;
    }
    this.isIdle = true;
    this.trigger('idleChanged', true);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "userActivity", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "isIdle", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
})), _class));

export { UserIdleService as default };
//# sourceMappingURL=user-idle.js.map
