import * as React from 'react'

export interface ITimeKeyboardModalProps {
  locale?: undefined | string
  label?: string
  minDuration?: number
  maxDuration?: number
  minAfterSeconds?: number
  maxAfterSeconds?: number
  turnOnTime?: number
  turnOffTime?: number
  footerLeft?: string | React.ReactNode
  cancelLabel?: string
  confirmLabel?: string
  textDurationUp?: string | React.ReactNode
  textDurationDown?: string | React.ReactNode
  textAfterSecondUp?: string | React.ReactNode
  textAfterSecondDown?: string | React.ReactNode
  textTurnOnTimeUp?: string | React.ReactNode
  textTurnOnTimeDown?: string | React.ReactNode
  textTurnOffTimeUp?: string | React.ReactNode
  textTurnOffTimeDown?: string | React.ReactNode
  hours?: number | undefined
  minutes?: number | undefined
  visible: boolean | undefined
  onDismiss: () => any
  onConfirm: ({
    afterSecond,
    duration,
    turnOnTime,
    turnOffTime,
  }: {
    afterSecond: number
    duration: number
    turnOnTime: number | undefined
    turnOffTime: number | undefined
  }) => any
  animationType?: 'slide' | 'fade' | 'none'
  duration?: number | undefined
  afterSecond?: number
  maxLength?: number
}

export interface ITimePickerModalProps {
  locale?: undefined | string
  enableEndltStart?: boolean
  pickerType?: 'picker' | 'keyboard'
  iconToggle?: string | React.ReactNode
  footerLeft?: string | React.ReactNode
  label?: string
  cancelLabel?: string
  confirmLabel?: string
  textTimeStart?: string
  textTimeEnd?: string
  textDuration?: string
  hours?: number | undefined
  minutes?: number | undefined
  seconds?: number | undefined
  endHours?: number | undefined
  endMinutes?: number | undefined
  endSeconds?: number | undefined
  visible: boolean | undefined
  onDismiss: () => any
  onConfirm: ({
    hours,
    minutes,
    seconds,
    endHours,
    endMinutes,
    endSeconds,
    duration,
  }: {
    hours?: number
    minutes?: number
    seconds?: number
    endHours?: number
    endMinutes?: number
    endSeconds?: number
    duration: number
  }) => any
  animationType?: 'slide' | 'fade' | 'none'
  duration?: number
}
