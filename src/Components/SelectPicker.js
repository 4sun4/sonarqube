import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import Colors from '../Util/Colors';

/**
 * 
 * @param {defaultButtonText,dropdownData,dropdownButton,dropdownTextStyle,iconColor,selectedDropdownItem,statusBarTranslucent,defaultSelection,selectedItemIndex} props 
 * @returns a dropdown component with customizable props 
 */

const Dropdown = props => {
  const {
    defaultButtonText,
    dropdownData,
    dropdownButton,
    dropdownTextStyle,
    iconColor,
    selectedDropdownItem,
    statusBarTranslucent,
    defaultSelection,
    selectedItemIndex = 0,
    isIcon
  } = props;

  {/** isDisbled is flag to disable the dropdown when no data is provided to it */ }
  const isDisabled = dropdownData && dropdownData.length ? false : true;

  return (
    <SelectDropdown
      disabled={isDisabled}
      data={dropdownData}
      statusBarTranslucent={statusBarTranslucent}
      defaultButtonText={defaultButtonText}
      defaultValue={!isDisabled && defaultSelection && dropdownData[selectedItemIndex]}
      buttonTextStyle={[styles.dropdownDefaultText, dropdownTextStyle, isDisabled ? { color: Colors.LIGHT_GREY } : {}]}
      buttonStyle={[styles.defaultButtonStyle, dropdownButton, isDisabled ? {} : {}]}
      rowTextStyle={{ textAlign: 'left', }}
      
      onSelect={(selectedItem, index) => {
        console.log(selectedItem, index);
        selectedDropdownItem && selectedDropdownItem(selectedItem, index);
      }}

      renderDropdownIcon={() => {
        if (isIcon) {
          return (
            <Icon name="chevron-down" type={'font-awesome'} size={18}
              color={isDisabled ? Colors.LIGHT_GREY : (iconColor ? iconColor : Colors.LIGHT_GREY)} />
          );
        }
        return null
      }}
      buttonTextAfterSelection={(selectedItem, index) => {  return selectedItem; }}
      rowTextForSelection={(item, index) => { return item; }}
      
    />
  );
};

Dropdown.defaultProps = {
  defaultButtonText: 'Select Size',
  dropdownData: ['ABC', 'ABCD', 'ABCDE', 'ABCDEF'],
};

const styles = StyleSheet.create({
  dropdownDefaultText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 18,
    marginHorizontal: 0
  },
  defaultButtonStyle: {
    width: '100%',
    paddingHorizontal: 2
  },
});

export default Dropdown;

















