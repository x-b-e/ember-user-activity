'use strict';

define("test-app/tests/helpers/index", ["exports", "ember-qunit"], function (_exports, _emberQunit) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setupApplicationTest = setupApplicationTest;
  _exports.setupRenderingTest = setupRenderingTest;
  _exports.setupTest = setupTest;
  0; //eaimeta@70e063a35619d71f0,"ember-qunit"eaimeta@70e063a35619d71f
  // This file exists to provide wrappers around ember-qunit's / ember-mocha's
  // test setup functions. This way, you can easily extend the setup that is
  // needed per test type.

  function setupApplicationTest(hooks, options) {
    (0, _emberQunit.setupApplicationTest)(hooks, options);

    // Additional setup for application tests can be done here.
    //
    // For example, if you need an authenticated session for each
    // application test, you could do:
    //
    // hooks.beforeEach(async function () {
    //   await authenticateSession(); // ember-simple-auth
    // });
    //
    // This is also a good place to call test setup functions coming
    // from other addons:
    //
    // setupIntl(hooks); // ember-intl
    // setupMirage(hooks); // ember-cli-mirage
  }
  function setupRenderingTest(hooks, options) {
    (0, _emberQunit.setupRenderingTest)(hooks, options);

    // Additional setup for rendering tests can be done here.
  }
  function setupTest(hooks, options) {
    (0, _emberQunit.setupTest)(hooks, options);

    // Additional setup for unit tests can be done here.
  }
});
define("test-app/tests/test-helper", ["test-app/app", "test-app/config/environment", "qunit", "@ember/test-helpers", "qunit-dom", "ember-qunit", "ember-sinon-qunit"], function (_app, _environment, QUnit, _testHelpers, _qunitDom, _emberQunit, _emberSinonQunit) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"test-app/app",0,"test-app/config/environment",0,"qunit",0,"@ember/test-helpers",0,"qunit-dom",0,"ember-qunit",0,"ember-sinon-qunit"eaimeta@70e063a35619d71f
  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberSinonQunit.default)();
  (0, _qunitDom.setup)(QUnit.assert);
  (0, _emberQunit.start)();
});
define("test-app/tests/unit/services/scroll-activity-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit"eaimeta@70e063a35619d71f
  let wait;
  if (window.requestAnimationFrame) {
    wait = cb => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(cb);
        });
      });
    };
  } else {
    wait = cb => {
      window.setTimeout(function () {
        window.setTimeout(function () {
          window.setTimeout(cb, 16);
        }, 16);
      }, 16);
    };
  }
  (0, _qunit.module)('Unit | Service | scroll activity', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('event triggered for window scroll', function (assert) {
      assert.expect(4);
      let done = assert.async();

      // Create some content to scroll into
      let fixture = document.getElementById('ember-testing');
      for (let i = 0; i < 300; i++) {
        fixture.appendChild(document.createElement('br'));
      }
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      assert.strictEqual(scrollEventCount, 0, 'precond - no scroll happens');
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'no scroll happens for nothing');
        window.pageYOffset = 1;
        wait(() => {
          assert.strictEqual(scrollEventCount, 1, 'scroll fires for a body scroll');
          wait(() => {
            assert.strictEqual(scrollEventCount, 1, 'no scroll happens for nothing');
            done();
          });
        });
      });
    });
    (0, _qunit.test)('subscribe w/ no callback triggers event', function (assert) {
      assert.expect(2);
      let done = assert.async();
      let scrollTop = 1234;
      let scrollLeft = 1234;
      let elem = {
        scrollTop,
        scrollLeft
      };
      let target = {
        elem
      };
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      service.subscribe(target, elem);
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'precond - no scroll happens');
        elem.scrollTop++;
        wait(() => {
          assert.strictEqual(scrollEventCount, 1, 'scroll happened twice when scrollTop changes');
          done();
        });
      });
    });
    (0, _qunit.test)('subscribe w/ callback triggers callback and event', function (assert) {
      assert.expect(8);
      let done = assert.async();
      let scrollTop = 1234;
      let scrollLeft = 1234;
      let elem = {
        scrollTop,
        scrollLeft
      };
      let target = {
        elem
      };
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      let subscribedEventCount = 0;
      let subscribedScrollTop = null;
      let subscribedLastScrollTop = null;
      service.subscribe(target, elem, (scrollTop, lastScrollTop) => {
        subscribedScrollTop = scrollTop;
        subscribedLastScrollTop = lastScrollTop;
        subscribedEventCount++;
      });
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'precond - no scroll event');
        assert.strictEqual(subscribedEventCount, 0, 'precond - no subscription callback');
        wait(() => {
          assert.strictEqual(scrollEventCount, 0, 'no scroll when nothing happens');
          assert.strictEqual(subscribedEventCount, 0, 'no subscription callback when nothing happens');
          elem.scrollTop++;
          wait(() => {
            assert.strictEqual(scrollEventCount, 1, 'scroll happened when scrollTop changes');
            assert.strictEqual(subscribedEventCount, 1, 'subscription callback fired once');
            assert.strictEqual(subscribedLastScrollTop, scrollTop, 'lastScrollTop is previous value');
            assert.strictEqual(subscribedScrollTop, scrollTop + 1, 'new scrollTop is new value');
            done();
          });
        });
      });
    });
    (0, _qunit.test)('unsubscribe', function (assert) {
      assert.expect(4);
      let done = assert.async();
      let scrollTop = 1234;
      let scrollLeft = 1234;
      let elem = {
        scrollTop,
        scrollLeft
      };
      let target = {
        elem
      };
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      let subscribedEventCount = 0;
      service.subscribe(target, elem, () => {
        subscribedEventCount++;
      });
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'precond - no scroll event');
        assert.strictEqual(subscribedEventCount, 0, 'precond - no subscription callback');
        elem.scrollTop++;
        elem.scrollLeft++;
        service.unsubscribe(target);
        wait(() => {
          assert.strictEqual(scrollEventCount, 0, 'no scroll event');
          assert.strictEqual(subscribedEventCount, 0, 'no subscription callback');
          done();
        });
      });
    });
    (0, _qunit.test)('event triggered for horizontal window scroll', function (assert) {
      assert.expect(4);
      let done = assert.async();

      // Create some content to scroll into
      let fixture = document.getElementById('ember-testing');
      for (let i = 0; i < 300; i++) {
        fixture.appendChild(document.createElement('br'));
      }
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      assert.strictEqual(scrollEventCount, 0, 'precond - no scroll happens');
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'no scroll happens for nothing');
        window.pageXOffset = 1;
        wait(() => {
          assert.strictEqual(scrollEventCount, 1, 'scroll fires for a body scroll');
          wait(() => {
            assert.strictEqual(scrollEventCount, 1, 'no scroll happens for nothing');
            done();
          });
        });
      });
    });
    (0, _qunit.test)('subscribe w/ no callback triggers horizontal scroll event', function (assert) {
      assert.expect(2);
      let done = assert.async();
      let scrollTop = 1234;
      let scrollLeft = 1234;
      let elem = {
        scrollTop,
        scrollLeft
      };
      let target = {
        elem
      };
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      service.subscribe(target, elem);
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'precond - no scroll happens');
        elem.scrollLeft++;
        wait(() => {
          assert.strictEqual(scrollEventCount, 1, 'scroll happened twice when scrollLeft changes');
          done();
        });
      });
    });
    (0, _qunit.test)('subscribe w/ callback triggers callback and horizontal scroll event', function (assert) {
      assert.expect(8);
      let done = assert.async();
      let scrollTop = 1234;
      let scrollLeft = 1234;
      let elem = {
        scrollTop,
        scrollLeft
      };
      let target = {
        elem
      };
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      let subscribedEventCount = 0;
      let subscribedScrollLeft = null;
      let subscribedLastScrollLeft = null;
      service.subscribe(target, elem, (scrollLeft, lastScrollLeft) => {
        subscribedScrollLeft = scrollLeft;
        subscribedLastScrollLeft = lastScrollLeft;
        subscribedEventCount++;
      });
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'precond - no scroll event');
        assert.strictEqual(subscribedEventCount, 0, 'precond - no subscription callback');
        wait(() => {
          assert.strictEqual(scrollEventCount, 0, 'no scroll when nothing happens');
          assert.strictEqual(subscribedEventCount, 0, 'no subscription callback when nothing happens');
          elem.scrollLeft++;
          wait(() => {
            assert.strictEqual(scrollEventCount, 1, 'scroll happened when scrollLeft changes');
            assert.strictEqual(subscribedEventCount, 1, 'subscription callback fired once');
            assert.strictEqual(subscribedLastScrollLeft, scrollLeft, 'lastScrollLeft is previous value');
            assert.strictEqual(subscribedScrollLeft, scrollLeft + 1, 'new scrollLeft is new value');
            done();
          });
        });
      });
    });
    (0, _qunit.test)('subscribe w/ callback triggers callback along with a scrollType parameter', function (assert) {
      assert.expect(25);
      let done = assert.async();
      let scrollTop = 1234;
      let scrollLeft = 1234;
      let elem = {
        scrollTop,
        scrollLeft
      };
      let target = {
        elem
      };
      const SCROLL_EVENT_TYPE_VERTICAL = 'vertical';
      const SCROLL_EVENT_TYPE_HORIZONTAL = 'horizontal';
      const SCROLL_EVENT_TYPE_DIAGONAL = 'diagonal';
      let service = this.owner.lookup('service:ember-user-activity@scroll-activity');
      let subscribedEventCount = 0;
      let subscribedScrollTop = null;
      let subscribedLastScrollTop = null;
      let subscribedScrollLeft = null;
      let subscribedLastScrollLeft = null;
      let subscribedScrollType = null;
      service.subscribe(target, elem, (scroll, lastScroll, scrollType, scrollSecondary, lastScrollSecondary) => {
        if (scrollType === SCROLL_EVENT_TYPE_VERTICAL) {
          subscribedScrollTop = scroll;
          subscribedLastScrollTop = lastScroll;
        } else if (scrollType === SCROLL_EVENT_TYPE_HORIZONTAL) {
          subscribedScrollLeft = scroll;
          subscribedLastScrollLeft = lastScroll;
        } else if (scrollType === SCROLL_EVENT_TYPE_DIAGONAL) {
          subscribedScrollTop = scroll;
          subscribedLastScrollTop = lastScroll;
          subscribedScrollLeft = scrollSecondary;
          subscribedLastScrollLeft = lastScrollSecondary;
        } else {
          throw new Error('Invalid scrollType was returned');
        }
        subscribedScrollType = scrollType;
        subscribedEventCount++;
      });
      let scrollEventCount = 0;
      service.on('scroll', () => scrollEventCount++);
      wait(() => {
        assert.strictEqual(scrollEventCount, 0, 'precond - no scroll event');
        assert.strictEqual(subscribedEventCount, 0, 'precond - no subscription callback');
        wait(() => {
          assert.strictEqual(scrollEventCount, 0, 'no scroll when nothing happens');
          assert.strictEqual(subscribedEventCount, 0, 'no subscription callback when nothing happens');
          elem.scrollTop++;
          wait(() => {
            assert.strictEqual(scrollEventCount, 1, 'scroll happened when scrollTop changes');
            assert.strictEqual(subscribedEventCount, 1, 'subscription callback fired once');
            assert.strictEqual(subscribedLastScrollTop, scrollTop, 'lastScrollTop is previous value');
            assert.strictEqual(subscribedScrollTop, scrollTop + 1, 'new scrollTop is new value');
            assert.strictEqual(subscribedLastScrollLeft, null, 'lastScrollLeft is unchanged');
            assert.strictEqual(subscribedScrollLeft, null, 'new scrollLeft is unchanged');
            assert.strictEqual(subscribedScrollType, SCROLL_EVENT_TYPE_VERTICAL, 'scroll type is vertical for vertical scroll event');
            elem.scrollLeft++;
            wait(() => {
              assert.strictEqual(scrollEventCount, 2, 'scroll happened when scrollTop changes');
              assert.strictEqual(subscribedEventCount, 2, 'subscription callback fired once');
              assert.strictEqual(subscribedLastScrollTop, scrollTop, 'lastScrollTop is previous value');
              assert.strictEqual(subscribedScrollTop, scrollTop + 1, 'new scrollTop is unchanged');
              assert.strictEqual(subscribedLastScrollLeft, scrollLeft, 'lastScrollLeft is previous value');
              assert.strictEqual(subscribedScrollLeft, scrollLeft + 1, 'new scrollLeft is new value');
              assert.strictEqual(subscribedScrollType, SCROLL_EVENT_TYPE_HORIZONTAL, 'scroll type is horizontal for horizontal scroll event');
              elem.scrollTop++;
              elem.scrollLeft++;
              wait(() => {
                assert.strictEqual(scrollEventCount, 3, 'scroll happened when scrollTop changes');
                assert.strictEqual(subscribedEventCount, 3, 'subscription callback fired once');
                assert.strictEqual(subscribedLastScrollTop, scrollTop + 1, 'lastScrollTop is previous value');
                assert.strictEqual(subscribedScrollTop, scrollTop + 2, 'new scrollTop is new value');
                assert.strictEqual(subscribedLastScrollLeft, scrollLeft + 1, 'lastScrollLeft is previous value');
                assert.strictEqual(subscribedScrollLeft, scrollLeft + 2, 'new scrollLeft unchanged');
                assert.strictEqual(subscribedScrollType, SCROLL_EVENT_TYPE_DIAGONAL, 'scroll type is diagonal for diagonal scroll event');
                done();
              });
            });
          });
        });
      });
    });
  });
});
define("test-app/tests/unit/services/user-activity-test", ["@ember/array", "@ember/utils", "qunit", "ember-qunit", "sinon"], function (_array, _utils, _qunit, _emberQunit, _sinon) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"@ember/array",0,"@ember/utils",0,"qunit",0,"ember-qunit",0,"sinon"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Service | user activity', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('init', function (assert) {
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        enableEvent: _sinon.default.stub()
      });
      assert.strictEqual((0, _utils.typeOf)(service._boundEventHandler), 'function', 'bound event handler initialized');
      assert.strictEqual((0, _utils.typeOf)(service.enabledEvents), 'array', 'enabledEvents set to empty array');
      assert.strictEqual(service.enableEvent.callCount, service.defaultEvents.length, 'Events enabled by default');
    });
    (0, _qunit.test)('enableEvent', function (assert) {
      let event = 'foo';
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        _listen: _sinon.default.stub(),
        _setupListeners: _sinon.default.stub()
      });
      service.enableEvent(event);
      assert.true(service.enabledEvents.includes(event), 'adds event name to enabled events');
      let stub = service._listen;
      assert.true(stub.calledOnce, 'sets up listener');
      assert.strictEqual(stub.firstCall.args[0], event, 'passes event name to _listen');
    });
    (0, _qunit.test)('enableEvent - already enabled', function (assert) {
      let event = 'foo';
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        enabledEvents: (0, _array.A)([event]),
        _listen: _sinon.default.stub(),
        _setupListeners: _sinon.default.stub()
      });
      service.enableEvent(event);
      assert.false(service._listen.called, 'does nothing if already enabled');
    });
    (0, _qunit.test)('disableEvent', function (assert) {
      let event = 'foo';
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        enabledEvents: (0, _array.A)([event]),
        _setupListeners: _sinon.default.stub()
      });
      assert.true(service.enabledEvents.includes(event), 'enabledEvents preserved on init');
      service.disableEvent(event);
      assert.false(service.enabledEvents.includes(event), 'removed event from enabledEvents');
      assert.false(service._eventsListened.includes(event), 'event should not be listed as listened');
    });
    (0, _qunit.test)('re-enabled events should fire', function (assert) {
      let event = 'foo';
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        enabledEvents: (0, _array.A)(),
        _setupListeners: _sinon.default.stub()
      });
      let addEventListenerStub = _sinon.default.stub(window, 'addEventListener');
      assert.notOk(service.enabledEvents.length, 'enabledEvents preserved on init');
      service.enableEvent(event);
      assert.true(addEventListenerStub.called, 'event was not handled');
      assert.true(service.enabledEvents.includes(event), 'enabledEvents should include added event');
      window.addEventListener.reset();
      service.disableEvent(event);
      assert.false(service.enabledEvents.includes(event), 'removed event from enabledEvents');
      service.enableEvent(event);
      assert.true(window.addEventListener.called, 'event was not handled');
      assert.true(service.enabledEvents.includes(event), 'enabledEvents should include added event');
      window.addEventListener.restore();
    });
    (0, _qunit.test)('fireEvent - no subscribers', function (assert) {
      let event = {
        type: 'foo'
      };
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        trigger: _sinon.default.stub(),
        _setupListeners: _sinon.default.stub()
      });
      service.fireEvent(event);
      assert.false(service.trigger.called, 'no events triggered');
    });
    (0, _qunit.test)('fireEvent - subscribed to event', function (assert) {
      let event = {
        type: 'foo'
      };
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        trigger: _sinon.default.stub(),
        _setupListeners: _sinon.default.stub()
      });
      service.on(event.type, this, function () {});
      service.fireEvent(event);
      let stub = service.trigger;
      assert.true(stub.calledOnce, 'triggers one event');
      let {
        args
      } = stub.firstCall;
      assert.strictEqual(args[0], event.type, 'triggers event by type');
      assert.strictEqual(args[1], event, 'passes event');
    });
    (0, _qunit.test)('fireEvent - subscribed to userActive', function (assert) {
      let event = {
        type: 'foo'
      };
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        trigger: _sinon.default.stub(),
        _setupListeners: _sinon.default.stub()
      });
      service.on('userActive', this, function () {});
      service.fireEvent(event);
      let stub = service.trigger;
      assert.true(stub.calledOnce, 'triggers one event');
      let {
        args
      } = stub.firstCall;
      assert.strictEqual(args[0], 'userActive', 'triggers userActive event');
      assert.strictEqual(args[1], event, 'passes event');
    });
    (0, _qunit.test)('isEnabled', function (assert) {
      let event = 'foo';
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        enabledEvents: (0, _array.A)([event]),
        _setupListeners: _sinon.default.stub()
      });
      assert.true(service.isEnabled(event), 'event is enabled');
      assert.false(service.isEnabled('bar'), 'other events are not enabled');
    });
    (0, _qunit.test)('unsubscribe from events', function (assert) {
      _sinon.default.spy(window, 'addEventListener');
      _sinon.default.spy(window, 'removeEventListener');
      const service = this.owner.factoryFor('service:ember-user-activity@user-activity').create();
      assert.strictEqual(window.addEventListener.callCount, 4, 'Subscribed to 4 window events');
      service.willDestroy();
      assert.strictEqual(window.removeEventListener.callCount, 4, 'Unsubscribed from 4 window events');
      window.addEventListener.restore();
      window.removeEventListener.restore();
    });
    (0, _qunit.test)('localStorage is updated when subscribed to storage event and other registered event is fired', function (assert) {
      let event = {
        type: 'foo'
      };
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        defaultEvents: ['foo', 'storage']
      });
      localStorage.removeItem(service.localStorageKey);
      service.fireEvent(event);
      assert.true(!!localStorage.getItem(service.localStorageKey), '');
    });
    (0, _qunit.test)('localStorage is not updated when not subscribed to storage event and other registered event is fired', function (assert) {
      let event = {
        type: 'foo'
      };
      let service = this.owner.factoryFor('service:ember-user-activity@user-activity').create({
        defaultEvents: ['foo']
      });
      localStorage.removeItem(service.localStorageKey);
      service.fireEvent(event);
      assert.false(!!localStorage.getItem(service.localStorageKey), '');
    });
  });
});
define("test-app/tests/unit/services/user-idle-test", ["qunit", "ember-qunit", "@ember/test-helpers", "sinon"], function (_qunit, _emberQunit, _testHelpers, _sinon) {
  "use strict";

  0; //eaimeta@70e063a35619d71f0,"qunit",0,"ember-qunit",0,"@ember/test-helpers",0,"sinon"eaimeta@70e063a35619d71f
  (0, _qunit.module)('Unit | Service | user idle', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('init starts timer', function (assert) {
      let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
        resetTimeout: _sinon.default.stub()
      });
      assert.true(service.resetTimeout.calledOnce, 'resetTimeout was called');
    });
    (0, _qunit.test)('init sets up event listeners', function (assert) {
      let event = 'foo';
      let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
        activeEvents: [event],
        resetTimeout: _sinon.default.stub()
      });
      service.userActivity.trigger(event);
      let stub = service.resetTimeout;
      assert.true(stub.calledTwice, 'resetTimeout was called');
    });
    (0, _qunit.test)('resetTimeout', function (assert) {
      assert.expect(5);
      let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
        trigger: _sinon.default.stub(),
        isIdle: true,
        IDLE_TIMEOUT: 100
      });
      service.resetTimeout();
      let stub = service.trigger;
      assert.true(stub.calledOnce, 'triggers one event');
      let {
        args
      } = stub.firstCall;
      assert.strictEqual(args[0], 'idleChanged', 'triggers idleChanged event');
      assert.false(args[1], 'passes data');
      assert.false(service.isIdle, 'isIdle is false');
      return (0, _testHelpers.settled)().then(function () {
        assert.true(service.isIdle, 'isIdle is set to true after timeout');
      });
    });
    (0, _qunit.test)('setIdle', function (assert) {
      let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
        trigger: _sinon.default.stub(),
        resetTimeout: _sinon.default.stub()
      });
      service.setIdle();
      let stub = service.trigger;
      assert.true(stub.calledOnce, 'triggers one event');
      let {
        args
      } = stub.firstCall;
      assert.strictEqual(args[0], 'idleChanged', 'triggers idleChanged event');
      assert.true(args[1], 'passes data');
      assert.true(service.isIdle, 'isIdle is true');
    });
  });
});
define('test-app/config/environment', [], function() {
  var prefix = 'test-app';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('test-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
