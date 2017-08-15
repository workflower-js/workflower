(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["workflower"] = factory();
	else
		root["workflower"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _respondentEmitter = __webpack_require__(11);

var _respondentEmitter2 = _interopRequireDefault(_respondentEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjectWatch = function (_Event) {
  _inherits(ObjectWatch, _Event);

  function ObjectWatch() {
    _classCallCheck(this, ObjectWatch);

    var _this = _possibleConstructorReturn(this, (ObjectWatch.__proto__ || Object.getPrototypeOf(ObjectWatch)).call(this));

    if (!ObjectWatch.isSupportedWatch() && ObjectWatch.isSupportedPolyfill()) {
      _this.polyfillWatch();
      _this.polyfillUnwatch();
    }
    return _this;
  }

  /**
   * 模拟 watch 方法
   */


  _createClass(ObjectWatch, [{
    key: 'polyfillWatch',
    value: function polyfillWatch() {
      var _this2 = this;

      Object.defineProperty(this, 'watch', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function value(object, prop, handler) {

          if (typeof object === 'string') {
            handler = prop;
            prop = object;
            object = _this2;
          }

          var oldval = object[prop],
              newval = oldval,
              getter = function getter() {
            return newval;
          },
              setter = function setter(val) {
            var isChanged = newval !== val;

            oldval = newval;
            newval = val;

            if (isChanged) {
              this.emit('propertyChanged', prop, oldval, val);
              handler.call(object, prop, oldval, val);
            }

            return val;
          };

          if (delete object[prop]) {
            // can't watch constants
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

  }, {
    key: 'polyfillUnwatch',
    value: function polyfillUnwatch() {
      Object.defineProperty(this, "unwatch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function value(prop) {
          var val = this[prop];

          delete this[prop]; // remove accessors
          this[prop] = val;
        }
      });
    }

    /**
     * 判断是否原生支持 object.watch
     * @returns {boolean}
     */

  }], [{
    key: 'isSupportedWatch',
    value: function isSupportedWatch() {
      return typeof Object.prototype.watch === 'function';
    }

    /**
     * 判定是否能模拟 Watch
     * @returns {boolean}
     */

  }, {
    key: 'isSupportedPolyfill',
    value: function isSupportedPolyfill() {
      return typeof Object.defineProperty === 'function';
    }
  }]);

  return ObjectWatch;
}(_respondentEmitter2.default);

exports.default = ObjectWatch;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watch = __webpack_require__(0);

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Curve = function (_Watch) {
  _inherits(Curve, _Watch);

  function Curve(start, end) {
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Curve);

    var _this = _possibleConstructorReturn(this, (Curve.__proto__ || Object.getPrototypeOf(Curve)).call(this));

    _this.canvasOffset = offset;
    _this.startX = start.x || start.left;
    _this.startY = start.y || start.top;
    _this.endX = end.x || end.left;
    _this.endY = end.y || end.top;

    var watcher = function watcher() {
      _this.update();
    };

    _this.draw();
    _this.watch('canvasOffset', watcher);
    _this.watch('startX', watcher);
    _this.watch('startY', watcher);
    _this.watch('endX', watcher);
    _this.watch('endY', watcher);
    return _this;
  }

  /** Curve
   *  calculate the path curve
   * @returns {string}
   */


  _createClass(Curve, [{
    key: 'draw',


    /** Draw Path
     *
     * @param p1
     * @param p2
     * @returns {Element}
     */
    value: function draw() {
      var curve = Curve.curve(this.startX, this.startY, this.endX, this.endY);

      this.path = this.path || document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.path.setAttribute('d', curve);

      return this.path;
    }

    /**
     *
     */

  }, {
    key: 'update',
    value: function update() {
      var curve = Curve.curve(this.startX, this.startY, this.endX, this.endY);

      this.path.setAttribute('d', curve);
    }
  }], [{
    key: 'curve',
    value: function curve(startX, startY, endX, endY) {
      var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { left: 0, top: 0 };

      var x1 = startX;
      var y1 = startY;
      var x2 = endX;
      var y2 = endY;
      var d = void 0;

      x1 -= offset.left;
      y1 -= offset.top;
      x2 -= offset.left;
      y2 -= offset.top;

      d = Math.abs(x1 - x2) / 2;
      y1 += 5;
      y2 += 5;

      return " M" + x1 + "," + y1 + // start
      " C" + (x1 + d) + "," + y1 + // control 1
      " " + (x2 - d) + "," + y2 + // control 2
      " " + x2 + "," + y2 + // end
      " " + "l-1 0 l-5 -5 m5 5 l-5 5"; // arrow
    }
  }]);

  return Curve;
}(_watch2.default);

exports.default = Curve;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watch = __webpack_require__(0);

var _watch2 = _interopRequireDefault(_watch);

var _curve = __webpack_require__(1);

var _curve2 = _interopRequireDefault(_curve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cache = {};

var Node = function (_Watch) {
  _inherits(Node, _Watch);

  function Node(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

    _this.data = data;
    _this.id = data.id;
    _this.sources = {};
    _this.targets = {};
    _this.left = 0;
    _this.top = 0;
    _this.$element = _this.format();
    _this.$point = _this.$element.getElementsByClassName('workflower-point')[0];
    _this.$picture = _this.$element.getElementsByClassName('workflower-img')[0];
    _this.watchProps();
    _this.initEvents();

    if (typeof options.setPicture === 'function') {
      options.setPicture().then(function (url) {
        _this.setPicture(url);
      });
    }
    return _this;
  }

  _createClass(Node, [{
    key: 'appendSource',
    value: function appendSource(source) {
      var id = target.id;

      if (source instanceof Node && !this.sources[id]) {
        this.sources[id] = source;
      }
    }
  }, {
    key: 'setPicture',
    value: function setPicture(url) {
      if (url) {
        this.$picture.src = url;
      }
    }
  }, {
    key: 'getPoint',
    value: function getPoint() {
      var offset = { left: 0, top: 0 };
      var width = this.$point.offsetWidth / 2;
      var height = this.$point.offsetHeight / 2;

      offset.width = width;
      offset.height = height;
      offset.left = this.$point.offsetLeft + parseInt(this.left);
      offset.top = this.$point.offsetTop + parseInt(this.top) + height;
      offset.right = offset.left + offset.width;
      offset.bottom = offset.top + offset.height;

      return offset;
    }
  }, {
    key: 'appendTarget',
    value: function appendTarget(target) {
      var id = target.id;

      if (target instanceof Node && !this.targets[id]) {
        this.targets[id] = target;
      }
    }
  }, {
    key: 'initEvents',
    value: function initEvents() {}

    /**
     * 监控属性
     */

  }, {
    key: 'watchProps',
    value: function watchProps() {
      var _this2 = this;

      var style = this.$element.style;
      var handler = function handler(prop, old, val) {
        style[prop] = _this2[prop] + 'px';

        _this2.emit('layoutChange', prop, old, val);
      };

      this.watch('left', handler);
      this.watch('top', handler);
      this.watch('width', handler);
      this.watch('height', handler);
    }

    /**
     * 渲染到指定容器内
     * @param $container
     */

  }, {
    key: 'renderTo',
    value: function renderTo($container) {
      if ($container && typeof $container.appendChild === 'function') {
        // this.$element = this.format()
        $container.appendChild(this.$element);

        this.width = this.$element.offsetWidth;
        this.height = this.$element.offsetHeight;
      }
    }

    /**
     * 更新节点状态
     */

  }, {
    key: 'updateStatus',
    value: function updateStatus(status) {
      var point = this.$element.getElementsByClassName('workflower-point')[0];

      point.className = 'workflower-point status-' + status;
    }

    /**
     *
     */

  }, {
    key: 'format',
    value: function format() {
      var taskList = this.data.taskUserList;
      var taskName = taskList && taskList.length > 0 ? taskList[0].taskName : '';
      var taskStatus = taskList && taskList.length > 0 ? taskList[0].taskStatus : '';

      var template = '\n      <div class="workflower-node type-' + this.data.elementType + '" id="node-' + this.data.id + '" data-id="' + this.data.id + '">\n      \n        <div class="workflower-label">\n          <div class="workflower-picture">\n            <img class="workflower-img" width="80" data-src="" alt="">\n          </div>\n          <h4>' + taskName + '</h4>\n        </div>\n        <div class="workflower-point status-' + taskStatus + '"></div> \n      </div>';

      var wrapper = document.createElement('div');
      wrapper.innerHTML = template;

      try {
        return wrapper.firstElementChild;
      } finally {
        wrapper = template = null;
      }
    }

    /**
     * 从此节点连接到目标节点
     */

  }, {
    key: 'connectTo',
    value: function connectTo(target) {
      var curve = new _curve2.default();
    }
  }], [{
    key: 'getNodeById',
    value: function getNodeById(id) {
      return cache[id];
    }
  }]);

  return Node;
}(_watch2.default);

exports.default = Node;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(12)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js?browsers=last 40 versions!../node_modules/sass-loader/lib/loader.js!./main.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/autoprefixer-loader/index.js?browsers=last 40 versions!../node_modules/sass-loader/lib/loader.js!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(3);

var _watch = __webpack_require__(0);

var _watch2 = _interopRequireDefault(_watch);

var _node = __webpack_require__(2);

var _node2 = _interopRequireDefault(_node);

var _curve = __webpack_require__(1);

var _curve2 = _interopRequireDefault(_curve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Workflow = function (_Watch) {
	_inherits(Workflow, _Watch);

	/**
  * @constructor
  * @param options
  */
	function Workflow() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Workflow);

		var _this = _possibleConstructorReturn(this, (Workflow.__proto__ || Object.getPrototypeOf(Workflow)).call(this));

		_this.options = _extends({
			element: null,
			editable: true,
			gapLength: 40,
			nodes: [],
			padding: '10px',
			getNodeAttributes: function getNodeAttributes(nodeData) {
				return '';
			}

		}, options);

		_this.cache = {};
		_this.nodes = {};
		_this.lines = {};

		if (_this.options.events) {
			_this.on(_this.options.events);
		}

		_this.initBoard();
		_this.delegateEvents();
		_this.initNodes();
		_this.layoutNodes();
		_this.drawCurves();
		_this.watchNodeOffset();
		return _this;
	}

	/**
  * 初始化画板
  */


	_createClass(Workflow, [{
		key: 'initBoard',
		value: function initBoard() {
			var elem = this.options.element;

			if (elem) {
				elem.classList.add('workflower');

				elem.innerHTML = '\n        <div class="workflower">\n          <div class="workflower-board">\n            <svg class="workflower-paths"></svg>\n          </div>\n        </div>';

				this.$element = elem;
				this.$board = elem.getElementsByClassName('workflower-board')[0];
				this.$paths = elem.getElementsByClassName('workflower-paths')[0];
			}
		}

		/**
   * 初始化节点
   */

	}, {
		key: 'initNodes',
		value: function initNodes() {
			var _this2 = this;

			var nodes = this.options.nodes;

			nodes.forEach(function (data) {
				var node = _this2.createNode(data);

				_this2.cache.data = _this2.cache.data || {};
				_this2.cache.data[data.id] = data;

				if (node) {
					_this2.nodes[data.id] = node;
					node.renderTo(_this2.$board);
				}
			});

			nodes.forEach(function (data) {

				var node = _this2.resolveNode(data.id);

				if (node) {
					node.updateStatus(data.taskUserList.length > 0 ? data.taskUserList[0].taskStatus : '');
				}
			});
		}

		/**
   * 点击事件
   */

	}, {
		key: 'delegateEvents',
		value: function delegateEvents() {
			var _this3 = this;

			this.on('resize', function () {
				_this3.updateCanvasSize();
			});

			this.$element.addEventListener('click', function (event) {
				var target = event.target;

				while (target) {
					if (target.classList && target.classList.contains('workflower-node')) {
						var nodeId = target.getAttribute('data-id');
						var node = _this3.nodes[nodeId];

						/**
       * @emits {click} 节点点击事件，传入事件函数的参数：event, clickedComponentType == 'node', componentData = nodeData
       */
						_this3.emit('onNodeClick', event, node);

						/**
       * @emits {click} 全局点击事件，传入事件函数的参数：event, clickedComponentType == 'node', componentData = nodeData
       */
						_this3.emit('click', event, 'node', node);
						_this3.emit('contextmenu', event, node);
						break;
					} else {
						target = target.parentNode;
					}
				}
			});
			//右键
			this.$element.addEventListener('contextmenu', function (event) {
				var target = event.target;

				while (target) {
					if (target.classList && target.classList.contains('workflower-node')) {
						var nodeId = target.getAttribute('data-id');
						var node = _this3.nodes[nodeId];
						_this3.emit('rightClick', event, node, target);
						break;
					} else {
						target = target.parentNode;
					}
				}
			});
		}
	}, {
		key: 'watchNodeOffset',
		value: function watchNodeOffset() {
			var _this4 = this;

			Object.keys(this.nodes).forEach(function (id) {
				var node = _this4.nodes[id];

				node.on('layoutChange', function (prop, old, val) {

					_this4.updateCureveOfNode(node);

					_this4.emit('resize');
				});
			});
		}
	}, {
		key: 'createNode',
		value: function createNode(data) {
			var node = void 0;

			node = this.nodes[data.id] || new _node2.default(data);

			return node;
		}

		/**
   * 把 node id 转成 Node 实例
   * @param {String|Node} id
   * @returns {Node}
   */

	}, {
		key: 'resolveNode',
		value: function resolveNode(id) {
			return typeof id === 'string' ? this.nodes[id] : id;
		}

		/**
   * 把 数据 id 转成 Data 实例
   * @param {String|Node} id
   * @returns {Node}
   */

	}, {
		key: 'resolveData',
		value: function resolveData(id) {
			return typeof id === 'string' ? this.cache.data[id] : id;
		}

		/**
   * 节点排列
   */

	}, {
		key: 'layoutNodes',
		value: function layoutNodes(nodes) {
			var _this5 = this;

			var startY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var startX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			var padding = parseInt(this.options.padding);
			var topCount = startY;
			var top = startY;
			var left = startX + padding;
			var bottom = startY + padding;
			var leftOfNextLevel = void 0;
			var topOfNextLevel = void 0;

			nodes = nodes || this.getRootNodes();
			if (nodes && nodes instanceof Array) {
				var currentLevelTop = top;

				nodes.forEach(function (node) {
					var targets = _this5.getTargetNodes(node);

					topOfNextLevel = top;
					leftOfNextLevel = left + parseInt(node.width);

					if (targets.length > 0) {
						var childArea = _this5.layoutNodes(targets, top, leftOfNextLevel);
						var sup_top = childArea.top + (childArea.bottom - childArea.top) / 2;

						node.top = sup_top;
					} else {
						node.top = top;
					}

					node.left = Math.max(node.left, left);

					topCount = topOfNextLevel;
					top += padding + parseInt(node.height);
				});
			}

			this.emit('resize');

			return {
				top: startY,
				bottom: top,
				left: startX,
				right: left + leftOfNextLevel,
				children: nodes.length
				// childrenGap:
			};
		}

		/**
   * 更新节点的连接线
   * @param {Node} node
   */

	}, {
		key: 'updateCureveOfNode',
		value: function updateCureveOfNode(node) {
			var _this6 = this;

			var sourceNodes = this.getSourceNodes(node);
			var targetNodes = this.getTargetNodes(node);
			var point = node.getPoint();

			// 更新入口的连接线
			sourceNodes.forEach(function (source) {
				var curveId = source.id + '->' + node.id;
				var curve = _this6.lines[curveId];

				if (curve) {
					curve.endX = point.left;
					curve.endY = point.top;
				}
			});

			// 更新出口的连接线
			targetNodes.forEach(function (target) {
				var curveId = node.id + '->' + target.id;
				var curve = _this6.lines[curveId];

				if (curve) {
					curve.startX = point.left;
					curve.startY = point.top;
				}
			});
		}

		/**
   * 连线
   */

	}, {
		key: 'drawCurves',
		value: function drawCurves(nodes) {
			var _this7 = this;

			nodes = nodes || this.getRootNodes();

			if (nodes && nodes instanceof Array) {
				nodes.forEach(function (node) {
					var sourceOffset = node.getPoint();
					var targets = _this7.getTargetNodes(node);

					sourceOffset.left += sourceOffset.width / 2;

					targets.forEach(function (target) {
						var targetOffset = target.getPoint();
						targetOffset.left -= 4;
						var curve = new _curve2.default(sourceOffset, targetOffset);
						var path = curve.draw();
						var curveId = node.id + '->' + target.id;

						curve.id = curveId;
						_this7.lines[curveId] = curve;
						_this7.$paths.appendChild(path);
					});

					_this7.drawCurves(targets);
				});
			}
		}

		/**
   * 获取根节点
   */

	}, {
		key: 'getRootNodes',
		value: function getRootNodes() {
			var _this8 = this;

			var cache = this.cache[Workflow.ROOTS];

			if (cache) {
				return cache;
			} else {
				var roots = [];

				Object.keys(this.nodes).forEach(function (id) {
					var node = _this8.nodes[id];

					if (parseInt(node.data.elementType) === 0) {
						roots.push(node);
					}
				});

				return this.cache[Workflow.ROOTS] = roots;
			}
		}

		/**
   * 获取来源节点
   * @param {String|Node} id
   * @returns {Array<Node>}
   */

	}, {
		key: 'getSourceNodes',
		value: function getSourceNodes(id) {
			var _this9 = this;

			var node = this.resolveNode(id);
			var list = node.data.incoming || [];
			var result = [];

			list.forEach(function (source) {
				var node = _this9.nodes[source.sourceRef];

				if (node) {
					result.push(node);
				}
			});

			return result;
		}

		/**
   * 获取来源数据
   * @param {String} id
   * @returns {Array}
   */

	}, {
		key: 'getSourceData',
		value: function getSourceData(id) {
			var _this10 = this;

			var data = this.resolveData(id);
			var list = data.incoming || [];
			var result = [];

			list.forEach(function (source) {
				var data = _this10.cache.data[source.sourceRef];

				if (data) {
					result.push(data);
				}
			});

			return result;
		}

		/**
   * 获取目标节点
   * @param {String|Node} id
   * @returns {Array<Node>}
   */

	}, {
		key: 'getTargetNodes',
		value: function getTargetNodes(id) {
			var _this11 = this;

			var node = this.resolveNode(id);
			var list = node.data.outgoing || [];
			var result = [];

			list.forEach(function (target) {
				var node = _this11.nodes[target.targetRef];

				if (node) {
					result.push(node);
				}
			});

			return result;
		}

		/**
   * 获取目标数据
   * @param {String} id
   * @returns {Array}
   */

	}, {
		key: 'getTargetData',
		value: function getTargetData(id) {
			var _this12 = this;

			var data = this.resolveData(id);
			var list = data.outgoing || [];
			var result = [];

			list.forEach(function (target) {
				var data = _this12.cache.data[target.targetRef];

				if (data) {
					result.push(data);
				}
			});

			return result;
		}

		/**
   * 更新画板尺寸大小
   */

	}, {
		key: 'updateCanvasSize',
		value: function updateCanvasSize() {
			var _this13 = this;

			var x = 0;
			var y = 0;

			Object.keys(this.nodes).forEach(function (id) {
				var node = _this13.nodes[id];
				var point = node.getPoint();

				x = Math.max(x, point.right);
				y = Math.max(y, point.bottom);
			});

			this.$board.style.width = x + 'px';
			this.$board.style.height = y + 'px';
		}

		/**
   * 新增节点
   * @param nodeOptions
   */

	}, {
		key: 'appendNode',
		value: function appendNode(nodeOptions) {
			var node = nodeOptions instanceof _node2.default ? nodeOptions : this.createNode(nodeOptions);
			console.log(node);

			//this.cache.data[node.id] = nodeOptions
			if (!this.nodes[node.id]) {
				this.nodes[node.id] = node;
				this.$board.appendChild(node.$element);
			}
		}

		//右键菜单

	}, {
		key: 'menu',
		value: function menu(event, menu) {
			event.preventDefault();
			var x = event.clientX + 'px';
			var y = event.clientY + 'px';
			var menu = document.querySelector('#menu');
			menu.style.left = x;
			menu.style.top = y;
			menu.style.width = 130 + 'px';
			menu.style.display = 'block';
		}

		//添加具体元素

	}, {
		key: 'addNode',
		value: function addNode(node, jsonData, clickCount) {

			var i = 0;
			var currentId = node.$element.id.slice(5);
			var nextNodeId = node.$element.nextElementSibling.id.slice(5);

			jsonData.forEach(function (value, index) {

				if (value.id == currentId) {
					i = index;
					nextNodeId = value.outgoing[0].targetRef;
					value.outgoing[0].targetRef = "editable" + clickCount;

					jsonData.forEach(function (value, index) {
						if (value.id == nextNodeId) {
							value.incoming[0].sourceRef = "editable" + clickCount;
						}
					});
				}
			});

			var data = {

				"taskUserList": [{
					"taskId": "",
					"formKey": "",
					"businessKey": "",
					"assignee": "",
					"taskKey": "editable" + clickCount,
					"endTime": null,
					"taskName": "editable" + clickCount,
					"variables": null,
					"startTime": null,
					"activitiId": "",
					"businessTitle": "",
					"taskStatus": "2",
					"processInstanceId": "",
					"companyId": "",
					"comment": ""
				}],
				"id": "editable" + clickCount,
				"incoming": [{
					"id": "flow" + (clickCount + 7),
					"targetRef": "editable" + clickCount,
					"sourceRef": currentId
				}],
				"processInstanceId": "",
				"businessKey": "",
				"outgoing": [{
					"id": "flow" + (clickCount + 8),
					"targetRef": nextNodeId,
					"sourceRef": "editable" + clickCount
				}],
				"elementType": "1",
				"procDefId": ""

			};

			this.appendNode(data);

			jsonData.splice(i + 1, 0, data);
			console.log(jsonData);
			this.refresh();
		}
		//删除节点

	}, {
		key: 'deleteNode',
		value: function deleteNode(node, jsonData, clickCount) {
			var _this14 = this;

			var i = 0;
			var currentId = node.$element.id.slice(5);

			var nextNodeId = void 0;
			var prevNodeId = void 0;
			var currentNode = node.$element;
			var nextNode = node.$element.nextElementSibling;
			var prevNode = node.$element.previousElementSiblingSibling;

			jsonData.forEach(function (value, index) {

				if (value.id == currentId) {

					i = index;
					//前节点ID
					prevNodeId = value.incoming[0].sourceRef;
					//后节点ID
					nextNodeId = value.outgoing[0].targetRef;
					if (nextNodeId.indexOf("0") == -1) {
						console.log("删除下级节点");
						_this14.deleteUnderlingNode(jsonData, prevNodeId, currentId, nextNodeId);
					} else {
						console.log("删除同级分支");

						jsonData.forEach(function (value, index) {
							//对后节点进行修改
							if (value.id == nextNodeId) {
								value.incoming.forEach(function (value6, index6) {
									if (value6.sourceRef == currentId) {
										value.incoming.splice(index6, 1);
									}
									if (value6.sourceRef == prevNodeId) {
										value.incoming.splice(index6, 1);
									}
								});

								if (value.incoming.length == 0) {
									value.incoming.push({ id: "flow" + (clickCount + 9), sourceRef: prevNodeId, targetRef: nextNodeId });
									value.incoming[0].sourceRef == prevNodeId;
								}
							}
							//对前节点进行修改
							if (value.id == prevNodeId) {

								value.outgoing.forEach(function (value1, index1) {
									//删除同级分支
									if (value1.targetRef == currentId) {

										value.outgoing.splice(index1, 1);

										//当同级分支只剩下一个时,自动转换为下级节点
										if (value.outgoing.length == 2) {

											//当节点仅为一个时,就将节点集合删除
											if (nextNodeId.indexOf("0") != -1) {}
										} else if (value.outgoing.length == 1 && value.incoming.length == 0) {

											value.outgoing.push({ id: "flow" + (clickCount + 10), sourceRef: prevNodeId, targetRef: nextNodeId });
										} else if (value.outgoing.length == 0) {
											value.outgoing.push({ id: "flow" + (clickCount + 11), sourceRef: prevNodeId, targetRef: nextNodeId });
										}
									}
								});
							}
						});
					}
				}
			});

			this.nodes[nextNodeId].left = parseInt(currentNode.style.left);
			this.nodes[nextNodeId].top = parseInt(currentNode.style.top);
			jsonData.splice(i, 1);
			this.refresh();
		}

		//删除下级节点

	}, {
		key: 'deleteUnderlingNode',
		value: function deleteUnderlingNode(jsonData, prevNodeId, currentId, nextNodeId) {
			jsonData.forEach(function (value, index) {
				if (value.id == nextNodeId) {
					value.incoming[0].sourceRef = prevNodeId;
				}

				if (value.id == prevNodeId) {
					value.outgoing.forEach(function (value, index) {

						if (value.targetRef == currentId) {

							value.targetRef = nextNodeId;
						}
					});
				}
			});
		}
		//添加分支

	}, {
		key: 'addBranch',
		value: function addBranch(node, jsonData, clickCount) {
			var _this15 = this;

			var i = 0;
			var currentId = node.$element.id.slice(5);

			var nextNodeId = void 0;
			var prevNodeId = void 0;
			var data = {}; //数据模板
			var nodeGroup = {}; //节点集合

			var nodesArr = [];

			jsonData.forEach(function (value, index) {

				if (value.id == currentId) {

					i = index;
					//前节点ID
					prevNodeId = value.incoming[0].sourceRef;
					//后节点ID
					nextNodeId = value.outgoing[0].targetRef;

					data = {

						"taskUserList": [{
							"taskId": "",
							"formKey": "",
							"businessKey": "",
							"assignee": "",
							"taskKey": "editable" + clickCount,
							"endTime": null,
							"taskName": "editable" + clickCount,
							"variables": null,
							"startTime": null,
							"activitiId": "",
							"businessTitle": "",
							"taskStatus": "2",
							"processInstanceId": "",
							"companyId": "",
							"comment": ""
						}],
						"id": "editable" + clickCount,
						"incoming": [{
							"id": "flow9",
							"targetRef": "editable" + clickCount,
							"sourceRef": prevNodeId
						}],
						"processInstanceId": "",
						"businessKey": "",
						"outgoing": [{
							"id": "flow10",
							"targetRef": "editable0" + clickCount,
							"sourceRef": "editable" + clickCount
						}],
						"elementType": "1",
						"procDefId": "",
						"approver": ""

					};
					if (nextNodeId.indexOf("0") == -1) {
						value.outgoing[0].targetRef = "editable0" + clickCount;
					} else {
						jsonData.forEach(function (v) {
							if (v.id == nextNodeId) {

								value.outgoing[0].targetRef = nextNodeId;
								data.outgoing[0].targetRef = nextNodeId;
							}
						});
					}

					//遍历this.options.nodes
					jsonData.forEach(function (value, index) {

						//设置后节点的incoming
						if (value.id == nextNodeId) {

							console.log(value);
							console.log();
							var incomingData = { id: "flow" + clickCount, sourceRef: "editable" + clickCount, targetRef: "editable0" + clickCount };

							//深拷贝对象
							nodeGroup = _this15.deepCopy(data);

							nodeGroup.incoming = value.incoming;
							nodeGroup.incoming.push(incomingData);

							nodeGroup.taskUserList[0]["taskName"] = "节点集合0" + clickCount;
							nodeGroup.id = nodeGroup.taskUserList[0]["taskKey"] = "editable0" + clickCount;
							nodeGroup.elementType = 4;

							nodeGroup.incoming.forEach(function (value) {

								value.targetRef = "editable0" + clickCount;
							});

							nodeGroup.outgoing = [{ id: "flow10", sourceRef: "editable0" + clickCount, targetRef: nextNodeId }];

							if (nextNodeId.indexOf("0") == -1) {
								value.incoming = [{ id: "flow" + clickCount, sourceRef: "editable0" + clickCount, targetRef: nextNodeId }];
							}
						}
						//设置前节点的outgoing
						if (value.id == prevNodeId) {

							var outgoingData = { id: "flow" + clickCount, sourceRef: prevNodeId, targetRef: "editable" + clickCount };
							value.outgoing.push(outgoingData);
						}
					});
				}
			});

			jsonData.splice(i + 1, 0, data);
			//如果后节点是网关不必再添加网关
			if (nextNodeId.indexOf("0") == -1) {
				jsonData.splice(i + 1, 0, nodeGroup);
			}
			console.log(nodeGroup);
			console.log(jsonData);
			this.refresh();
		}

		//刷新初始化

	}, {
		key: 'refresh',
		value: function refresh() {
			this.initBoard();
			this.initNodes();
			this.layoutNodes();
			this.drawCurves();
			this.watchNodeOffset();
		}

		//修改属性

	}, {
		key: 'modifyAttr',
		value: function modifyAttr(node, jsonData) {
			var currentId = node.$element.id.slice(5);

			var textList = document.querySelector('#textlist');

			textList.style.display = 'block';

			document.getElementById("confirm1").onclick = function () {
				var inputText = document.getElementById("name").value;
				jsonData.forEach(function (value, index) {
					if (value.id == currentId) {
						value.taskUserList.forEach(function (value, index) {

							if (confirm("是否要更改审批人")) {
								value.assigneeName = inputText;
							}
							inputText = "";
						});
						inputText = "";
					}
				});

				textList.style.display = 'none';
			};
		}

		//深拷贝

	}, {
		key: 'deepCopy',
		value: function deepCopy(source) {
			var result;
			source instanceof Array ? result = [] : result = {};

			for (var key in source) {
				result[key] = _typeof(source[key]) === 'object' ? this.deepCopy(source[key]) : source[key];
			}
			return result;
		}
	}]);

	return Workflow;
}(_watch2.default);

Workflow.ROOTS = 'ROOTS';


module.exports = exports = Workflow;

exports.default = Workflow;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(5)
var ieee754 = __webpack_require__(10)
var isArray = __webpack_require__(7)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(undefined);
// imports


// module
exports.push([module.i, "/*!\n * Workflower\n * A simple workflow editor\n * https://github.com/workflower-js/workflower\n */.workflower{position:relative;width:100%;height:100%;overflow:auto;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.workflower *,.workflower :after,.workflower :before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.workflower .workflower-board{width:2000px;height:2000px;position:absolute;top:0;left:0;-o-background-size:10px;background-size:10px}.workflower svg.workflower-paths{width:100%;height:100%;position:absolute;top:0;left:0}.workflower svg.workflower-paths path{stroke-dasharray:0;fill:transparent;stroke:#ccc;stroke-width:2}.workflower .workflower-node{-webkit-border-radius:5px;border-radius:5px;width:100px;position:absolute;-webkit-transition:.3s;-o-transition:.3s;-moz-transition:.3s;transition:.3s;overflow:hidden}.workflower .workflower-node:active,.workflower .workflower-node:focus,.workflower .workflower-node:hover{background-color:rgba(0,0,0,.05)}.workflower .workflower-node>h3{background-color:#45536e;color:#fff;font-size:14px;text-align:center;-webkit-border-radius:5px 5px 0 0;border-radius:5px 5px 0 0;margin:0;padding:5px 0;cursor:move}.workflower .workflower-node>h3 .remove,.workflower .workflower-node>h3 .setting{position:absolute;top:5px;right:4px;background-color:#323c50;padding:0 5px 2px;-webkit-border-radius:4px;border-radius:4px;color:#3f4c65;font-family:Tahoma,serif;font-weight:400;cursor:pointer;-webkit-transition:background-color .3s;-o-transition:background-color .3s;-moz-transition:background-color .3s;transition:background-color .3s}.workflower .workflower-node>h3 .remove:after,.workflower .workflower-node>h3 .setting:after{content:\"x\";display:block}.workflower .workflower-node>h3 .remove:hover,.workflower .workflower-node>h3 .setting:hover{background-color:#a30f0f}.workflower .workflower-node>h3 .setting{width:11px;height:11px;right:auto;left:3px;padding:4px;fill:#697896}.workflower .workflower-node>h3 .setting:after{display:none}.workflower .workflower-node>h3 .setting:hover{background-color:#8396bb;fill:#2e3542}.workflower .workflower-node:after{content:\" \";height:1px;display:block;clear:both}.workflower .workflower-node.type-3 .workflower-label{position:relative;left:200%}.workflower .workflower-node.type-0 h4:empty:before{content:\"\\5F00\\59CB\";opacity:.5}.workflower .workflower-node.type-2 h4:empty:before,.workflower .workflower-node.type-4 h4:empty:before{content:\"\\7ED3\\675F\";opacity:.5}.workflower .workflower-inputs{margin-left:-5px;float:left}.workflower .workflower-inputs .workflower-point{margin:2px 4px 0 0;float:left}.workflower .workflower-outputs{margin-right:-5px;float:right;text-align:right}.workflower .workflower-outputs .workflower-point{margin:2px 0 0 4px;cursor:pointer;float:right}.workflower .workflower-label{margin:20px 0 6px;font-size:12px;font-family:sans-serif;color:#697690;cursor:default}.workflower .workflower-label .workflower-picture{display:none;width:50px;height:50px;-webkit-border-radius:50%;border-radius:50%;background-color:rgba(0,0,0,.06);background-image:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiBoZWlnaHQ9IjUwcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MCA1MCIgd2lkdGg9IjUwcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIGZpbGw9Im5vbmUiIHI9IjI0IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCBmaWxsPSJub25lIiBoZWlnaHQ9IjUwIiB3aWR0aD0iNTAiLz48cGF0aCBkPSJNMjkuOTMzLDM1LjUyOGMtMC4xNDYtMS42MTItMC4wOS0yLjczNy0wLjA5LTQuMjFjMC43My0wLjM4MywyLjAzOC0yLjgyNSwyLjI1OS00Ljg4OGMwLjU3NC0wLjA0NywxLjQ3OS0wLjYwNywxLjc0NC0yLjgxOCAgYzAuMTQzLTEuMTg3LTAuNDI1LTEuODU1LTAuNzcxLTIuMDY1YzAuOTM0LTIuODA5LDIuODc0LTExLjQ5OS0zLjU4OC0xMi4zOTdjLTAuNjY1LTEuMTY4LTIuMzY4LTEuNzU5LTQuNTgxLTEuNzU5ICBjLTguODU0LDAuMTYzLTkuOTIyLDYuNjg2LTcuOTgxLDE0LjE1NmMtMC4zNDUsMC4yMS0wLjkxMywwLjg3OC0wLjc3MSwyLjA2NWMwLjI2NiwyLjIxMSwxLjE3LDIuNzcxLDEuNzQ0LDIuODE4ICBjMC4yMiwyLjA2MiwxLjU4LDQuNTA1LDIuMzEyLDQuODg4YzAsMS40NzMsMC4wNTUsMi41OTgtMC4wOTEsNC4yMWMtMS4yNjEsMy4zOS03LjczNywzLjY1NS0xMS40NzMsNi45MjQgIGMzLjkwNiwzLjkzMywxMC4yMzYsNi43NDYsMTYuOTE2LDYuNzQ2czE0LjUzMi01LjI3NCwxNS44MzktNi43MTNDMzcuNjg4LDM5LjE4NiwzMS4xOTcsMzguOTMsMjkuOTMzLDM1LjUyOHoiLz48L3N2Zz4=\");-o-background-size:cover;background-size:cover;text-align:center;margin:auto;overflow:hidden;opacity:.1}.workflower .workflower-label .workflower-picture img{max-width:100%}.workflower .workflower-label h4{text-align:center;margin:5px}.workflower .workflower-label h4:empty:before{content:\"\\672A\\547D\\540D\\8282\\70B9\";opacity:.5}.workflower .type-0 .workflower-point,.workflower [data-id^=startevent] .workflower-point{background-color:green}.workflower .type-0 .workflower-point:after,.workflower [data-id^=startevent] .workflower-point:after{content:\"\";display:block;width:35%;height:50%;position:absolute;left:50%;top:50%;margin:-8px 0 0 -4px;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg);border:2px solid transparent;border-right-color:#fff;border-bottom-color:#fff}.workflower .workflower-point{background-color:#ccc;width:24px;height:24px;-webkit-border-radius:50%;border-radius:50%;margin:auto;position:relative}.workflower .workflower-point.selected{background-color:#ffe63f}.workflower .workflower-point.status-0{background-color:green}.workflower .workflower-point.status-0:after{content:\"\";display:block;width:35%;height:50%;position:absolute;left:50%;top:50%;margin:-8px 0 0 -4px;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg);border:2px solid transparent;border-right-color:#fff;border-bottom-color:#fff}.workflower .workflower-point.status-1{background-color:#2f86d5}.workflower .workflower-point.status-2{background-color:#ccc}.workflower .workflower-point.status-3{background-color:red}.workflower .workflower-point.status-3:after{content:\"X\";display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;position:absolute;left:0;top:0;right:0;bottom:0;text-align:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-align-content:center;-ms-flex-line-pack:center;align-content:center;color:#fff;font-size:16px}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var storeId = Symbol('event_store_id');

var Events = function () {
	function Events(type) {
		_classCallCheck(this, Events);

		this[storeId] = {};
	}

	_createClass(Events, [{
		key: 'on',
		value: function on(type, listener) {

			if (typeof type !== 'string') {
				for (var k in type) {
					this.on(k, type[k]);
				}
			} else {
				var namespace = type.split('.');
				this[storeId][type] = this[storeId][type] || [];
				listener.namespace = type;

				this[storeId][namespace[0]].push(listener);
			}
		}
	}, {
		key: 'once',
		value: function once(type, listener) {
			if (typeof type !== 'string') {
				for (var k in type) {
					this.once(k, type[k]);
				}
			} else {
				listener.once = true;
				this.on(type, listener);
			}
		}
	}, {
		key: 'off',
		value: function off(type, listener) {
			var _this = this;

			Object.keys(this[storeId]).forEach(function (eventType) {

				// 不含 namespace
				if (type === eventType && !listener) {
					delete _this[storeId][eventType];
					return;
				} else {
					var listeners = _this[storeId][eventType];

					listeners.forEach(function (fn, i) {
						var isMatch = fn.namespace.indexOf(type) !== -1;

						if (isMatch && (!listener || fn === listener)) {
							listeners[i] = null;
						}
					});

					_this[storeId][eventType] = listeners.filter(function (fn) {
						return typeof fn === 'function';
					});
				}
			});
		}
	}, {
		key: 'emit',
		value: function emit(type) {
			var _this2 = this;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			var result = void 0;

			Object.keys(this[storeId]).forEach(function (eventType) {
				if (eventType.indexOf(type) !== -1) {
					var listeners = _this2[storeId][eventType];

					listeners.forEach(function (fn, i) {
						if (typeof fn === 'function') {
							var res = fn.apply(_this2, args);

							result = result === false ? false : res;
							if (fn && fn.once) {
								_this2.off(type, fn);
							}
						}
					});
				}
			});

			return result;
		}
	}]);

	return Events;
}();

exports.default = Events;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
});