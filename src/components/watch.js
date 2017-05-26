import Event from 'respondent-emitter'

export default class ObjectWatch extends Event {

  constructor () {
    super()

    if (!ObjectWatch.isSupportedWatch() && ObjectWatch.isSupportedPolyfill()) {
      this.polyfillWatch()
      this.polyfillUnwatch()
    }
  }

  /**
   * 模拟 watch 方法
   */
  polyfillWatch() {

    Object.defineProperty(this, 'watch', {
      enumerable: false,
      configurable: true,
      writable: false,
      value: (object, prop, handler) => {

        if (typeof object === 'string') {
          handler = prop
          prop = object
          object = this
        }

        let oldval = object[prop],
            newval = oldval,
            getter = function () {
              return newval;
            },
            setter = function (val) {
              let isChanged = (newval !== val)

              oldval = newval
              newval = val

              if (isChanged) {
                this.emit('propertyChanged', prop, oldval, val)
                handler.call(object, prop, oldval, val)
              }

              return val;
            };

        if (delete object[prop]) { // can't watch constants
          Object.defineProperty(object, prop, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
          });
        }
      }
    });
  }

  /**
   * 模拟 unwatch 方法
   */
  polyfillUnwatch() {
    Object.defineProperty(this, "unwatch", {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function (prop) {
        let val = this[prop];

        delete this[prop]; // remove accessors
        this[prop] = val;
      }
    });
  }

  /**
   * 判断是否原生支持 object.watch
   * @returns {boolean}
   */
  static isSupportedWatch() {
    return (typeof Object.prototype.watch === 'function')
  }

  /**
   * 判定是否能模拟 Watch
   * @returns {boolean}
   */
  static isSupportedPolyfill() {
    return (typeof Object.defineProperty === 'function')
  }
}
