import React, {Fragment, useCallback, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity, Text, View, Platform} from 'react-native';
import Marking from './Marking';
const DayComponent = props => {
  const {
    theme,
    date,
    onPress,
    onLongPress,
    markingType,
    marking,
    state,
    disableAllTouchEventsForDisabledDays,
    disableAllTouchEventsForInactiveDays,
    accessibilityLabel,
    children,
    testID,
    onPressDate
  } = props;
  //   const style = useRef(styleConstructor(theme));
  const _marking = marking || {};
  const isSelected = _marking.selected || state === 'selected';
  const isDisabled =
    typeof _marking.disabled !== 'undefined'
      ? _marking.disabled
      : state === 'disabled';
  const isInactive = _marking?.inactive;
  const isToday = state === 'today';
  const isMultiDot = markingType === Marking.markings.MULTI_DOT;
  const isMultiPeriod = markingType === Marking.markings.MULTI_PERIOD;
  const isCustom = markingType === Marking.markings.CUSTOM;
  // const dateData = date ? xdateToData(date) : undefined;
  const shouldDisableTouchEvent = () => {
    const {disableTouchEvent} = _marking;
    let disableTouch = false;
    if (typeof disableTouchEvent === 'boolean') {
      disableTouch = disableTouchEvent;
    } else if (
      typeof disableAllTouchEventsForDisabledDays === 'boolean' &&
      isDisabled
    ) {
      disableTouch = disableAllTouchEventsForDisabledDays;
    } else if (
      typeof disableAllTouchEventsForInactiveDays === 'boolean' &&
      isInactive
    ) {
      disableTouch = disableAllTouchEventsForInactiveDays;
    }
    return disableTouch;
  };
  const getContainerStyle = () => {
    const {customStyles, selectedColor} = _marking;
    const styles = [style.base];
    if (isSelected) {
      styles.push(style.selected);
      if (selectedColor) {
        styles.push({backgroundColor: selectedColor});
      }
    } else if (isToday) {
      styles.push(style.today);
    }
    //Custom marking type
    if (isCustom && customStyles && customStyles.container) {
      if (customStyles.container.borderRadius === undefined) {
        customStyles.container.borderRadius = 16;
      }
      styles.push(customStyles.container);
    }
    if (isSelected) {
      console.log(
        styles,
        '====styles',
        style.selected,
        '====',
        customStyles,
        '==',
        style.today,
      );
    }
    return styles;
  };
  const getTextStyle = () => {
    const {customStyles, selectedTextColor} = _marking;
    const styles = [style.text];
    if (isSelected) {
      styles.push(style.selectedText);
      if (selectedTextColor) {
        styles.push({color: selectedTextColor});
      }
    } else if (isDisabled) {
      styles.push(style.disabledText);
    } else if (isToday) {
      styles.push(style.todayText);
    } else if (isInactive) {
      styles.push(style.inactiveText);
    }
    //Custom marking type
    if (isCustom && customStyles && customStyles.text) {
      styles.push(customStyles.text);
    }
    return styles;
  };
  const _onPress = useCallback(() => {
    if(typeof onPressDate == 'function'){
      onPressDate();
    }
    // onPress?.(dateData);
  }, [onPress, date]);
  const _onLongPress = useCallback(() => {
    // onLongPress?.(dateData);
  }, [onLongPress, date]);
  const renderMarking = () => {
    const {marked, dotColor, dots, periods} = _marking;
    return (
      <Marking
        type={markingType}
        theme={theme}
        marked={isMultiDot ? true : marked}
        selected={isSelected}
        disabled={isDisabled}
        inactive={isInactive}
        today={isToday}
        dotColor={dotColor}
        dots={dots}
        periods={periods}
      />
    );
  };
  const renderText = () => {
    return (
      <Text allowFontScaling={false} style={getTextStyle()}>
        {String(children)}
      </Text>
    );
  };
  const renderContent = () => {
    return (
      <Fragment>
        {renderText()}
        {renderMarking()}
      </Fragment>
    );
  };
  const renderContainer = () => {
    const {activeOpacity} = _marking;
    return (
      <TouchableOpacity
        testID={testID}
        style={getContainerStyle()}
        disabled={shouldDisableTouchEvent()}
        activeOpacity={activeOpacity}
        onPress={!shouldDisableTouchEvent() ? _onPress : undefined}
        onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined}
        accessible
        accessibilityRole={isDisabled ? undefined : 'button'}
        accessibilityLabel={accessibilityLabel}>
        {isMultiPeriod ? renderText() : renderContent()}
      </TouchableOpacity>
    );
  };
  const renderPeriodsContainer = () => {
    return (
      <View style={style.container}>
        {renderContainer()}
        {renderMarking()}
      </View>
    );
  };
  return isMultiPeriod ? renderPeriodsContainer() : renderContainer();
};

const style = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  base: {
    width: 32,
    height: 32,
    alignItems: 'center',

    //CUSTOM
    width: '100%',
    height: 65,
    alignItems: 'center',
  },
  text: {
    marginTop: Platform.OS == 'android' ? 4 : 6,
    fontSize: 16,
    fontWeight: '300',
    color: '#2d4150',
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  alignedText: {
    marginTop: Platform.OS == 'android' ? 4 : 6,
  },
  selected: {
    backgroundColor: '#00BBF2',
    borderRadius: 16,

    //CUSTOM
    backgroundColor: '#ffe46c',
    borderRadius: 0,
    color: 'black',
  },
  today: {
    // backgroundColor: 'blue',
    borderRadius: 16,
  },
  todayText: {
    color: '#00BBF2',
  },
  selectedText: {
    color:  'white',

    //CUSTOM
    color: 'black',
  },
  disabledText: {
    color: '#d9e1e8',
  },
  inactiveText: {
    color: '#d9e1e8',
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 1,
    borderRadius: 2,
    opacity: 0,
  },
  visibleDot: {
    opacity: 1,
  },
 
});

export default DayComponent;
