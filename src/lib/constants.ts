// format:  PREFIX_TOPIC
// example: A_TEST

// prefix meanings:
// B = both
// I = iot
// A = app
export enum MqttTopics {
  // pressing the button on iot
  I_PRESS = 'I_PRESS',

  // pressing the ring button on application
  A_RING = 'A_RING',

  // trigger sync on both iot and application
  B_SYNC = 'B_SYNC',

  // syncing data on iot
  // format:  r
  // example: 0
  I_SYNC = 'I_SYNC',

  // syncing data on application
  // make a request which will revalidate the
  // list of devices and their informations
  A_SYNC = 'A_SYNC',
}

export enum NavigationContents {
  learn,
  devices,
}

export const medications: Array<{ name: string; actuations: number[] }> = [
  {
    name: 'Advair Diskus',
    actuations: [60],
  },
  {
    name: 'Symbicort Inhaler',
    actuations: [120, 160],
  },
  {
    name: 'QVAR Inhaler',
    actuations: [200],
  },
  {
    name: 'Ventolin (Albuterol)',
    actuations: [200],
  },
  {
    name: 'ProAir (Albuterol)',
    actuations: [200],
  },
  {
    name: 'Xopenex (Levalbuterol)',
    actuations: [200],
  },
  {
    name: 'Flovent HFA Inhaler',
    actuations: [120, 240],
  },
];

export const levels: Array<{
  color: string;
  min: number;
}> = [
  {
    color: 'green',
    min: 0,
  },
  {
    color: 'blue',
    min: 61,
  },
  {
    color: 'yellow',
    min: 121,
  },
  {
    color: 'orange',
    min: 161,
  },
  {
    color: 'red',
    min: 201,
  },
];
