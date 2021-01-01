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
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: ({
    hours,
    minutes,
    duration,
    focused,
  }: {
    hours: number
    minutes: number
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
  const onChangeHours = React.useCallback(
    (newHours: number) => {
      onChange({
        hours: newHours,
        minutes: minutesRef.current,
        focused: clockTypes.hours,
      })
    },
    [onChange, minutesRef]
  )

  return (
    <View style={[styles.columnContainer]}>
      {duration && duration >= 0 && (
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
            {`Bắt đầu lúc`}
          </Text>
        </View>
      )}
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
            if (newHoursFromInput > 24) {
              newHours = 24
            }
            onChange({
              hours: newHours,
              minutes,
            })
          }}
          // onChangeText={onChangeStartInput}
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
            if (newMinutesFromInput > 60) {
              newMinutes = 60
            }
            onChange({
              hours,
              minutes: newMinutes,
            })
          }}
        />
        {!is24Hour && (
          <>
            <View style={styles.spaceBetweenInputsAndSwitcher} />
            <AmPmSwitcher hours={hours} onChange={onChangeHours} />
          </>
        )}
      </View>
      {currentDuration !== undefined && (
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
                if (newSecondFromInput > 60) {
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
