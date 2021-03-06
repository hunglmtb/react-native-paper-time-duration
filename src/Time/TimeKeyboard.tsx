import * as React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

import { PossibleClockTypes, PossibleInputTypes } from './timeUtils'

import { circleSize } from './AnalogClock'
import TimeKeyboardInput from './TimeKeyboardInput'

type onChangeFunc = ({
  afterSecond,
  duration,
  turnOnTime,
  turnOffTime,
}: {
  afterSecond?: number
  duration?: number
  turnOnTime: number | undefined
  turnOffTime: number | undefined
}) => void

function TimeKeyboard({
  minDuration,
  maxDuration,
  minAfterSeconds,
  maxAfterSeconds,
  turnOnTime,
  turnOffTime,
  textDurationUp,
  textDurationDown,
  textAfterSecondUp,
  textAfterSecondDown,
  textTurnOnTimeUp,
  textTurnOnTimeDown,
  textTurnOffTimeUp,
  textTurnOffTimeDown,
  onFocusInput,
  focused,
  inputType,
  onChange,
  duration,
  afterSecond,
  maxLength,
}: {
  minDuration: number
  maxDuration: number
  minAfterSeconds: number
  maxAfterSeconds: number
  turnOnTime?: number
  turnOffTime?: number
  textDurationUp?: string | React.ReactNode
  textDurationDown?: string | React.ReactNode
  textAfterSecondUp?: string | React.ReactNode
  textAfterSecondDown?: string | React.ReactNode
  textTurnOnTimeUp?: string | React.ReactNode
  textTurnOnTimeDown?: string | React.ReactNode
  textTurnOffTimeUp?: string | React.ReactNode
  textTurnOffTimeDown?: string | React.ReactNode
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
        minDuration={minDuration}
        maxDuration={maxDuration}
        minAfterSeconds={minAfterSeconds}
        maxAfterSeconds={maxAfterSeconds}
        turnOnTime={turnOnTime}
        turnOffTime={turnOffTime}
        textDurationUp={textDurationUp}
        textDurationDown={textDurationDown}
        textAfterSecondUp={textAfterSecondUp}
        textAfterSecondDown={textAfterSecondDown}
        textTurnOnTimeUp={textTurnOnTimeUp}
        textTurnOnTimeDown={textTurnOnTimeDown}
        textTurnOffTimeUp={textTurnOffTimeUp}
        textTurnOffTimeDown={textTurnOffTimeDown}
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
