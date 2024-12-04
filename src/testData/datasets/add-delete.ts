import { TestDataset } from '../../types'

const controlRPP = String.raw`<REAPER_PROJECT ...>
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 6.18
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 11.8265
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 6.17999999993482
      SNAPOFFS 0
      LENGTH 0.54
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 23.6065
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 6.71999999997207
      LENGTH 2.3171048507069
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 28.68828831802896
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 9.03710485067897
      LENGTH 11.53775672709548
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 28.5336048507069
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 20.57486157777445
      LENGTH 2.57789208881548
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 40.07136157780238
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 23.15275366658993
      LENGTH 6.03967834653231
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 43.38303568440803
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 29.19243201315366
      LENGTH 13.62886115518449
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 52.64297453890797
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 42.85
      LENGTH 13.2
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 73.45092844253824
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 56.05
      LENGTH 44.06005745090268
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 87.2108967038929
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
  </REAPER_PROJECT>`;

const revisedRPP = String.raw`<REAPER_PROJECT ...>
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 3.18
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 11.8265
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 3.18
      SNAPOFFS 0
      LENGTH 2.99999999993482
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 11.8265
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 6.17999999993482
      SNAPOFFS 0
      LENGTH 0.54
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 23.6065
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 6.71999999997207
      LENGTH 2.3171048507069
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 28.68828831802896
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 9.03710485067897
      LENGTH 11.53775672709548
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 28.5336048507069
      <SOURCE WAVE
        FILE "01-241016_2016-b.wav"
      >
    >
    <ITEM
      POSITION 20.57486157777445
      LENGTH 2.57789208881548
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 40.07136157780238
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 23.15275366658993
      LENGTH 6.03967834653231
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 43.38303568440803
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 35.19243201315366
      LENGTH 13.62886115518449
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 52.64297453890797
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 42.85
      LENGTH 13.2
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 73.45092844253824
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
    <ITEM
      POSITION 56.05
      LENGTH 44.06005745090268
      MUTE 0 0
      NAME 01-241016_2016.wav
      SOFFS 87.2108967038929
      <SOURCE WAVE
        FILE "01-241016_2016.wav"
      >
    >
  </REAPER_PROJECT>`;

export const addDeleteDataset: TestDataset = {
  id: 'add-delete',
  name: 'Add/Delete Test',
  description: 'Tests addition and deletion of clips',
  controlData: controlRPP,
  revisedData: revisedRPP
} as const satisfies TestDataset