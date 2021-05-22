import * as React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

import {
  inputTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  toHourInputFormat,
  toHourOutputFormat,
} from './timeUtils'

import AnalogClock, { circleSize } from './AnalogClock'
import TimeInputs from './TimeInputs'

type onChangeFunc = ({
  hours,
  minutes,
  duration: number,
  endHours,
  endMinutes,
  focused,
}: {
  hours: number
  minutes: number
  endHours?: number
  endMinutes?: number
  duration?: number
  focused?: undefined | PossibleClockTypes
}) => any

function TimePicker({
  hours,
  minutes,
  endHours,
  endMinutes,
  onFocusInput,
  focused,
  inputType,
  onChange,
  locale,
  duration,
}: {
  locale?: undefined | string
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  hours: number
  minutes: number
  endHours: number
  endMinutes: number
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: onChangeFunc
  duration?: number
}) {
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height

  // method to check whether we have 24 hours in clock or 12
  const is24Hour = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    })
    const formatted = formatter.format(new Date(Date.UTC(2020, 1, 1, 23)))
    return formatted.includes('23')
  }, [locale])

  const onInnerChange = React.useCallback<onChangeFunc>(
    (params) => {
      params.hours = toHourOutputFormat(params.hours, hours, is24Hour)
      if (params.endHours && params.endHours >= 0) {
        params.endHours = toHourOutputFormat(params.endHours, endHours, is24Hour)
      }
      params.duration = duration || 0
      onChange(params)
    },
    [onChange, hours, is24Hour, duration]
  )

  return (
    <View style={isLandscape ? styles.rootLandscape : styles.rootPortrait}>
      <TimeInputs
        inputType={inputType}
        hours={hours}
        minutes={minutes}
        endHours={endHours}
        endMinutes={endMinutes}
        is24Hour={is24Hour}
        onChange={onChange}
        onFocusInput={onFocusInput}
        focused={focused}
        duration={duration}
      />
      {inputType === inputTypes.picker ? (
        <View style={styles.clockContainer}>
          <AnalogClock
            hours={toHourInputFormat(hours, is24Hour)}
            minutes={minutes}
            endHours={toHourInputFormat(endHours, is24Hour)}
            endMinutes={endMinutes}
            focused={focused}
            is24Hour={is24Hour}
            onChange={onInnerChange}
          />
        </View>
      ) : null}
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

export default React.memo(TimePicker)
