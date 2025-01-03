import { TestDataset } from '../../types'

const controlRPP = String.raw`<REAPER_PROJECT ...>
  <TRACK {843A0C6F-77E6-4BC7-A79A-0293B19FAA0B}
    NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1
    PEAKCOL 16576
    MUTESOLO 0 0 0
    <ITEM
      POSITION 0
      LENGTH 724.2665
      MUTE 0 0
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      SOFFS 0
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
  >
  </REAPER_PROJECT>`;

  const revisedRPP = String.raw`<REAPER_PROJECT ...>
  <TRACK {A5F8E2DE-F9D0-4018-923C-E167C9472010}
    NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1
    MUTESOLO 0 0 0
    TRACKID {A5F8E2DE-F9D0-4018-923C-E167C9472010}
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 0.95282305462106
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {356CDF7B-8925-4A6D-B8B4-08541524E586}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 4.34375216077248
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {55042F31-36ED-46B7-94C3-4D50B25432EB}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 0.95282305462106
      SNAPOFFS 0
      LENGTH 150.03600584090057
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {2846C574-17A8-4023-9FEA-9F8EBACCCF51}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 0.95282305462106
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {40AA0746-020E-4390-814F-967B1FE16903}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 150.98882889552164
      SNAPOFFS 0
      LENGTH 0.13123318684507
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {8E731B21-ED8C-45DE-BCB8-9E9110D52C5D}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 150.82226369683366
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {5CA69221-7A78-48B3-86C7-617622685E0A}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 151.1200620823667
      SNAPOFFS 0
      LENGTH 4.39415083048712
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {4EF548B8-843C-4A08-8B90-D08A0802AB2C}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 151.1200620823667
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {824457F6-6153-4227-AAFC-D998428EE64F}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 155.51421291285382
      SNAPOFFS 0
      LENGTH 0.18461882817869
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {59AA10B6-36AD-49F0-8DE5-D98AAD947542}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 155.51421291285382
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {9B45411B-4AF8-4643-AF5C-19BF9C368A55}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 155.69883174103251
      SNAPOFFS 0
      LENGTH 0.114029276228
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1.1 0.01 0.01100565535995 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {486B2D85-765C-4F62-A536-65395C490E1F}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 155.7730412700063
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {023486DE-0FB4-432B-BF36-19B418CD7CAD}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 155.80185536190055
      SNAPOFFS 0
      LENGTH 16.90208932375324
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.01100565535995 1 1 0 0
      FADEOUT 1.1 0.01 0.02131358073376 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {928B4F19-51C6-4BBF-A643-78CFBF9A6991}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 155.71350246343638
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {D3D31F9C-E052-4772-BC1A-91F192859E47}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 172.68263110492003
      SNAPOFFS 0
      LENGTH 1.70608449113087
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.02131358073376 1 1 0 0
      FADEOUT 1.1 0.01 0.10547119891191 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {7850DAFE-1560-4922-8194-BB77F50FB3FC}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 172.45218766823081
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {FDF0538A-BB2F-4AA6-B157-EF8CA93E1EC6}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 174.28324439713899
      SNAPOFFS 0
      LENGTH 2.63627746253039
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.10547119891191 1 1 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {61C9338F-FB44-451E-A854-0E48BACA0B0C}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 173.80204778136891
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {2EBCFC5B-409A-46B2-A6D3-A9569255ECAB}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 176.91952185966937
      SNAPOFFS 0
      LENGTH 0.0630096492381
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.00900137846259 0 1 0 0 0
      FADEOUT 1 0.00771546725363 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {6056252B-EC99-4FF3-BA34-3768E9092D83}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 176.38174515070591
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {DF02C78C-6407-4411-8620-62A2D9203B73}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 176.98253150890747
      SNAPOFFS 0
      LENGTH 3.56746849109183
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1.1 0.01 0.04 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {4AC62C7D-55CA-49F3-9E31-08D97FD7EC56}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 176.5013348931374
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {88641D92-5C1C-4A59-B736-BE328E29AD81}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 180.50999999999931
      SNAPOFFS 0
      LENGTH 0.49
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.04 1 1 0 0
      FADEOUT 1.1 0.01 0.03 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {28320A8E-F973-48A6-80A1-BA2BEA6728C1}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 181.9388033842292
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {4D379AB6-F660-4C3F-BE3E-34CD5F97C9AD}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 180.96999999999932
      SNAPOFFS 0
      LENGTH 0.36
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.03 1 1 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {FF455060-C111-498A-B0A2-9DE5BD6895F4}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 180.72880338422925
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {FE9D21C5-A4EA-41F8-89FE-1DA171B52D67}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 181.3299999999993
      SNAPOFFS 0
      LENGTH 5.52
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1.1 0.01 0.03 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {4393222C-1C9E-4875-9BEB-C7327327CE66}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 180.07880338422922
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {5A039F35-4543-40C4-80C7-479C51534372}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 186.81999999999928
      SNAPOFFS 0
      LENGTH 0.89
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.03 1 1 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {F7ABC607-F0B5-4E33-B8F7-A588546F0E9D}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 189.82880338422919
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {ECE8BF1A-8158-46AC-8BD1-445A16DFB94F}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 187.70999999999927
      SNAPOFFS 0
      LENGTH 11.77801114107899
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1.1 0.01 0.028418107645 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {C0A249EA-EB5D-403D-A9E1-389016B81D60}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 185.6588033842292
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {72B42001-BE7C-4293-8173-4A2848CDBFE8}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 199.45959303343326
      SNAPOFFS 0
      LENGTH 10.94146796224061
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.028418107645 1 1 0 0
      FADEOUT 1.1 0.01 0.01407553257931 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {8A31B343-B679-4196-ACDD-9341570ACE44}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 196.95370669534299
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {6FF15ED7-C827-404E-9868-2F53AB08A626}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 210.38698546309456
      SNAPOFFS 0
      LENGTH 4.16635764347868
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.01407553257931 1 1 0 0
      FADEOUT 1.1 0.01 0.02815106515862 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {62C8763F-8874-4A0E-96F8-F1E4CCE35B3E}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 207.6840416688938
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {30534C36-8596-47BA-B0B8-46DBEFC550FC}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 214.52519204141461
      SNAPOFFS 0
      LENGTH 11.86480795858452
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.02815106515862 1 1 0 0
      FADEOUT 1.1 0.01 0.12 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {010A8897-4A38-4461-A62D-D0C075A5FEE1}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 211.52666206304812
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {4910463A-F20A-4BB6-A466-8B6F6EF35CE0}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 226.26999999999913
      SNAPOFFS 0
      LENGTH 4.61277452022478
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.12 1 1 0 0
      FADEOUT 1.1 0.01 0.0166671962354 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {BE77F032-A969-4D6C-B870-2F19F623A30D}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 222.96147002163266
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {FE1DD9A1-9892-479C-9C3E-0980D0695043}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 230.86610732398847
      SNAPOFFS 0
      LENGTH 8.387134585372
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.0166671962354 1 1 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {54524924-6022-443C-99BD-11076A055E01}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 227.26164535776226
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {26E042A1-3A10-4825-9DD0-F207DB798AC1}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 239.25324190936047
      SNAPOFFS 0
      LENGTH 0.30789324605959
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1.1 0.01 0.11104346579199 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {54A8F7B1-C0E1-47FB-92BF-CB8A3ECBCD30}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 235.31060211549504
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {20505214-299C-4AC3-831D-8878BEFC459D}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 239.45009168962807
      SNAPOFFS 0
      LENGTH 14.45859559164936
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.11104346579199 1 1 0 0
      FADEOUT 1.1 0.01 0.2699720226276 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {61C85D44-F5A0-468C-AF2C-FF7BA7E16FE6}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 235.36107641812771
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {2F564366-0DED-4CBB-8CB0-C7FEDCC4540A}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 253.63871525864982
      SNAPOFFS 0
      LENGTH 11.23107878652775
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.2699720226276 1 1 0 0
      FADEOUT 1.1 0.01 0.0466174853795 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {2A8E3142-038E-4A1C-ACD3-72B175F7A650}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 249.07369668409547
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {F6D27EDB-0B29-4083-98BF-4E6DBC6E763F}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 264.82317655979807
      SNAPOFFS 0
      LENGTH 10.01591203827695
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.0466174853795 1 1 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {E18D4CC2-EA27-4C9C-9B64-321F974B46F3}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 259.83142869600039
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {8E03F4F1-2C14-4822-9EAA-4FC76AF28743}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 274.83908859807502
      SNAPOFFS 0
      LENGTH 1.08091140192363
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1.1 0.01 0.02 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {1D5D8EED-3A3A-44C5-81A8-86304D47F7F4}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 269.84734073427734
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {B9BEDE16-25D3-4FEE-8242-114AF0DCA6AB}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 275.89999999999867
      SNAPOFFS 0
      LENGTH 12.94629421808821
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.02 1 1 0 0
      FADEOUT 1.1 0.01 0.1266797932139 1 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {1CF39125-2D3F-4654-A86D-C5D2C6E06683}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 270.40825213620099
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {C102DAA9-040F-46A3-9073-790647D0CBEC}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 288.71961442487202
      SNAPOFFS 0
      LENGTH 155.20178789626652
      LOOP 1
      ALLTAKES 0
      FADEIN 1.1 0.01 0.1266797932139 1 1 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {2AB3B82B-89EE-4CD0-8C32-F58888133293}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 283.35454635428954
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {C730D0E2-9367-4787-B426-848B56566D61}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 443.92140232113854
      SNAPOFFS 0
      LENGTH 2.476064283808
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {A55CA313-2942-4B1E-A104-919B59B8AACC}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 438.55633425055606
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {DADB62CA-7134-4E1A-90F4-BF8E0A190DDF}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 446.39746660494654
      SNAPOFFS 0
      LENGTH 30.11898591662299
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {B71E9456-0DB7-4571-9548-C8BA22D882E3}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 441.03239853436406
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {A28E4125-8549-4B82-8BE4-3B39D08CDE52}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 476.51645252156953
      SNAPOFFS 0
      LENGTH 1.78798262206828
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {EA65EB79-A810-4924-AD65-C466B49EB2EC}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 471.15138445098705
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {0B426F33-D383-4F46-BCD2-47C5B410E12C}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 478.30443514363782
      SNAPOFFS 0
      LENGTH 16.941001411169
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {623E27A3-44FE-48A4-9A2D-DC8402C6C9A2}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 472.93936707305534
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {713B5ABC-F39D-4BAE-94B0-F8B6A3CB1A53}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 495.24543655480682
      SNAPOFFS 0
      LENGTH 0.15022904645895
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {4DC4EC19-3006-4E0F-90DB-A782CF0A9886}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 489.88036848422433
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {743FB61C-2075-43C3-92C8-C9D92DB81E7E}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 495.39566560126576
      SNAPOFFS 0
      LENGTH 163.550561904159
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {6A3F899F-F923-4AB5-ABF1-29D7DCA69F13}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 490.03059753068328
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {CE49344A-9AD0-4052-AA41-6DB6C1883792}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 658.94622750542476
      SNAPOFFS 0
      LENGTH 0.81623646570586
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {A89CD324-B88D-4259-AAE0-B342C85DE427}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 653.58115943484233
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {27CD37F2-C9B9-4418-85D7-5DE34FB13502}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
    <ITEM
      POSITION 659.76246397113061
      SNAPOFFS 0
      LENGTH 69.86910409945108
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {EFDA3F03-94CF-4768-B53D-6D7BF9043D93}
      IID 2
      NAME 06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav
      VOLPAN 1 0 1 -1
      SOFFS 654.39739590054819
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {CD250BE8-3295-4FE9-92D7-217116A18FC3}
      <SOURCE WAVE
        FILE "06_CH03_SUNUS_VISION_MONO_RT_EDIT1.wav"
      >
    >
  >
  <TRACK {AFD7F904-20D7-4070-938B-D5DA876CD2A3}
    NAME "Rev 02"
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0
    FIXEDLANES 9 0 0 0
    SEL 0
    REC 0 0 0 0 0 0 0 0
    VU 2
    TRACKHEIGHT 302 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {AFD7F904-20D7-4070-938B-D5DA876CD2A3}
    PERF 0
    MIDIOUT -1
    MAINSEND 1 0
    <ITEM
      POSITION 442.96172902858513
      SNAPOFFS 0
      LENGTH 2.49544791679102
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {38DA9107-B705-4D66-955A-DDC6933DF8C6}
      IID 35
      NAME 03-241119_2046.wav
      VOLPAN 1 0 1 -1
      SOFFS 0.28821737006206
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {2C9A6D52-12FE-4B35-B73E-4729959CCCBC}
      RECPASS 3
      <SOURCE WAVE
        FILE "03-241119_2046.wav"
      >
    >
    <ITEM
      POSITION 445.45717694537615
      SNAPOFFS 0
      LENGTH 2.80333471314691
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {819D64A7-3707-441F-B584-61D1E28F33A3}
      IID 35
      NAME 03-241119_2046.wav
      VOLPAN 1 0 1 -1
      SOFFS 2.78366528685308
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {2CD33684-1CCE-4F85-B57D-1B492619B64F}
      RECPASS 3
      <SOURCE WAVE
        FILE "03-241119_2046.wav"
      >
    >
    <ITEM
      POSITION 473.13014737910476
      SNAPOFFS 0
      LENGTH 2.25454687170713
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {D4271228-5A24-4ED0-B443-30CD89F0C988}
      IID 37
      NAME 03-241119_2047.wav
      VOLPAN 1 0 1 -1
      SOFFS 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {86CBA8BF-B5AE-4878-B296-A71F7ADD147F}
      RECPASS 4
      <SOURCE WAVE
        FILE "03-241119_2047.wav"
      >
    >
    <ITEM
      POSITION 475.5636294669485
      SNAPOFFS 0
      LENGTH 2.42032796063279
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {1782A8BF-C32B-4B96-AE7C-1AC2EE6023C5}
      IID 37
      NAME 03-241119_2047.wav
      VOLPAN 1 0 1 -1
      SOFFS 2.42904047578469
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {97A0CE04-DCE8-4A8E-B67D-9E21A38D00C7}
      RECPASS 4
      <SOURCE WAVE
        FILE "03-241119_2047.wav"
      >
    >
    <ITEM
      POSITION 494.28982585488944
      SNAPOFFS 0
      LENGTH 0.15301669175528
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {29BB478F-8686-4F49-9FAF-CC59F906983D}
      IID 42
      NAME 03-241119_2049.wav
      VOLPAN 1 0 1 -1
      SOFFS 0.56241714045552
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {3A827B31-95F6-448E-BFA9-37DAC5D828A4}
      RECPASS 5
      <SOURCE WAVE
        FILE "03-241119_2049.wav"
      >
    >
    <ITEM
      POSITION 494.44284254664473
      SNAPOFFS 0
      LENGTH 3.29289950112241
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {F7D787E6-0019-41B0-AC63-57F53CE8D2EB}
      IID 42
      NAME 03-241119_2049.wav
      VOLPAN 1 0 1 -1
      SOFFS 0.71543383221081
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {D530AAF2-20A0-483E-85B9-DD0A603319B5}
      RECPASS 5
      <SOURCE WAVE
        FILE "03-241119_2049.wav"
      >
    >
    <ITEM
      POSITION 654.89532719649458
      SNAPOFFS 0
      LENGTH 3.09807725430926
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {D78C2070-AB32-40A3-975E-3ED9B538B4F8}
      IID 46
      NAME 03-241119_2051.wav
      VOLPAN 1 0 1 -1
      SOFFS 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {B2F993F3-00F9-4A65-9F81-A2E4DD12FFAA}
      RECPASS 6
      <SOURCE WAVE
        FILE "03-241119_2051.wav"
      >
    >
    <ITEM
      POSITION 657.99340445080384
      SNAPOFFS 0
      LENGTH 0.81623646570586
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 0 0
      SEL 0
      IGUID {C9232A78-8F93-4BC8-A373-3BE4F6A8F11B}
      IID 46
      NAME 03-241119_2051.wav
      VOLPAN 1 0 1 -1
      SOFFS 3.09807725430915
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {65C9844B-EB31-412B-891C-4BA4DABACF32}
      RECPASS 6
      <SOURCE WAVE
        FILE "03-241119_2051.wav"
      >
    >
    <ITEM
      POSITION 658.80964091650958
      SNAPOFFS 0
      LENGTH 1.37401961331841
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0.01 0 1 0 0 0
      FADEOUT 1 0.01 0 1 0 0 0
      MUTE 1 0
      SEL 0
      IGUID {A86555B7-8C0D-44DF-8D5D-01F6A46CC5C0}
      IID 46
      NAME 03-241119_2051.wav
      VOLPAN 1 0 1 -1
      SOFFS 3.914313720015
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {F807622B-8571-457F-AC3A-BA92B57E2D08}
      RECPASS 6
      <SOURCE WAVE
        FILE "03-241119_2051.wav"
      >
    >
  >
  </REAPER_PROJECT>`

  export const doubleTrackDataset: TestDataset = {
    id: 'double-tracks',
    name: 'Double Tracks',
    description: 'Multitrack audiobook chapter, with original recordings on track 1 and pickups on track 2',
    controlData: controlRPP,
    revisedData: revisedRPP
  } as const satisfies TestDataset