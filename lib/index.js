'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ItemTypes = require('./ItemTypes');

var _ItemTypes2 = _interopRequireDefault(_ItemTypes);

var _reactDnd = require('react-dnd');

var _lodash = require('lodash.flow');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isNullOrUndefined(o) {
  return o == null;
}

var cardSource = {
  beginDrag: function beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      originalIndex: props.index
    };
  },
  endDrag: function endDrag(props, monitor) {
    if (props.noDropOutside) {
      var _monitor$getItem = monitor.getItem(),
          id = _monitor$getItem.id,
          index = _monitor$getItem.index,
          originalIndex = _monitor$getItem.originalIndex;

      var didDrop = monitor.didDrop();

      if (!didDrop) {
        props.moveCard(isNullOrUndefined(id) ? index : id, originalIndex);
      }
    }

    if (props.endDrag) {
      props.endDrag();
    }
  }
};

var cardTarget = {
  hover: function hover(props, monitor) {
    var _monitor$getItem2 = monitor.getItem(),
        dragId = _monitor$getItem2.id,
        dragIndex = _monitor$getItem2.index;

    var hoverId = props.id,
        hoverIndex = props.index;


    if (!isNullOrUndefined(dragId)) {
      // use id
      if (dragId !== hoverId) {
        props.moveCard(dragId, hoverIndex);
      }
    } else {
      // use index
      if (dragIndex !== hoverIndex) {
        props.moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
      }
    }
  }
};

var propTypes = {
  index: _propTypes2.default.number.isRequired,
  source: _propTypes2.default.any.isRequired,
  createItem: _propTypes2.default.func.isRequired,
  moveCard: _propTypes2.default.func.isRequired,
  endDrag: _propTypes2.default.func,
  isDragging: _propTypes2.default.bool.isRequired,
  connectDragSource: _propTypes2.default.func.isRequired,
  connectDropTarget: _propTypes2.default.func.isRequired,
  noDropOutside: _propTypes2.default.bool
};

var DndCard = function (_Component) {
  _inherits(DndCard, _Component);

  function DndCard() {
    _classCallCheck(this, DndCard);

    return _possibleConstructorReturn(this, (DndCard.__proto__ || Object.getPrototypeOf(DndCard)).apply(this, arguments));
  }

  _createClass(DndCard, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          index = _props.index,
          source = _props.source,
          createItem = _props.createItem,
          noDropOutside = _props.noDropOutside,
          moveCard = _props.moveCard,
          endDrag = _props.endDrag,
          isDragging = _props.isDragging,
          connectDragSource = _props.connectDragSource,
          connectDropTarget = _props.connectDropTarget,
          restProps = _objectWithoutProperties(_props, ['id', 'index', 'source', 'createItem', 'noDropOutside', 'moveCard', 'endDrag', 'isDragging', 'connectDragSource', 'connectDropTarget']);

      if (id === null) {
        console.warn('Warning: `id` is null. Set to undefined to get better performance.');
      }

      var item = createItem(source, isDragging, index);
      if (typeof item === 'undefined') {
        console.warn('Warning: `createItem` returns undefined. It should return a React element or null.');
      }

      var finalProps = Object.keys(restProps).reduce(function (result, k) {
        var prop = restProps[k];
        result[k] = typeof prop === 'function' ? prop(isDragging) : prop;
        return result;
      }, {});

      return connectDragSource(connectDropTarget(_react2.default.createElement(
        'div',
        finalProps,
        item
      )));
    }
  }]);

  return DndCard;
}(_react.Component);

DndCard.propTypes = propTypes;

exports.default = (0, _lodash2.default)((0, _reactDnd.DropTarget)(_ItemTypes2.default.DND_CARD, cardTarget, function (connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}), (0, _reactDnd.DragSource)(_ItemTypes2.default.DND_CARD, cardSource, function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}))(DndCard);