import * as React from 'react'
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native'

import { Button, overlay, useTheme } from 'react-native-paper'
import TimeKeyboard from './TimeKeyboard'
import { clockTypes, inputTypes, PossibleClockTypes } from './timeUtils'

const supportedOrientations: any[] = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
]

export function TimeKeyboardModal({
  visible,
  footerLeft,
  min = 0,
  max = 24 * 60 * 60,
  onDismiss,
  onConfirm,
  label = 'Select time',
  cancelLabel = 'Cancel',
  confirmLabel = 'Ok',
  animationType = 'none',
  textDurationUp = 'Sau',
  textDurationDown = 'Giây',
  textAfterSecondUp = 'Thời lượng',
  textAfterSecondDown = 'Giây',
  locale,
  duration,
  afterSecond,
  maxLength,
}: {
  locale?: undefined | string
  label?: string
  min?: number
  max?: number
  footerLeft?: string | React.ReactNode
  cancelLabel?: string
  confirmLabel?: string
  textDurationUp?: string | React.ReactNode
  textDurationDown?: string | React.ReactNode
  textAfterSecondUp?: string | React.ReactNode
  textAfterSecondDown?: string | React.ReactNode
  hours?: number | undefined
  minutes?: number | undefined
  visible: boolean | undefined
  onDismiss: () => any
  onConfirm: ({
    afterSecond,
    duration,
  }: {
    afterSecond: number
    duration: number
  }) => any
  animationType?: 'slide' | 'fade' | 'none'
  duration?: number | undefined
  afterSecond?: number
  maxLength?: number
}) {
  const theme = useTheme()

  const [inputType] = React.useState(inputTypes.picker)

  const [focused, setFocused] = React.useState<PossibleClockTypes>(
    clockTypes.hours
  )
  const [localDuration, setLocalDuration] = React.useState<number>(0)
  const [localAfterSecond, setLocalAfterSecond] = React.useState<number>(0)

  React.useEffect(() => {
    setLocalDuration(duration || 0)
  }, [setLocalDuration, duration])

  React.useEffect(() => {
    setLocalAfterSecond(afterSecond || 0)
  }, [setLocalAfterSecond, afterSecond])

  const onFocusInput = React.useCallback(
    (type: PossibleClockTypes) => setFocused(type),
    []
  )
  const onChange = React.useCallback(
    (params: { duration?: number; afterSecond?: number }) => {
      setLocalDuration(params.duration || 0)
      setLocalAfterSecond(params.afterSecond || 0)
    },
    [setLocalDuration, setLocalAfterSecond]
  )

  return (
    <Modal
      animationType={animationType}
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
      presentationStyle="overFullScreen"
      supportedOrientations={supportedOrientations}
      //@ts-ignore
      statusBarTranslucent={true}
    >
      <>
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View
            style={[
              StyleSheet.absoluteFill,
              styles.modalBackground,
              { backgroundColor: theme.colors.backdrop },
            ]}
          />
        </TouchableWithoutFeedback>

        <View
          style={[StyleSheet.absoluteFill, styles.modalRoot]}
          pointerEvents="box-none"
        >
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={'padding'}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.dark
                    ? overlay(10, theme.colors.surface)
                    : theme.colors.surface,
                  borderRadius: theme.roundness,
                },
              ]}
            >
              <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  {label.toUpperCase()}
                </Text>
              </View>
              <View style={styles.timePickerContainer}>
                <TimeKeyboard
                  min={min}
                  max={max}
                  textDurationUp={textDurationUp}
                  textDurationDown={textDurationDown}
                  textAfterSecondUp={textAfterSecondUp}
                  textAfterSecondDown={textAfterSecondDown}
                  locale={locale}
                  inputType={inputType}
                  focused={focused}
                  onChange={onChange}
                  onFocusInput={onFocusInput}
                  duration={duration}
                  afterSecond={afterSecond}
                  maxLength={maxLength}
                />
              </View>
              <View style={styles.bottom}>
                <View>{footerLeft}</View>
                <View style={styles.fill} />
                <Button onPress={onDismiss}>{cancelLabel}</Button>
                <Button
                  onPress={() =>
                    onConfirm({
                      afterSecond: localAfterSecond,
                      duration: localDuration,
                    })
                  }
                >
                  {confirmLabel}
                </Button>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalRoot: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  keyboardView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    minWidth: 287,
  },
  labelContainer: {
    height: 28,
    justifyContent: 'flex-end',
    paddingLeft: 24,
    paddingRight: 24,
  },
  label: {
    letterSpacing: 1,
    fontSize: 13,
  },
  timePickerContainer: { padding: 24 },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  inputTypeToggle: { margin: 4 },
  fill: { flex: 1 },
})

export default React.memo(TimeKeyboardModal)
