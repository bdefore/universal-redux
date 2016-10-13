'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _class, _temp, _class2, _temp2; // This lives here until latest async-props package is published,
// so as not to require downstream projects have a Babel dependency
//
// See https://github.com/bdefore/universal-redux/issues/47
// Also https://github.com/bdefore/async-props/tree/babel6-support

/* eslint-disable */

/*global __ASYNC_PROPS__*/

exports.loadPropsOnServer = loadPropsOnServer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RouterContext = require('react-router/lib/RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes;
var array = _React$PropTypes.array;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

function last(arr) {
  return arr[arr.length - 1];
}

function eachComponents(components, iterator) {
  for (var i = 0, l = components.length; i < l; i++) {
    if ((0, _typeof3.default)(components[i]) === 'object') {
      for (var key in components[i]) {
        iterator(components[i][key], i, key);
      }
    } else {
      iterator(components[i], i);
    }
  }
}

function filterAndFlattenComponents(components) {
  var flattened = [];
  eachComponents(components, function (Component) {
    if (Component && Component.loadProps) flattened.push(Component);
  });
  return flattened;
}

function _loadAsyncProps(components, params, cb) {
  // flatten the multi-component routes
  var componentsArray = [];
  var propsArray = [];
  var needToLoadCounter = components.length;

  var maybeFinish = function maybeFinish() {
    if (needToLoadCounter === 0) cb(null, { propsArray: propsArray, componentsArray: componentsArray });
  };

  // If there is no components we should resolve directly
  if (needToLoadCounter === 0) {
    return maybeFinish();
  }

  components.forEach(function (Component, index) {
    Component.loadProps(params, function (error, props) {
      needToLoadCounter--;
      propsArray[index] = props;
      componentsArray[index] = Component;
      maybeFinish();
    });
  });
}

function lookupPropsForComponent(Component, propsAndComponents) {
  var componentsArray = propsAndComponents.componentsArray;
  var propsArray = propsAndComponents.propsArray;

  var index = componentsArray.indexOf(Component);
  return propsArray[index];
}

function mergePropsAndComponents(current, changes) {
  for (var i = 0, l = changes.propsArray.length; i < l; i++) {
    var Component = changes.componentsArray[i];
    var position = current.componentsArray.indexOf(Component);
    var isNew = position === -1;

    if (isNew) {
      current.propsArray.push(changes.propsArray[i]);
      current.componentsArray.push(changes.componentsArray[i]);
    } else {
      current.propsArray[position] = changes.propsArray[i];
    }
  }
  return current;
}

function arrayDiff(previous, next) {
  var diff = [];

  for (var i = 0, l = next.length; i < l; i++) {
    if (previous.indexOf(next[i]) === -1) diff.push(next[i]);
  }return diff;
}

function shallowEqual(a, b) {
  var key;
  var ka = 0;
  var kb = 0;

  for (key in a) {
    if (a.hasOwnProperty(key) && a[key] !== b[key]) return false;
    ka++;
  }

  for (key in b) {
    if (b.hasOwnProperty(key)) kb++;
  }return ka === kb;
}

function createElement(Component, props) {
  if (Component.loadProps) return _react2.default.createElement(AsyncPropsContainer, { Component: Component, routerProps: props });else return _react2.default.createElement(Component, props);
}

function loadPropsOnServer(_ref, cb) {
  var components = _ref.components;
  var params = _ref.params;

  _loadAsyncProps(filterAndFlattenComponents(components), params, function (err, propsAndComponents) {
    if (err) {
      cb(err);
    } else {
      var json = (0, _stringify2.default)(propsAndComponents.propsArray, null, 2);
      var scriptString = '<script>__ASYNC_PROPS__ = ' + json + '</script>';
      cb(null, propsAndComponents, scriptString);
    }
  });
}

function hydrate(props) {
  if (typeof __ASYNC_PROPS__ !== 'undefined') return {
    propsArray: __ASYNC_PROPS__,
    componentsArray: filterAndFlattenComponents(props.components)
  };else return null;
}

var AsyncPropsContainer = (_temp = _class = function (_React$Component) {
  (0, _inherits3.default)(AsyncPropsContainer, _React$Component);

  function AsyncPropsContainer() {
    (0, _classCallCheck3.default)(this, AsyncPropsContainer);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AsyncPropsContainer).apply(this, arguments));
  }

  (0, _createClass3.default)(AsyncPropsContainer, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var paramsChanged = !shallowEqual(nextProps.routerProps.routeParams, this.props.routerProps.routeParams);
      if (paramsChanged) {
        this.context.asyncProps.reloadComponent(nextProps.Component);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var Component = _props.Component;
      var routerProps = _props.routerProps;
      var props = (0, _objectWithoutProperties3.default)(_props, ['Component', 'routerProps']);
      var _context$asyncProps = this.context.asyncProps;
      var propsAndComponents = _context$asyncProps.propsAndComponents;
      var loading = _context$asyncProps.loading;
      var reloadComponent = _context$asyncProps.reloadComponent;

      var asyncProps = lookupPropsForComponent(Component, propsAndComponents);
      var reload = function reload() {
        return reloadComponent(Component);
      };
      return _react2.default.createElement(Component, (0, _extends3.default)({}, props, routerProps, asyncProps, {
        reloadAsyncProps: reload,
        loading: loading
      }));
    }
  }]);
  return AsyncPropsContainer;
}(_react2.default.Component), _class.propTypes = {
  Component: func.isRequired,
  routerProps: object.isRequired
}, _class.contextTypes = {
  asyncProps: object.isRequired
}, _temp);
var AsyncProps = (_temp2 = _class2 = function (_React$Component2) {
  (0, _inherits3.default)(AsyncProps, _React$Component2);

  function AsyncProps(props, context) {
    (0, _classCallCheck3.default)(this, AsyncProps);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AsyncProps).call(this, props, context));

    var _this2$props = _this2.props;
    var propsArray = _this2$props.propsArray;
    var componentsArray = _this2$props.componentsArray;

    var isServerRender = propsArray && componentsArray;
    _this2.state = {
      loading: false,
      prevProps: null,
      propsAndComponents: isServerRender ? { propsArray: propsArray, componentsArray: componentsArray } : hydrate(props)
    };
    return _this2;
  }

  (0, _createClass3.default)(AsyncProps, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _this3 = this;

      var _state = this.state;
      var loading = _state.loading;
      var propsAndComponents = _state.propsAndComponents;

      return {
        asyncProps: {
          loading: loading,
          propsAndComponents: propsAndComponents,
          reloadComponent: function reloadComponent(Component) {
            _this3.reloadComponent(Component);
          }
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props2 = this.props;
      var components = _props2.components;
      var params = _props2.params;
      var location = _props2.location;

      this.loadAsyncProps(components, params, location);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var routeChanged = nextProps.location !== this.props.location;
      if (!routeChanged) return;

      var oldComponents = filterAndFlattenComponents(this.props.components);
      var newComponents = filterAndFlattenComponents(nextProps.components);
      var components = arrayDiff(oldComponents, newComponents);

      if (components.length === 0) {
        var sameComponents = shallowEqual(oldComponents, newComponents);
        if (sameComponents) {
          var paramsChanged = !shallowEqual(nextProps.params, this.props.params);
          if (paramsChanged) components = [last(newComponents)];
        }
      }

      if (components.length > 0) this.loadAsyncProps(components, nextProps.params, nextProps.location);
    }
  }, {
    key: 'handleError',
    value: function handleError(cb) {
      var _this4 = this;

      return function (err) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (err && _this4.props.onError) _this4.props.onError(err);else cb.apply(undefined, [null].concat(args));
      };
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;
    }
  }, {
    key: 'loadAsyncProps',
    value: function loadAsyncProps(components, params, location, options) {
      var _this5 = this;

      this.setState({
        loading: true,
        prevProps: this.props
      });
      _loadAsyncProps(filterAndFlattenComponents(components), params, this.handleError(function (err, propsAndComponents) {
        var force = options && options.force;
        var sameLocation = _this5.props.location === location;
        // FIXME: next line has potential (rare) race conditions I think. If
        // somebody calls reloadAsyncProps, changes location, then changes
        // location again before its done and state gets out of whack (Rx folks
        // are like "LOL FLAT MAP LATEST NEWB"). Will revisit later.
        if ((force || sameLocation) && !_this5._unmounted) {
          if (_this5.state.propsAndComponents) {
            propsAndComponents = mergePropsAndComponents(_this5.state.propsAndComponents, propsAndComponents);
          }
          _this5.setState({
            loading: false,
            propsAndComponents: propsAndComponents,
            prevProps: null
          });
        }
      }));
    }
  }, {
    key: 'reloadComponent',
    value: function reloadComponent(Component) {
      var params = this.props.params;

      this.loadAsyncProps([Component], params, null, { force: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var propsAndComponents = this.state.propsAndComponents;

      if (!propsAndComponents) {
        return this.props.renderLoading();
      } else {
        var _props3 = this.state.loading ? this.state.prevProps : this.props;
        return this.props.render(_props3);
      }
    }
  }]);
  return AsyncProps;
}(_react2.default.Component), _class2.childContextTypes = {
  asyncProps: object
}, _class2.propTypes = {
  components: array.isRequired,
  params: object.isRequired,
  location: object.isRequired,
  onError: func.isRequired,
  renderLoading: func.isRequired,

  // server rendering
  propsArray: array,
  componentsArray: array
}, _class2.defaultProps = {
  onError: function onError(err) {
    throw err;
  },
  renderLoading: function renderLoading() {
    return null;
  },
  render: function render(props) {
    return _react2.default.createElement(_RouterContext2.default, (0, _extends3.default)({}, props, { createElement: createElement }));
  }
}, _temp2);
exports.default = AsyncProps;

/* eslint-enable */