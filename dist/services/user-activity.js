import { a as _applyDecoratedDescriptor, b as _initializerDefineProperty, _ as _defineProperty } from '../_rollupPluginBabelHelpers-241f4bb8.js';
import FastBootAwareEventManagerService from './-private/fastboot-aware-event-manager.js';
import Ember from 'ember';
import { A } from '@ember/array';
import { throttle } from '@ember/runloop';
import { inject } from '@ember/service';
import storageAvailable from '../utils/storage-available.js';

var _dec, _class, _descriptor;
let UserActivityService = (_dec = inject('scroll-activity'), (_class = class UserActivityService extends FastBootAwareEventManagerService {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "scrollActivity", _descriptor, this);
    _defineProperty(this, "EVENT_THROTTLE", void 0);
    _defineProperty(this, "defaultEvents", ['keydown', 'mousedown', 'scroll', 'touchstart', 'storage']);
    _defineProperty(this, "enabledEvents", A());
    _defineProperty(this, "_eventsListened", A());
    _defineProperty(this, "_eventSubscriberCount", {});
    _defineProperty(this, "_throttledEventHandlers", {});
    _defineProperty(this, "_boundEventHandler", null);
    _defineProperty(this, "localStorageKey", 'ember-user-activity');
  }
  // TODO: migrate to constructor
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init(...arguments);

    // Do not throttle in testing mode
    this.EVENT_THROTTLE = Ember.testing ? 0 : 100;
    this._boundEventHandler = this.handleEvent.bind(this);
    this._setupListeners();
  }
  on(eventName) {
    this.enableEvent(eventName);
    if (this._eventSubscriberCount[eventName]) {
      this._eventSubscriberCount[eventName]++;
    } else {
      this._eventSubscriberCount[eventName] = 1;
    }
    return super.on(...arguments);
  }
  off(eventName) {
    if (this._eventSubscriberCount[eventName]) {
      this._eventSubscriberCount[eventName]--;
    } else {
      delete this._eventSubscriberCount[eventName];
    }
    return super.off(...arguments);
  }
  has(eventName) {
    return this._eventSubscriberCount[eventName] && this._eventSubscriberCount[eventName] > 0;
  }
  handleEvent(event) {
    if (event.type === 'storage' && event.key !== this.localStorageKey) {
      return;
    }
    throttle(this, this._throttledEventHandlers[event.type], event, this.EVENT_THROTTLE);
  }
  _handleScroll() {
    this.handleEvent({
      type: 'scroll'
    });
  }
  _setupListeners() {
    this.defaultEvents.forEach(eventName => {
      this.enableEvent(eventName);
    });
  }
  _listen(eventName) {
    if (eventName === 'scroll') {
      this.scrollActivity.on('scroll', this, this._handleScroll);
    } else if (this._eventsListened.indexOf(eventName) === -1) {
      if (this._isFastBoot) {
        return;
      }
      this._eventsListened.pushObject(eventName);
      window.addEventListener(eventName, this._boundEventHandler, true);
    }
  }
  enableEvent(eventName) {
    if (!this.isEnabled(eventName)) {
      this.enabledEvents.pushObject(eventName);
      this._throttledEventHandlers[eventName] = function fireEnabledEvent(event) {
        if (this.isEnabled(event.type)) {
          this.fireEvent(event);
        }
      };
      this._listen(eventName);
    }
  }
  disableEvent(eventName) {
    this.enabledEvents.removeObject(eventName);
    this._eventsListened.removeObject(eventName);
    this._throttledEventHandlers[eventName] = null;
    if (eventName === 'scroll') {
      this.scrollActivity.off('scroll', this, this._handleScroll);
    } else {
      if (this._isFastBoot) {
        return;
      }
      window.removeEventListener(eventName, this._boundEventHandler, true);
    }
  }
  fireEvent(event) {
    // Only fire events that have subscribers
    if (this.has(event.type)) {
      this.trigger(event.type, event);
    }
    if (this.has('userActive')) {
      this.trigger('userActive', event);
    }
    if (this._eventsListened.includes('storage') && storageAvailable('localStorage')) {
      // We store a date here since we have to update the storage with a new value
      localStorage.setItem(this.localStorageKey, new Date());
    }
  }
  isEnabled(eventName) {
    return this.enabledEvents.includes(eventName);
  }
  willDestroy() {
    while (this._eventsListened.length > 0) {
      this.disableEvent(this._eventsListened[0]);
    }
    this._eventsListened = A();
    this._eventSubscriberCount = {};
    this._throttledEventHandlers = {};
    if (this.localStorageKey && storageAvailable('localStorage')) {
      localStorage.removeItem(this.localStorageKey);
    }
    super.willDestroy(...arguments);
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "scrollActivity", [_dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class));

export { UserActivityService as default };
//# sourceMappingURL=user-activity.js.map
