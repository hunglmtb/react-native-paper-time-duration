import Color from 'color'
import {
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native'
import { useTheme } from 'react-native-paper'
import {
  clockTypes,
  getAngle,
  getHours,
  getHourType,
  getHourTypeFromOffset,
  getMinutes,
  hourTypes,
  PossibleClockTypes,
} from './timeUtils'
import * as React from 'react'

import { useLatest } from '../utils'
import AnalogClockHours from './AnalogClockHours'

import AnimatedClockSwitcher from './AnimatedClockSwitcher'
import AnalogClockMinutes from './AnalogClockMinutes'

// 250? when bigger?
export const circleSize = 215

function AnalogClock({
  hours,
  minutes,
  endHours,
  endMinutes,
  focused,
  is24Hour,
  onChange,
}: {
  hours: number
  minutes: number
  endHours: number
  endMinutes: number
  focused: PossibleClockTypes
  is24Hour: boolean
  onChange: ({
    hours,
    minutes,
    focused,
    endHours,
    endMinutes,
    duration,
  }: {
    hours: number
    minutes: number
    endHours?: number
    endMinutes?: number
    focused?: undefined | PossibleClockTypes
    duration?: number
  }) => any
}) {
  const theme = useTheme()

  // used to make pointer shorter if hours are selected and above 12
  const shortPointer =
    ((focused === clockTypes.hours ? hours : endHours) === 0 ||
      (focused === clockTypes.hours ? hours : endHours) > 12) &&
    is24Hour

  const clockRef = React.useRef<View | null>(null)

  // Hooks are nice, sometimes... :-)..
  // We need the latest values, since the onPointerMove uses a closure to the function
  const hoursRef = useLatest(hours)
  const endHoursRef = useLatest(endHours)
  const onChangeRef = useLatest(onChange)
  const minutesRef = useLatest(minutes)
  const endMinutesRef = useLatest(endMinutes)
  const focusedRef = useLatest(focused)
  const is24HourRef = useLatest(is24Hour)

  const onPointerMove = React.useCallback(
    (e: GestureResponderEvent, final: boolean) => {
      let x = e.nativeEvent.locationX
      let y = e.nativeEvent.locationY
      let angle = getAngle(x, y, circleSize)

      if (focusedRef.current === clockTypes.hours) {
        let hours24 = is24HourRef.current
        let previousHourType = getHourType(hoursRef.current)
        let pickedHours = getHours(angle, previousHourType)

        let hourTypeFromOffset = getHourTypeFromOffset(x, y, circleSize)
        let hours24AndPM = hours24 && hourTypeFromOffset === hourTypes.pm
        let hours12AndPm = !hours24 && previousHourType === hourTypes.pm

        // TODO: check which mode is switched on am/pm
        if (hours12AndPm || hours24AndPM) {
          pickedHours += 12
        }

        if (pickedHours === 24) {
          pickedHours = 0
        }

        if (hoursRef.current !== pickedHours || final) {
          onChangeRef.current({
            hours: pickedHours,
            minutes: minutesRef.current,
            endHours: endHoursRef.current,
            endMinutes: endMinutesRef.current,
            focused: final ? clockTypes.minutes : undefined,
          })
        }
      } else if (focusedRef.current === clockTypes.minutes) {
        let pickedMinutes = getMinutes(angle)
        if (minutesRef.current !== pickedMinutes) {
          onChangeRef.current({
            hours: hoursRef.current,
            minutes: pickedMinutes,
            endHours: endHoursRef.current,
            endMinutes: endMinutesRef.current,
          })
        }
      }

      if (focusedRef.current === clockTypes.endHours) {
        let hours24 = is24HourRef.current
        let previousHourType = getHourType(endHoursRef.current)
        let pickedHours = getHours(angle, previousHourType)

        let hourTypeFromOffset = getHourTypeFromOffset(x, y, circleSize)
        let hours24AndPM = hours24 && hourTypeFromOffset === hourTypes.pm
        let hours12AndPm = !hours24 && previousHourType === hourTypes.pm

        // TODO: check which mode is switched on am/pm
        if (hours12AndPm || hours24AndPM) {
          pickedHours += 12
        }

        if (pickedHours === 24) {
          pickedHours = 0
        }

        if (endHoursRef.current !== pickedHours || final) {
          onChangeRef.current({
            hours: hoursRef.current,
            minutes: minutesRef.current,
            endHours: pickedHours,
            endMinutes: endMinutesRef.current,
            focused: final ? clockTypes.endMinutes : undefined,
          })
        }
      } else if (focusedRef.current === clockTypes.endMinutes) {
        let pickedEndMinutes = getMinutes(angle)
        if (endMinutesRef.current !== pickedEndMinutes) {
          onChangeRef.current({
            hours: hoursRef.current,
            minutes: minutesRef.current,
            endHours: endHoursRef.current,
            endMinutes: pickedEndMinutes,
          })
        }
      }
    },
    [
      focusedRef,
      is24HourRef,
      hoursRef,
      onChangeRef,
      minutesRef,
      endHoursRef,
      endMinutesRef,
    ]
  )

  const panResponder = React.useRef(
    PanResponder.create({
      onPanResponderGrant: (e) => onPointerMove(e, false),
      onPanResponderMove: (e) => onPointerMove(e, false),
      onPanResponderRelease: (e) => onPointerMove(e, true),

      onStartShouldSetPanResponder: returnTrue,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: returnTrue,
      onMoveShouldSetPanResponderCapture: returnTrue,
      onPanResponderTerminationRequest: returnTrue,
      onShouldBlockNativeResponder: returnTrue,
    })
  ).current

  const dynamicSize =
    focused === clockTypes.hours && shortPointer
      ? 33
      : focused === clockTypes.endHours && shortPointer
      ? 33
      : 0
  const pointerNumber =
    focused === clockTypes.hours
      ? hours
      : focused === clockTypes.endHours
      ? endHours
      : focused === clockTypes.minutes
      ? minutes
      : endMinutes

  const degreesPerNumber =
    focused === clockTypes.hours ? 30 : focused === clockTypes.endHours ? 30 : 6

  const selectedHours = focused === clockTypes.hours ? hours : endHours
  const selectedMinutes = focused === clockTypes.minutes ? minutes : endMinutes

  return (
    <View
      ref={clockRef}
      {...panResponder.panHandlers}
      style={[
        styles.clock,
        {
          backgroundColor: theme.dark
            ? Color(theme.colors.surface).lighten(1.2).hex()
            : Color(theme.colors.surface).darken(0.1).hex(),
        },
      ]}
      // @ts-ignore -> https://github.com/necolas/react-native-web/issues/506
      cursor={'pointer'}
    >
      <View
        style={[
          styles.line,
          {
            backgroundColor: theme.colors.primary,
            transform: [
              { rotate: -90 + pointerNumber * degreesPerNumber + 'deg' },
              {
                translateX: circleSize / 4 - 4 - dynamicSize / 2,
              },
            ],
            width: circleSize / 2 - 4 - dynamicSize,
          },
        ]}
        pointerEvents="none"
      >
        <View
          style={[styles.endPoint, { backgroundColor: theme.colors.primary }]}
        />
      </View>
      <View
        style={[StyleSheet.absoluteFill, styles.center]}
        pointerEvents="none"
      >
        <View
          style={[
            styles.middlePoint,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>
      <AnimatedClockSwitcher
        focused={focused}
        hours={<AnalogClockHours is24Hour={is24Hour} hours={selectedHours} />}
        minutes={<AnalogClockMinutes minutes={selectedMinutes} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  clock: {
    height: circleSize,
    width: circleSize,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: circleSize / 2,
  },
  middlePoint: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  endPoint: {
    borderRadius: 15,
    height: 30,
    width: 30,
    position: 'absolute',
    right: 0,
    bottom: -14,
  },
  line: {
    position: 'absolute',

    marginBottom: -1,
    height: 2,
    borderRadius: 4,
  },
})

function returnTrue() {
  return true
}

export default React.memo(AnalogClock)
