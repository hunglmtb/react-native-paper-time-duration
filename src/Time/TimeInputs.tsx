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
  compareEndTimeMidnight,
} from './timeUtils'
import TimeInput from './TimeInput'
import AmPmSwitcher from './AmPmSwitcher'
import { useLatest } from '../utils'
import { useState } from 'react'

function TimeInputs({
  textTimeStart,
  textTimeEnd,
  textDuration,
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
  is24Hour,
  duration,
}: {
  textTimeStart?: string
  textTimeEnd?: string
  textDuration?: string
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  hours: number
  minutes: number
  seconds: number
  endHours?: number
  endMinutes?: number
  endSeconds?: number
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: ({
    hours,
    minutes,
    seconds,
    endHours,
    endMinutes,
    endSeconds,
    duration,
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
  const secondsRef = useLatest(seconds)
  const endSecondsRef = useLatest(endSeconds)
  const onChangeHours = React.useCallback(
    (newHours: number) => {
      onChange({
        hours: newHours,
        minutes: minutesRef.current,
        seconds: secondsRef.current,
        endHours,
        endMinutes: endMinutesRef.current,
        endSeconds: endSecondsRef.current,
        focused: clockTypes.hours,
      })
    },
    [endHours, endMinutesRef, onChange, minutesRef, secondsRef, endSecondsRef]
  )

  const onChangeEndHours = React.useCallback(
    (newEndHours: number) => {
      onChange({
        hours,
        minutes: minutesRef.current,
        seconds: secondsRef.current,
        endHours: newEndHours,
        endMinutes: endMinutesRef.current,
        endSeconds: endSecondsRef.current,
        focused: clockTypes.endHours,
      })
    },
    [onChange, endMinutesRef, minutesRef, hours, secondsRef, endSecondsRef]
  )

  React.useEffect(() => {
    let newMinutes = minutes
    let newSeconds = seconds
    let newEndHours: number | undefined = endHours
    let newEndMinutes: number | undefined = endMinutes
    let newEndSeconds: number | undefined = endSeconds

    if (
      newEndHours !== undefined &&
      newEndMinutes !== undefined &&
      newEndSeconds !== undefined
    ) {
      if (!compareEndTimeMidnight(newEndHours, newEndMinutes, newEndSeconds)) {
        if (hours === newEndHours && minutes === newEndMinutes) {
          newEndMinutes = newMinutes
        }
        if (hours === newEndHours && minutes > newEndMinutes) {
          newEndMinutes = newMinutes
        }
        if (hours === newEndHours && minutes > newEndMinutes) {
          newEndMinutes = newMinutes + 1
        }
        if (
          hours === newEndHours &&
          minutes === newEndMinutes &&
          seconds === newEndSeconds
        ) {
          newEndSeconds = seconds + 1
        }
        if (
          hours === newEndHours &&
          minutes === newEndMinutes &&
          seconds > newEndSeconds
        ) {
          newEndSeconds = newSeconds
        }
        if (
          hours === newEndHours &&
          minutes === newEndMinutes &&
          newSeconds > 58
        ) {
          newSeconds = 58
        }
        if ((hours === 23 && newEndHours === 0) || hours > newEndHours) {
          newEndHours = hours
        }
        if (newEndMinutes > 59) {
          newEndMinutes = 59
        }
        if (newEndSeconds > 59) {
          newEndSeconds = 59
        }
      }
    }

    const setInterValChange = setInterval(() => {
      onChange({
        hours,
        minutes: newMinutes,
        seconds: newSeconds,
        endHours: newEndHours,
        endMinutes: newEndMinutes,
        endSeconds: newEndSeconds,
        duration,
      })
    }, 500)

    return () => {
      clearInterval(setInterValChange)
    }
  }, [
    onChange,
    hours,
    minutes,
    endHours,
    endMinutes,
    seconds,
    endSeconds,
    duration,
  ])

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
          {textTimeStart}
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
            if (newHoursFromInput > 23) {
              newHours = 0
            }
            onChange({
              hours: newHours,
              minutes,
              seconds,
              endHours,
              endMinutes,
              endSeconds,
              duration,
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
            if (newMinutesFromInput > 59) {
              newMinutes = 59
            }
            onChange({
              hours,
              minutes: newMinutes,
              seconds,
              endHours,
              endMinutes,
              endSeconds,
              duration,
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
          value={seconds}
          clockType={clockTypes.seconds}
          pressed={focused === clockTypes.seconds}
          onPress={onFocusInput}
          inputType={inputType}
          onSubmitEditing={onSubmitEndInput}
          onChanged={(newSecondsFromInput) => {
            let newSeconds = newSecondsFromInput
            if (newSecondsFromInput > 59) {
              newSeconds = 59
            }
            onChange({
              hours,
              minutes,
              seconds: newSeconds,
              endHours,
              endMinutes,
              endSeconds,
              duration,
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
                  marginLeft: 58,
                },
              ]}
            >
              {textDuration}
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
                  seconds,
                  endHours,
                  endMinutes,
                  endSeconds,
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
                  seconds,
                  endHours,
                  endMinutes,
                  endSeconds,
                  duration: newDuration,
                })
              }}
            />
          </View>
        </>
      ) : (
        <>
          {endHours !== undefined ? (
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
                  {textTimeEnd}
                </Text>
              </View>
            </>
          ) : null}
          <View
            style={[
              styles.inputContainer,
              isLandscape && styles.inputContainerLandscape,
            ]}
          >
            {endHours !== undefined ? (
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
                    seconds,
                    endHours: newEndHours,
                    endMinutes,
                    endSeconds,
                    duration,
                  })
                }}
              />
            ) : null}
            {endMinutes !== undefined ? (
              <>
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
                      seconds,
                      endMinutes: newEndMinutes,
                      endHours,
                      endSeconds,
                      duration,
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
              </>
            ) : null}
            {endSeconds !== undefined ? (
              <TimeInput
                ref={endInput}
                placeholder={'00'}
                value={endSeconds}
                clockType={clockTypes.endSeconds}
                pressed={focused === clockTypes.endSeconds}
                onPress={onFocusInput}
                inputType={inputType}
                onSubmitEditing={onSubmitEndInput}
                onChanged={(newEndSecondsFromInput) => {
                  let newEndSeconds = newEndSecondsFromInput
                  if (newEndSecondsFromInput > 59 || seconds > 59) {
                    newEndSeconds = 59
                  }
                  onChange({
                    hours,
                    minutes,
                    seconds,
                    endHours,
                    endMinutes,
                    endSeconds: newEndSeconds,
                    duration,
                  })
                }}
              />
            ) : null}
            {!is24Hour && endHours ? (
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
  },
})

export default React.memo(TimeInputs)
