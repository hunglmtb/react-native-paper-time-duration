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

import { Button, IconButton, overlay, useTheme } from 'react-native-paper'
import TimePicker from './TimePicker'
import {
  clockTypes,
  inputTypeIcons,
  inputTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  reverseInputTypes,
} from './timeUtils'

const supportedOrientations: any[] = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
]

export function TimePickerModal({
  visible,
  onDismiss,
  onConfirm,
  hours,
  minutes,
  endHours,
  endMinutes,
  label = 'Select time',
  cancelLabel = 'Cancel',
  confirmLabel = 'Ok',
  animationType = 'none',
  textTimeStart = 'Bắt đầu',
  textTimeEnd = 'Kết thúc',
  textDuration = 'Thời lượng',
  locale,
  duration,
}: {
  locale?: undefined | string
  label?: string
  cancelLabel?: string
  confirmLabel?: string
  textTimeStart?: string
  textTimeEnd?: string
  textDuration?: string
  hours?: number | undefined
  minutes?: number | undefined
  endHours?: number | undefined
  endMinutes?: number | undefined
  visible: boolean | undefined
  onDismiss: () => any
  onConfirm: ({
    hours,
    minutes,
    endHours,
    endMinutes,
    duration,
  }: {
    hours: number
    minutes: number
    endHours: number
    endMinutes: number
    duration: number
  }) => any
  animationType?: 'slide' | 'fade' | 'none'
  duration?: number
}) {
  const theme = useTheme()

  const [inputType, setInputType] = React.useState<PossibleInputTypes>(
    inputTypes.picker
  )
  const [focused, setFocused] = React.useState<PossibleClockTypes>(
    clockTypes.hours
  )
  const [localHours, setLocalHours] = React.useState<number>(getHours(hours))
  const [localMinutes, setLocalMinutes] = React.useState<number>(
    getMinutes(minutes)
  )
  const [localEndHours, setLocalEndHours] = React.useState<number>(
    getHours(endHours)
  )
  const [localEndMinutes, setLocalEndMinutes] = React.useState<number>(
    getMinutes(endMinutes)
  )
  const [localDuration, setLocalDuration] = React.useState<number>(0)

  React.useEffect(() => {
    setLocalHours(getHours(hours))
  }, [setLocalHours, hours])

  React.useEffect(() => {
    setLocalMinutes(getMinutes(minutes))
  }, [setLocalMinutes, minutes])

  React.useEffect(() => {
    setLocalEndHours(getHours(endHours))
  }, [setLocalEndHours, endHours])

  React.useEffect(() => {
    setLocalEndMinutes(getMinutes(endMinutes))
  }, [setLocalEndMinutes, endMinutes])

  React.useEffect(() => {
    setLocalDuration(duration || 0)
  }, [setLocalDuration, duration])

  const onFocusInput = React.useCallback(
    (type: PossibleClockTypes) => setFocused(type),
    []
  )
  const onChange = React.useCallback(
    (params: {
      focused?: PossibleClockTypes | undefined
      hours: number
      minutes: number
      endHours?: number
      endMinutes?: number
      duration?: number
    }) => {
      if (params.focused) {
        setFocused(params.focused)
      }

      setLocalHours(params.hours)
      setLocalMinutes(params.minutes)
      setLocalEndHours(params.endHours || 0)
      setLocalEndMinutes(params.endMinutes || 0)
      setLocalDuration(params.duration || 0)
    },
    [setFocused, setLocalHours, setLocalMinutes, setLocalDuration]
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
                <TimePicker
                  locale={locale}
                  inputType={inputType}
                  focused={focused}
                  textTimeStart={textTimeStart}
                  textTimeEnd={textTimeEnd}
                  textDuration={textDuration}
                  hours={localHours}
                  minutes={localMinutes}
                  endHours={localEndHours}
                  endMinutes={localEndMinutes}
                  onChange={onChange}
                  onFocusInput={onFocusInput}
                  duration={duration}
                />
              </View>
              <View style={styles.bottom}>
                <IconButton
                  icon={inputTypeIcons[reverseInputTypes[inputType]]}
                  onPress={() => setInputType(reverseInputTypes[inputType])}
                  size={24}
                  style={styles.inputTypeToggle}
                  accessibilityLabel="toggle keyboard"
                />
                <View style={styles.fill} />
                <Button onPress={onDismiss}>{cancelLabel}</Button>
                <Button
                  onPress={() =>
                    onConfirm({
                      hours: localHours,
                      minutes: localMinutes,
                      endHours: localEndHours,
                      endMinutes: localEndMinutes,
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

function getMinutes(minutes: number | undefined | null): number {
  return minutes === undefined || minutes === null
    ? new Date().getMinutes()
    : minutes
}
function getHours(hours: number | undefined | null): number {
  return hours === undefined || hours === null ? new Date().getHours() : hours
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

export default React.memo(TimePickerModal)
