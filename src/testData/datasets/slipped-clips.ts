import { TestDataset } from '../../types'

const controlRPP = String.raw`<REAPER_PROJECT ...>
    <ITEM
      CHANGE deleted in revised
      POSITION 0
      SNAPOFFS 0
      LENGTH 6.18
      NAME 01-241016_2016.wav
      SOFFS 11.8265
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 6.17
      SNAPOFFS 0
      LENGTH 0.54
      NAME 01-241016_2016.wav
      SOFFS 23.6065
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 6.8
      SNAPOFFS 0
      LENGTH 2.3171048507069
      NAME 01-241016_2016.wav
      SOFFS 28.68828831802896
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      CHANGE offset value
      POSITION 9.03
      SNAPOFFS 0
      LENGTH 11.53775672709548
      NAME 01-241016_2016.wav
      SOFFS 28.5336048507069
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 20.57486157777445
      SNAPOFFS 0
      LENGTH 2.57789208881548
      NAME 01-241016_2016.wav
      SOFFS 40.07136157780238
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 23.15275366658993
      SNAPOFFS 0
      LENGTH 6.03967834653231
      NAME 01-241016_2016.wav
      SOFFS 43.38303568440803
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      CHANGE offset value
      POSITION 29.19243201315366
      SNAPOFFS 0
      LENGTH 13.62886115518449
      NAME 01-241016_2016.wav
      SOFFS 52.64297453890797
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      CHANGE length value shortened
      POSITION 42.8
      SNAPOFFS 0
      LENGTH 13.7
      NAME 01-241016_2016.wav
      SOFFS 73.45092844253824
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      CHANGE removed
      POSITION 55.21694434225067
      SNAPOFFS 0
      LENGTH 44.06005745090268
      NAME 01-241016_2016.wav
      SOFFS 87.2108967038929
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
  </REAPER_PROJECT>`;

const revisedRPP = String.raw`<REAPER_PROJECT ...>

    <ITEM
      POSITION 6.17
      SNAPOFFS 0
      LENGTH 0.54
      NAME 01-241016_2016.wav
      SOFFS 23.6065
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 6.8
      SNAPOFFS 0
      LENGTH 2.3171048507069
      NAME 01-241016_2016.wav
      SOFFS 28.68828831802896
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 9.03
      SNAPOFFS 0
      LENGTH 11.53775672709548
      NAME 01-241016_2016.wav
      SOFFS 20
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 20.57486157777445
      SNAPOFFS 0
      LENGTH 2.57789208881548
      NAME 01-241016_2016.wav
      SOFFS 40.07136157780238
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 23.15275366658993
      SNAPOFFS 0
      LENGTH 6.03967834653231
      NAME 01-241016_2016.wav
      SOFFS 43.38303568440803
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 29.19243201315366
      SNAPOFFS 0
      LENGTH 13.62886115518449
      NAME 01-241016_2016.wav
      SOFFS 12
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 42.8
      SNAPOFFS 0
      LENGTH 13.7
      NAME 01-241016_2016.wav
      SOFFS 73.45092844253824
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 80
      SNAPOFFS 0
      LENGTH 24
      NAME 01-241016_2016.wav
      SOFFS 87.2108967038929
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 107
      SNAPOFFS 0
      LENGTH 10
      NAME 01-241016_2016.wav
      SOFFS 10
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
  </REAPER_PROJECT>`;

export const slippedClipsDataset: TestDataset = {
  id: 'slipped-clips',
  name: 'Slipped Clips Test',
  description: 'Tests clips with content that has slipped in position',
  controlData: controlRPP,
  revisedData: revisedRPP
} as const satisfies TestDataset