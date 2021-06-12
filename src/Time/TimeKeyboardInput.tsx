// @typescript-eslint/no-unused-vars
// WORK IN PROGRESS

import * as React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import {
  clockTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  useSwitchColors,
} from './timeUtils'
import TimeInput from './TimeInput'
import { useState } from 'react'

function TimeKeyboardInput({
  textDurationUp,
  textDurationDown,
  textAfterSecondUp,
  textAfterSecondDown,
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
  inputType: PossibleInputTypes
  focused: PossibleClockTypes
  onFocusInput: (type: PossibleClockTypes) => any
  onChange: ({
    afterSecond,
    duration,
  }: {
    afterSecond?: number
    duration?: number
  }) => any
  duration?: number | undefined
  afterSecond?: number
  maxLength?: number
}) {
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height
  const theme = useTheme()
  const { color } = useSwitchColors(true)

  const [currentAfterSecond, setCurrentAfterSecond] = useState<
    number | undefined
  >(afterSecond)
  const [currentDuration, setCurrentDuration] = useState<number | undefined>(
    duration
  )

  return (
    <View style={[styles.inputContainer]}>
      {afterSecond !== undefined ? (
        <View>
          <View
            style={[
              styles.labelContainer,
              isLandscape && styles.inputContainerLandscape,
            ]}
          >
            <Text
              selectable={false}
              style={[
                styles.textCenter,
                {
                  ...theme.fonts.medium,
                  color: color,
                },
              ]}
            >
              {textDurationUp}
            </Text>
          </View>
          <TimeInput
            maxLength={maxLength}
            placeholder={'00'}
            value={currentAfterSecond || 0}
            clockType={clockTypes.minutes}
            pressed={false}
            inputType={inputType}
            blurOnSubmit={false}
            onChanged={(newAfterSecondInput) => {
              let newAfterSecond = newAfterSecondInput
              if (newAfterSecondInput > 24 * 60 * 60) {
                newAfterSecond = 24 * 60 * 60
              }
              setCurrentAfterSecond(newAfterSecond)
              onChange({
                afterSecond: newAfterSecond,
                duration: currentDuration,
              })
            }}
          />
          <View style={styles.labelContainer}>
            <Text
              selectable={false}
              style={[
                styles.textCenter,
                {
                  ...theme.fonts.medium,
                  color: color,
                },
              ]}
            >
              {textDurationDown}
            </Text>
          </View>
        </View>
      ) : null}
      {currentAfterSecond !== undefined && currentDuration !== undefined ? (
        <View style={styles.hoursAndMinutesSeparator}>
          <View style={styles.spaceDot} />
          <View style={styles.spaceDot} />
        </View>
      ) : null}
      {currentDuration !== undefined && (
        <View>
          <View
            style={[
              styles.labelContainer,
              isLandscape && styles.inputContainerLandscape,
            ]}
          >
            <Text
              selectable={false}
              style={[
                styles.textCenter,
                {
                  ...theme.fonts.medium,
                  color: color,
                },
              ]}
            >
              {textAfterSecondUp}
            </Text>
          </View>
          <TimeInput
            maxLength={maxLength}
            placeholder={'00'}
            value={currentDuration}
            clockType={clockTypes.minutes}
            pressed={false}
            inputType={inputType}
            blurOnSubmit={false}
            onChanged={(newDurationInput) => {
              let newDuration = newDurationInput
              if (newDurationInput > 24 * 60 * 60) {
                newDuration = 24 * 60 * 60
              }
              setCurrentDuration(newDuration)
              onChange({
                duration: newDuration,
                afterSecond: currentAfterSecond,
              })
            }}
          />
          <View style={styles.labelContainer}>
            <Text
              selectable={false}
              style={[
                styles.textCenter,
                {
                  ...theme.fonts.medium,
                  color: color,
                },
              ]}
            >
              {textAfterSecondDown}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  labelContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  textCenter: {
    textAlign: 'center',
  },
})

export default React.memo(TimeKeyboardInput)
