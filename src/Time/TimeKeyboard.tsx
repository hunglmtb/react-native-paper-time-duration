import * as React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

import { PossibleClockTypes, PossibleInputTypes } from './timeUtils'

import { circleSize } from './AnalogClock'
import TimeKeyboardInput from './TimeKeyboardInput'

type onChangeFunc = ({
  afterSecond,
  duration,
}: {
  afterSecond?: number
  duration?: number
}) => any

function TimeKeyboard({
  textDurationUp,
  textDurationDown,
  textAfterSecondUp,
  textAfterSecondDown,
  onFocusInput,
  focused,
  inputType,
  onChange,
  duration,
  afterSecond,
  maxLength,
}: {
  textDurationUp?: string
  textDurationDown?: string
  textAfterSecondUp?: string
  textAfterSecondDown?: string
  locale?: undefined | string
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: onChangeFunc
  duration?: number | undefined
  afterSecond?: number
  maxLength?: number
}) {
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height

  return (
    <View style={isLandscape ? styles.rootLandscape : styles.rootPortrait}>
      <TimeKeyboardInput
        textDurationUp={textDurationUp}
        textDurationDown={textDurationDown}
        textAfterSecondUp={textAfterSecondUp}
        textAfterSecondDown={textAfterSecondDown}
        inputType={inputType}
        onChange={onChange}
        onFocusInput={onFocusInput}
        focused={focused}
        duration={duration}
        afterSecond={afterSecond}
        maxLength={maxLength}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  rootLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24 * 3 + 96 * 2 + 52 + circleSize,
  },
  rootPortrait: {},
  clockContainer: { paddingTop: 36, paddingLeft: 12, paddingRight: 12 },
})

export default React.memo(TimeKeyboard)
