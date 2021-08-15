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
  seconds,
  duration: number,
  endHours,
  endMinutes,
  endSeconds,
  focused,
}: {
  hours: number
  minutes: number
  seconds: number
  endHours?: number
  endMinutes?: number
  endSeconds?: number
  duration?: number
  focused?: undefined | PossibleClockTypes
}) => any

function TimePicker({
  textTimeStart,
  textTimeEnd,
  textDuration,
  enableEndltStart,
  hours,
  minutes,
  seconds,
  endHours,
  endMinutes,
  endSeconds,
  onFocusInput,
  focused,
  inputType,
  onChange,
  locale,
  duration,
}: {
  textTimeStart?: string
  textTimeEnd?: string
  textDuration?: string
  enableEndltStart: boolean
  locale?: undefined | string
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  hours: number
  minutes: number
  seconds: number
  endHours: number | undefined
  endMinutes: number | undefined
  endSeconds: number | undefined
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
      hour12: false,
    })
    const formatted = formatter.format(new Date(Date.UTC(2020, 1, 1, 23)))
    return formatted.includes('23')
  }, [locale])

  const onInnerChange = React.useCallback<onChangeFunc>(
    (params) => {
      params.hours = toHourOutputFormat(params.hours, hours, is24Hour)
      if (
        params.endHours &&
        params.endHours >= 0 &&
        endHours &&
        endHours >= 0
      ) {
        params.endHours = toHourOutputFormat(
          params.endHours,
          endHours,
          is24Hour
        )
      }
      params.duration = duration || 0
      onChange(params)
    },
    [onChange, hours, is24Hour, duration, endHours]
  )

  return (
    <View style={isLandscape ? styles.rootLandscape : styles.rootPortrait}>
      <TimeInputs
        textTimeStart={textTimeStart}
        textTimeEnd={textTimeEnd}
        textDuration={textDuration}
        enableEndltStart={enableEndltStart}
        inputType={inputType}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        endHours={endHours}
        endMinutes={endMinutes}
        endSeconds={endSeconds}
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
            seconds={seconds}
            endHours={
              endHours !== undefined
                ? toHourInputFormat(endHours, is24Hour)
                : undefined
            }
            endMinutes={endMinutes}
            endSeconds={endSeconds}
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
  clockContainer: { paddingTop: 25, paddingLeft: 0, paddingRight: 0 },
})

export default React.memo(TimePicker)
