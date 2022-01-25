import weatherIcons from './icons'

export type IconMap = {
  icon: number
  day?: number
  night?: number
  sub?: ConditionsMap
}

export type ConditionsMap = {
  [key: string]: IconMap
}

export default {
  ['tornado']: {
    icon: weatherIcons.twister,
  },
  ['lightning']: {
    icon: weatherIcons.lightning,
  },
  ['storm']: {
    icon: weatherIcons.stormyClouds,
  },
  ['fog']: {
    icon: weatherIcons.fog,
    night: weatherIcons.fogNight,
    sub: {
      ['cloud']: {
        icon: weatherIcons.fogCloudy,
      },
    },
  },
  ['snow']: {
    icon: weatherIcons.snowFlake,
    day: weatherIcons.snowSun,
    night: weatherIcons.snowyNight,
    sub: {
      ['cloud']: {
        icon: weatherIcons.snowCloudy,
      },
    },
  },
  ['rain']: {
    icon: weatherIcons.rainCloudy,
    night: weatherIcons.rainyNight,
    sub: {
      ['cloud']: {
        icon: weatherIcons.rainCloudy,
      },
      ['sun']: {
        icon: weatherIcons.rainSun,
      },
    },
  },
  ['cloud']: {
    icon: weatherIcons.clouds,
    sub: {
      ['partly']: {
        icon: weatherIcons.partlyCloudy,
      },
    },
  },
  ['clear']: {
    icon: weatherIcons.sun,
    night: weatherIcons.moon,
  },
  ['wind']: {
    icon: weatherIcons.wind,
  },
} as ConditionsMap
