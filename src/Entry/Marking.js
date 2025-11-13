import filter from 'lodash/filter';
import React, {useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {extractDotProps} from 'react-native-calendars/src/componentUpdater';

const Dot = ({theme, marked, disabled, inactive, color, today, selected}) => {

  const dotStyle = [style.dot];
  if (marked) {
    dotStyle.push(style.visibleDot);
    if (today) {
      dotStyle.push(style.todayDot);
    }
    if (disabled) {
      dotStyle.push(style.disabledDot);
    }
    if (inactive) {
      dotStyle.push(style.inactiveDot);
    }
    if (selected) {
      dotStyle.push(style.selectedDot);
    }
    if (color) {
      dotStyle.push({backgroundColor: color});
    }
  }
  return <View style={dotStyle} />;
};

export var Markings;
(function (Markings) {
  Markings['DOT'] = 'dot';
  Markings['MULTI_DOT'] = 'multi-dot';
  Markings['PERIOD'] = 'period';
  Markings['MULTI_PERIOD'] = 'multi-period';
  Markings['CUSTOM'] = 'custom';
})(Markings || (Markings = {}));
const Marking = props => {
  const {theme, type, dots, periods, selected, dotColor} = props;
  // const style = useRef(styleConstructor(theme));
  const getItems = items => {
    if (items && Array.isArray(items) && items.length > 0) {
      // Filter out items so that we process only those which have color property
      const validItems = filter(items, function (o) {
        return o.color;
      });
      if (validItems.length > 3 && type === Markings.MULTI_DOT) {
        return (
          <View style={{flexDirection:"row",alignItems: 'center'}}>
            {validItems.slice(0, 3).map((item, index) => {
                return type === Markings.MULTI_DOT
                ? renderDot(index, item)
                : renderPeriod(index, item);
            })}
            <Text style={{fontSize:12}} >{validItems.length - 3}+</Text>
          </View>
        );
      } else {
        return validItems.map((item, index) => {
          return type === Markings.MULTI_DOT
            ? renderDot(index, item)
            : renderPeriod(index, item);
        });
      }
    }
  };
  const renderMarkingByType = () => {
    switch (type) {
      case Markings.MULTI_DOT:
        return renderMultiMarkings(style.dots, dots);
      case Markings.MULTI_PERIOD:
        return renderMultiMarkings(style.periods, periods);
      default:
        return renderDot();
    }
  };
  const renderMultiMarkings = (containerStyle, items) => {
    return <View style={containerStyle}>{getItems(items)}</View>;
  };
  const renderPeriod = (index, item) => {
    const {color, startingDay, endingDay} = item;
    const styles = [
      style.period,
      {
        backgroundColor: color,
      },
    ];
    if (startingDay) {
      styles.push(style.startingDay);
    }
    if (endingDay) {
      styles.push(style.endingDay);
    }
    return <View key={index} style={styles} />;
  };
  const renderDot = (index, item) => {
    const dotProps = extractDotProps(props);
    let key = index;
    let color = dotColor;
    if (item) {
      if (item.key) {
        key = item.key;
      }
      color =
        selected && item.selectedDotColor ? item.selectedDotColor : item.color;
    }
    return <Dot {...dotProps} key={key} color={color} />;
  };
  return renderMarkingByType();
};
export default Marking;

const style = StyleSheet.create({
  dots: {
    flexDirection: 'row',
  },
  periods: {
    alignSelf: 'stretch',
  },
  period: {
    height: 4,
    marginVertical: 1,
    backgroundColor: '#00BBF2',
  },
  startingDay: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    marginLeft: 4,
  },
  endingDay: {
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    marginRight: 4,
  },
  dot: {
    width: 8,
    height: 8,
    marginTop: 3,
    marginHorizontal: 1,
    borderRadius: 4,
    opacity: 0,
  },
  visibleDot: {
    opacity: 1,
    backgroundColor: '#00BBF2',
  },
  selectedDot: {
    backgroundColor: 'white',
  },
  disabledDot: {
    backgroundColor: '#00BBF2',
  },
  inactiveDot: {
    backgroundColor: '#00BBF2',
  },
  todayDot: {
    backgroundColor: '#00BBF2',
  },
});
Marking.displayName = 'Marking';
Marking.markings = Markings;
