// @typescript-eslint/no-unused-vars
// WORK IN PROGRESS

import * as React from 'react'
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TextInput as TextInputNative,
} from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import {
  clockTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  toHourInputFormat,
  toHourOutputFormat,
  useSwitchColors,
} from './timeUtils'
import TimeInput from './TimeInput'
import AmPmSwitcher from './AmPmSwitcher'
import { useLatest } from '../utils'
import { useState } from 'react'

function TimeInputs({
  hours,
  minutes,
  endHours,
  endMinutes,
  onFocusInput,
  focused,
  inputType,
  onChange,
  is24Hour,
  duration,
}: {
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  hours: number
  minutes: number
  endHours: number
  endMinutes: number
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: ({
    hours,
    minutes,
    endHours,
    endMinutes,
    duration,
    focused,
  }: {
    hours: number
    minutes: number
    endHours?: number
    endMinutes?: number
    duration?: number
    focused?: undefined | PossibleClockTypes
  }) => any
  is24Hour: boolean
  duration?: number
}) {
  const startInput = React.useRef<TextInputNative | null>(null)
  const endInput = React.useRef<TextInputNative | null>(null)
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height
  const theme = useTheme()
  const { color } = useSwitchColors(true)

  const onSubmitStartInput = React.useCallback(() => {
    if (endInput.current) {
      endInput.current.focus()
    }
  }, [endInput])

  const onSubmitEndInput = React.useCallback(() => {
    // TODO: close modal and persist time
  }, [])

  const [currentDuration, setCurrentDuration] = useState(duration)
  const minutesRef = useLatest(minutes)
  const endMinutesRef = useLatest(endMinutes)
  const onChangeHours = React.useCallback(
    (newHours: number) => {
      onChange({
        hours: newHours,
        minutes: minutesRef.current,
        focused: clockTypes.hours,
        endHours,
        endMinutes: endMinutesRef.current,
      })
    },
    [endHours, endMinutesRef, onChange, minutesRef]
  )

  const onChangeEndHours = React.useCallback(
    (newEndHours: number) => {
      onChange({
        hours,
        minutes: minutesRef.current,
        focused: clockTypes.endHours,
        endHours: newEndHours,
        endMinutes: endMinutesRef.current,
      })
    },
    [onChange, endMinutesRef, minutesRef, hours]
  )

  React.useEffect(() => {
    let newMinutes: number = minutes
    let newEndHours: number = endHours
    let newEndMinutes: number = endMinutes
    if (hours === newEndHours && minutes === newEndMinutes) {
      newEndMinutes = newMinutes + 1
    }
    if (hours === newEndHours && minutes > newEndMinutes) {
      newEndMinutes = newMinutes + 1
    }
    if (hours === newEndHours && newMinutes > 58) {
      newMinutes = 58
    }
    if ((hours === 23 && newEndHours === 0) || hours > newEndHours) {
      newEndHours = hours
    }
    if (newEndMinutes > 59) {
      newEndMinutes = 59
    }
    onChange({
      hours,
      minutes: newMinutes,
      endHours: newEndHours,
      endMinutes: newEndMinutes,
    })
  }, [onChange, hours, minutes, endHours, endMinutes])

  return (
    <View style={[styles.columnContainer]}>
      <View style={styles.labelContainer}>
        <Text
          selectable={false}
          style={[
            {
              ...theme.fonts.medium,
              color: color,
            },
          ]}
        >
          {`Bắt đầu`}
        </Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          isLandscape && styles.inputContainerLandscape,
        ]}
      >
        <TimeInput
          ref={startInput}
          placeholder={'00'}
          value={toHourInputFormat(hours, is24Hour)}
          clockType={clockTypes.hours}
          pressed={focused === clockTypes.hours}
          onPress={onFocusInput}
          inputType={inputType}
          returnKeyType={'next'}
          onSubmitEditing={onSubmitStartInput}
          blurOnSubmit={false}
          onChanged={(newHoursFromInput) => {
            let newHours = toHourOutputFormat(
              newHoursFromInput,
              hours,
              is24Hour
            )
            if (newHoursFromInput > 23 || endHours > 23) {
              newHours = 0
            }
            onChange({
              hours: newHours,
              minutes,
              endHours,
              endMinutes,
            })
          }}
        />
        <View style={styles.hoursAndMinutesSeparator}>
          <View style={styles.spaceDot} />
          <View style={[styles.dot, { backgroundColor: theme.colors.text }]} />
          <View style={styles.betweenDot} />
          <View style={[styles.dot, { backgroundColor: theme.colors.text }]} />
          <View style={styles.spaceDot} />
        </View>
        <TimeInput
          ref={endInput}
          placeholder={'00'}
          value={minutes}
          clockType={clockTypes.minutes}
          pressed={focused === clockTypes.minutes}
          onPress={onFocusInput}
          inputType={inputType}
          onSubmitEditing={onSubmitEndInput}
          onChanged={(newMinutesFromInput) => {
            let newMinutes = newMinutesFromInput
            if (newMinutesFromInput > 59 || endMinutes > 59) {
              newMinutes = 59
            }
            onChange({
              hours,
              minutes: newMinutes,
              endHours,
              endMinutes,
            })
          }}
        />
        {!is24Hour ? (
          <>
            <View style={styles.spaceBetweenInputsAndSwitcher} />
            <AmPmSwitcher hours={hours} onChange={onChangeHours} />
          </>
        ) : null}
      </View>
      {currentDuration !== undefined ? (
        <>
          <View style={styles.betweenDot} />
          <View style={styles.spaceBetweenInputsAndSwitcher} />
          <View style={styles.labelContainer}>
            <Text
              selectable={false}
              style={[
                {
                  ...theme.fonts.medium,
                  color: color,
                },
              ]}
            >
              {`Thời lượng`}
            </Text>
          </View>
          <View
            style={[
              styles.inputContainer,
              isLandscape && styles.inputContainerLandscape,
            ]}
          >
            <TimeInput
              // ref={startInput}
              placeholder={'00'}
              value={Math.floor(currentDuration / 60)}
              clockType={clockTypes.minutes}
              pressed={false}
              inputType={inputType}
              returnKeyType={'next'}
              // onSubmitEditing={onSubmitStartInput}
              blurOnSubmit={false}
              onChanged={(newMinutesFromInput) => {
                let newDuration =
                  newMinutesFromInput * 60 + (currentDuration % 60)
                setCurrentDuration(newDuration)
                onChange({
                  hours,
                  minutes,
                  duration: newDuration,
                })
              }}
              // onChangeText={onChangeStartInput}
            />
            <View style={styles.hoursAndMinutesSeparator}>
              <View style={styles.spaceDot} />
              <View
                style={[styles.dot, { backgroundColor: theme.colors.text }]}
              />
              <View style={styles.betweenDot} />
              <View
                style={[styles.dot, { backgroundColor: theme.colors.text }]}
              />
              <View style={styles.spaceDot} />
            </View>
            <TimeInput
              // ref={endInput}
              placeholder={'00'}
              value={currentDuration % 60}
              clockType={clockTypes.minutes}
              pressed={false}
              inputType={inputType}
              // onSubmitEditing={onSubmitEndInput}
              onChanged={(newSecondFromInput) => {
                if (newSecondFromInput > 59) {
                  newSecondFromInput = 59
                }
                const newDuration =
                  Math.floor(currentDuration / 60) * 60 + newSecondFromInput
                setCurrentDuration(newDuration)
                onChange({
                  hours,
                  minutes,
                  duration: newDuration,
                })
              }}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.betweenDot} />
          <View style={styles.labelContainer}>
            <Text
              selectable={false}
              style={[
                {
                  ...theme.fonts.medium,
                  color: color,
                },
              ]}
            >
              {`Kết thúc`}
            </Text>
          </View>
          <View
            style={[
              styles.inputContainer,
              isLandscape && styles.inputContainerLandscape,
            ]}
          >
            <TimeInput
              placeholder={'00'}
              value={toHourInputFormat(endHours, is24Hour)}
              clockType={clockTypes.endHours}
              pressed={focused === clockTypes.endHours}
              onPress={onFocusInput}
              inputType={inputType}
              returnKeyType={'next'}
              onSubmitEditing={onSubmitStartInput}
              blurOnSubmit={false}
              onChanged={(newEndHoursFromInput) => {
                let newEndHours = toHourOutputFormat(
                  newEndHoursFromInput,
                  endHours,
                  is24Hour
                )
                if (newEndHoursFromInput > 23 || hours > 23) {
                  newEndHours = 0
                }
                onChange({
                  hours,
                  minutes,
                  endHours: newEndHours,
                  endMinutes,
                })
              }}
            />
            <View style={styles.hoursAndMinutesSeparator}>
              <View style={styles.spaceDot} />
              <View
                style={[styles.dot, { backgroundColor: theme.colors.text }]}
              />
              <View style={styles.betweenDot} />
              <View
                style={[styles.dot, { backgroundColor: theme.colors.text }]}
              />
              <View style={styles.spaceDot} />
            </View>
            <TimeInput
              ref={endInput}
              placeholder={'00'}
              value={endMinutes}
              clockType={clockTypes.endMinutes}
              pressed={focused === clockTypes.endMinutes}
              onPress={onFocusInput}
              inputType={inputType}
              onSubmitEditing={onSubmitEndInput}
              onChanged={(newEndMinutesFromInput) => {
                let newEndMinutes = newEndMinutesFromInput
                if (newEndMinutesFromInput > 59 || newEndMinutes > 59) {
                  newEndMinutes = 59
                }
                onChange({
                  hours,
                  minutes,
                  endMinutes: newEndMinutes,
                  endHours,
                })
              }}
            />
            {!is24Hour ? (
              <>
                <View style={styles.spaceBetweenInputsAndSwitcher} />
                <AmPmSwitcher hours={endHours} onChange={onChangeEndHours} />
              </>
            ) : null}
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  spaceBetweenInputsAndSwitcher: { width: 12 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainerLandscape: {
    flex: 1,
  },
  hoursAndMinutesSeparator: {
    fontSize: 65,
    width: 24,
    alignItems: 'center',
  },
  spaceDot: {
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 7 / 2,
  },
  betweenDot: {
    height: 12,
  },
  labelContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
  },
})

export default React.memo(TimeInputs)
