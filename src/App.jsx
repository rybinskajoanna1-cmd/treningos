import React, { useState, useEffect, useRef } from 'react';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  Check,
  Video,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trophy,
  Flame,
  Copy,
  CheckCircle2,
  Volume2,
  VolumeX,
  Trash2,
  Upload,
  Download,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Scale,
  AlertTriangle,
  HelpCircle,
  Film,
  Share2,
  Activity
} from 'lucide-react';

// --- BAZA DANYCH PLANU TRENINGOWEGO OD PAWŁA ---
const WORKOUT_PLAN = {
  1: {
    id: 1,
    title: 'Trening 1: Nogi i Core',
    subtitle: 'Siła dolnych partii, stabilizacja i SkiErg EMOM',
    warmup: [
      {
        id: 't1_w1',
        name: '1. Deep squat to stand',
        animType: 'squat',
        equipment: 'none',
        sets: 2,
        reps: '15',
        notes: 'Spokojne, kontrolowane ruchy',
        unilateral: false,
        muscles: 'Mobilność bioder, dwugłowe uda, odcinek piersiowy',
        activeZones: ['quads', 'glutes', 'hamstrings'],
        cues: [
          'Złap za czubki butów i zejdź do głębokiego przysiadu z prostymi plecami.',
          'Rozpychaj kolana łokciami na zewnątrz i otwórz klatkę piersiową.',
          'Wyprostuj kolana unosząc biodra wysoko w górę bez puszczania stóp.'
        ],
        ytQuery: 'deep squat to stand mobility exercise'
      },
      {
        id: 't1_w2',
        name: '2. Cossack squat',
        animType: 'lunge',
        equipment: 'none',
        sets: 2,
        reps: '10',
        notes: 'Na każdą nogę',
        unilateral: true,
        muscles: 'Przywodziciele, mobilność stawu skokowego i biodra',
        activeZones: ['quads', 'glutes'],
        cues: [
          'Stań bardzo szeroko i przenieś ciężar ciała na jedną nogę, schodząc nisko.',
          'Druga noga pozostaje całkowicie prosta, palce stopy skieruj w stronę sufitu.',
          'Cała stopa nogi pracującej jest przyklejona do podłogi.'
        ],
        ytQuery: 'cossack squat form technique'
      },
      {
        id: 't1_w3',
        name: '3. Glute crusher',
        animType: 'hip_thrust',
        equipment: 'none',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        unilateral: true,
        muscles: 'Pośladkowy średni i wielki, otwarcie biodra',
        activeZones: ['glutes', 'core'],
        cues: [
          'Aktywuj pośladek w pełnym zakresie ruchu, pilnując stabilnej miednicy.',
          'Przytrzymaj szczytowe napięcie przez 1 sekundę w każdym powtórzeniu.'
        ],
        ytQuery: 'glute activation warmup mobility'
      },
      {
        id: 't1_w4',
        name: '4. Pallof press',
        animType: 'standing_push_pull',
        equipment: 'cable',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        unilateral: true,
        muscles: 'Core – antyrotacja, mięśnie skośne brzucha',
        activeZones: ['core', 'shoulders'],
        cues: [
          'Stań bokiem do wyciągu lub gumy zaczepionej na wysokości mostka.',
          'Wyciśnij uchwyt przed klatkę piersiową i nie pozwól, by guma skręciła Twój tułów.',
          'Trzymaj żebra ściągnięte w dół i napięte pośladki.'
        ],
        ytQuery: 'pallof press band cable form'
      },
      {
        id: 't1_w5',
        name: '5. Exercise ball hamstring curl',
        animType: 'ball_curl',
        equipment: 'ball',
        sets: 2,
        reps: '10-15',
        notes: 'Utrzymuj biodra wysoko',
        unilateral: false,
        muscles: 'Mięśnie dwugłowe uda, pośladki, stabilizacja',
        activeZones: ['hamstrings', 'glutes', 'core'],
        cues: [
          'Połóż się na plecach, pięty wbij w piłkę gimnastyczną.',
          'Unieś biodra wysoko i przyciągnij piłkę piętami pod pośladki.',
          'Nie opuszczaj bioder podczas prostowania nóg.'
        ],
        ytQuery: 'stability ball hamstring curl'
      },
      {
        id: 't1_w6',
        name: '6. Ergometr wioślarski',
        animType: 'rower',
        equipment: 'rower',
        sets: 1,
        reps: '200 m',
        notes: 'Średnie tempo',
        unilateral: false,
        muscles: 'Całe ciało – podniesienie tętna',
        activeZones: ['quads', 'back', 'core'],
        cues: [
          'Kolejność przyciągania: mocne odepchnięcie nogami -> odchylenie tułowia -> dociągnięcie rąk.',
          'Powrót: najpierw wyprostuj ręce, pochyl tułów, dopiero na końcu ugnij kolana.'
        ],
        ytQuery: 'concept2 rowing technique proper form'
      }
    ],
    main: [
      {
        id: 't1_m1',
        name: '1. Goblet squat',
        animType: 'squat',
        equipment: 'kb_chest',
        sets: 3,
        reps: '10-12',
        targetMaxReps: 12,
        rest: 90,
        notes: 'Trzymaj ciężar blisko klatki',
        unilateral: false,
        barbell: false,
        muscles: 'Czworogłowe uda, pośladki, core',
        activeZones: ['quads', 'glutes', 'core'],
        cues: [
          'Trzymaj kettlebell lub hantla pionowo tuż przy mostku, łokcie skierowane w dół.',
          'Zejdź w dół poniżej kąta prostego w kolanach, utrzymując neutralny kręgosłup.',
          'Wstawaj dynamicznie, pchając całą powierzchnią stopy w podłogę.'
        ],
        ytQuery: 'goblet squat proper form dumbbell kettlebell'
      },
      {
        id: 't1_m2',
        name: '2. Halo plate',
        animType: 'overhead',
        equipment: 'plate',
        sets: 3,
        reps: '10-12',
        targetMaxReps: 12,
        rest: 60,
        notes: 'Krążenia talerzem; na stronę',
        unilateral: true,
        barbell: false,
        muscles: 'Obręcz barkowa, stabilizacja core',
        activeZones: ['shoulders', 'core'],
        cues: [
          'Złap talerz oburącz i wykonuj ciasne krążenia wokół głowy tuż nad uszami i karkiem.',
          'Trzymaj brzuch i pośladki mocno spięte – klatka i biodra stoją nieruchomo.'
        ],
        ytQuery: 'plate halo exercise form'
      },
      {
        id: 't1_m3',
        name: '3. Walking lunges',
        animType: 'lunge',
        equipment: 'db_sides',
        sets: 3,
        reps: '8-10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Wykroki chodzone; na nogę',
        unilateral: true,
        barbell: false,
        muscles: 'Pośladki, czworogłowe uda, równowaga pod Hyrox',
        activeZones: ['quads', 'glutes'],
        cues: [
          'Stawiaj kroki na szerokość bioder (jak po szynach kolejowych, nie po jednej linii).',
          'Tylne kolano delikatnie zbliża się do ziemi, przednie kolano stabilne nad stopą.',
          'Wychodź w górę z przedniej pięty i śródstopia.'
        ],
        ytQuery: 'dumbbell walking lunges proper form'
      },
      {
        id: 't1_m4',
        name: '4. Single leg KB RDL',
        animType: 'single_rdl',
        equipment: 'kb_low',
        sets: 3,
        reps: '8-10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Martwy ciąg jednonóż; na nogę',
        unilateral: true,
        barbell: false,
        muscles: 'Dwugłowy uda, pośladek, stabilizacja stawu skokowego',
        activeZones: ['hamstrings', 'glutes', 'back'],
        cues: [
          'Lekko odblokuj kolano nogi postawnej i cofaj biodro w tył jak przy zamykaniu drzwi pośladkiem.',
          'Wolna noga unosi się w tył w jednej linii z prostymi plecami.',
          'Nie otwieraj biodra na bok – oba kolce biodrowe patrzą w podłogę.'
        ],
        ytQuery: 'single leg kettlebell rdl form'
      },
      {
        id: 't1_m5',
        name: '5. Windmill',
        animType: 'windmill',
        equipment: 'kb_overhead',
        sets: 3,
        reps: '8-10',
        targetMaxReps: 10,
        rest: 60,
        notes: 'Wiatrak; na stronę',
        unilateral: true,
        barbell: false,
        muscles: 'Mięśnie skośne brzucha, stabilizacja barku, mobilność biodra',
        activeZones: ['core', 'shoulders', 'glutes'],
        cues: [
          'Stopy ustaw pod kątem 45 stopni w stronę przeciwną do uniesionego ciężaru.',
          'Wypchnij biodro w bok nad tylną nogę, zsuwając wolną dłoń po wewnętrznej stronie przedniej nogi.',
          'Cały czas patrz wzrokiem na ciężar nad głową.'
        ],
        ytQuery: 'kettlebell windmill tutorial form'
      },
      {
        id: 't1_m6',
        name: '6. [A1] Copenhagen adduction',
        animType: 'plank_side',
        equipment: 'bench',
        sets: 3,
        reps: '20-30s',
        targetMaxReps: 30,
        rest: 0,
        notes: 'Superseria z A2; na stronę',
        unilateral: true,
        barbell: false,
        superset: 'A1 -> od razu przejdź do A2 (0s przerwy)',
        muscles: 'Przywodziciele uda, mięśnie skośne brzucha',
        activeZones: ['core', 'quads'],
        cues: [
          'Oprzyj się na przedramieniu bokiem, górną nogę oprzyj na ławce.',
          'Unieś biodra tak, aby ciało tworzyło jedną prostą linię i utrzymaj izometrycznie 20-30s.'
        ],
        ytQuery: 'copenhagen plank adduction exercise'
      },
      {
        id: 't1_m7',
        name: '7. [A2] Side lying hip adduction',
        animType: 'plank_side',
        equipment: 'none',
        sets: 3,
        reps: '15',
        targetMaxReps: 15,
        rest: 60,
        notes: 'Przywodzenie; na stronę',
        unilateral: true,
        barbell: false,
        superset: 'A2 -> po wykonaniu obu stron 60s przerwy',
        muscles: 'Przywodziciele uda',
        activeZones: ['quads', 'core'],
        cues: [
          'Połóż się na boku, górną nogę postaw przed sobą, a dolną prostą unoś jak najwyżej w górę.',
          'Kontroluj ruch opuszczania przez 2 sekundy.'
        ],
        ytQuery: 'side lying hip adduction exercise'
      }
    ],
    finisher: {
      type: 'EMOM',
      title: 'Finisher: EMOM 5 minut (SkiErg)',
      durationMinutes: 5,
      description: 'W każdej minucie wykonaj 4 kcal na SkiErg. Pracujesz maksymalnie 60 sekund w rundzie (jeśli skończysz szybciej, reszta minuty to Twoja przerwa).',
      tasks: ['4 kcal na SkiErg w każdej rozpoczętej minucie (5 rund)']
    }
  },
  2: {
    id: 2,
    title: 'Trening 2: Góra Ciała',
    subtitle: 'Siła pchania i przyciągania + obwody kondycyjne',
    warmup: [
      {
        id: 't2_w1',
        name: '1. Thread the needle',
        animType: 'quadruped',
        equipment: 'none',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        unilateral: true,
        muscles: 'Rotacja odcinka piersiowego kręgosłupa',
        activeZones: ['back', 'shoulders'],
        cues: [
          'W klęku podpartym wsuń jedną rękę pod pachą drugiej, kładąc bark i skroń na macie.',
          'Następnie otwórz klatkę wysoko do sufitu, prowadząc wzrok za dłonią.'
        ],
        ytQuery: 'thread the needle thoracic mobility'
      },
      {
        id: 't2_w2',
        name: '2. Kneeling lat stretch on bench',
        animType: 'quadruped',
        equipment: 'bench',
        sets: 2,
        reps: '10',
        notes: 'Z użyciem kijka (stick)',
        unilateral: false,
        muscles: 'Najszerszy grzbietu, mobilność barków nad głową',
        activeZones: ['back', 'shoulders'],
        cues: [
          'Złap kijek podchwytem, oprzyj łokcie na ławce i cofnij biodra do pięt.',
          'Opuść klatkę piersiową w dół między ramiona, rozciągając boki pleców.'
        ],
        ytQuery: 'kneeling lat stretch bench dowel'
      },
      {
        id: 't2_w3',
        name: '3. 90-90 stretch',
        animType: 'squat',
        equipment: 'none',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        unilateral: true,
        muscles: 'Rotacja wewnętrzna i zewnętrzna bioder',
        activeZones: ['glutes'],
        cues: [
          'Usiądź z obiema nogami ugiętymi pod kątem 90 stopni.',
          'Przekładaj kolana płynnie z jednej strony na drugą, trzymając wyprostowany tułów.'
        ],
        ytQuery: '90 90 hip switch mobility'
      },
      {
        id: 't2_w4',
        name: '4. Scapula pull-up',
        animType: 'pull_vertical',
        equipment: 'pullup_bar',
        sets: 2,
        reps: '10',
        notes: 'Aktywne zwisy na drążku',
        unilateral: false,
        muscles: 'Dolny czworoboczny, aktywacja łopatek',
        activeZones: ['back', 'shoulders'],
        cues: [
          'Zawiśnij na drążku na całkowicie prostych łokciach.',
          'Bez uginania ramion ściągnij łopatki mocno w dół (oddal barki od uszu) i przytrzymaj.'
        ],
        ytQuery: 'scapular pull ups technique'
      },
      {
        id: 't2_w5',
        name: '5. Koci grzbiet',
        animType: 'quadruped',
        equipment: 'none',
        sets: 2,
        reps: '10',
        notes: 'Płynne przejścia',
        unilateral: false,
        muscles: 'Mobilność całego kręgosłupa (Cat-Cow)',
        activeZones: ['back', 'core'],
        cues: [
          'Z wydechem zaokrąglij mocno plecy chowając głowę i podwijając miednicę.',
          'Z wdechem powoli otwórz klatkę piersiową do przodu.'
        ],
        ytQuery: 'cat cow stretch spine mobility'
      }
    ],
    main: [
      {
        id: 't2_m1',
        name: '1. Bench press',
        animType: 'bench_press',
        equipment: 'barbell',
        sets: 3,
        reps: '8-10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Wyciskanie leżąc na ławce',
        unilateral: false,
        barbell: true,
        muscles: 'Klatka piersiowa, przedni akton barku, triceps',
        activeZones: ['chest', 'shoulders', 'arms'],
        cues: [
          'Ściągnij łopatki razem i w dół wbijając je w ławkę, stopy wbij stabilnie w podłogę.',
          'Opuszczaj sztangę pod kontrolą na dolną część mostka (łokcie pod kątem ok. 45-60°).',
          'Wyciskaj dynamicznie w górę bez odrywania pośladków od ławki.'
        ],
        ytQuery: 'barbell bench press proper form'
      },
      {
        id: 't2_m2',
        name: '2. Gorilla row alt',
        animType: 'hinge_row',
        equipment: 'kb_low',
        sets: 3,
        reps: '10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Wiosłowanie; na stronę',
        unilateral: true,
        barbell: false,
        muscles: 'Najszerszy grzbietu, czworoboczny, stabilizacja tułowia',
        activeZones: ['back', 'arms', 'core'],
        cues: [
          'Stań w szerokim rozkroku nad dwoma kettlebellami w pozycji hip hinge (proste plecy).',
          'Jedna ręka mocno wciska uchwyt pierwszego KB w ziemię, podczas gdy druga wiosłuje do biodra.'
        ],
        ytQuery: 'kettlebell gorilla row form'
      },
      {
        id: 't2_m3',
        name: '3. Hip thrust',
        animType: 'hip_thrust',
        equipment: 'barbell',
        sets: 3,
        reps: '10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Pełen wyprost bioder, dopięcie',
        unilateral: false,
        barbell: true,
        muscles: 'Mięśnie pośladkowe, dwugłowe uda',
        activeZones: ['glutes', 'hamstrings'],
        cues: [
          'Oprzyj dolny kąt łopatek o krawędź ławki, wzrok skieruj przed siebie (broda przyciągnięta).',
          'W górze piszczele mają być pionowo (kąt 90° w kolanach) – przytrzymaj mocne dopięcie pośladków przez 1-2s.'
        ],
        ytQuery: 'barbell hip thrust technique'
      },
      {
        id: 't2_m4',
        name: '4. Lateral raises',
        animType: 'lateral_raise',
        equipment: 'db_sides',
        sets: 3,
        reps: '20',
        targetMaxReps: 20,
        rest: 60,
        notes: 'Wznosy bokiem; mniejszy ciężar',
        unilateral: false,
        barbell: false,
        muscles: 'Boczny akton mięśni naramiennych (barki)',
        activeZones: ['shoulders'],
        cues: [
          'Unoś hantle lekko po skosie przed sobą (w płaszczyźnie łopatki), jakbyś chciała sięgnąć nimi daleko do ścian.',
          'Nie bujaj tułowiem – pełna kontrola przy wysokich 20 powtórzeniach.'
        ],
        ytQuery: 'dumbbell lateral raise proper form'
      },
      {
        id: 't2_m5',
        name: '5. Step up on box',
        animType: 'lunge',
        equipment: 'box',
        sets: 3,
        reps: '10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Wejścia na skrzynię; na nogę',
        unilateral: true,
        barbell: false,
        muscles: 'Pośladek, czworogłowy uda',
        activeZones: ['glutes', 'quads'],
        cues: [
          'Postaw całą stopę na skrzyni, pochyl lekko tułów i wejdź w górę wyłącznie siłą nogi górnej.',
          'Nie odbijaj się z palców nogi stojącej na podłodze i schodź w dół bardzo powoli (2-3s).'
        ],
        ytQuery: 'dumbbell box step up glute quad form'
      },
      {
        id: 't2_m6',
        name: '6. [A1] Biceps (sztanga)',
        animType: 'arm_curl',
        equipment: 'barbell',
        sets: 3,
        reps: '10-12',
        targetMaxReps: 12,
        rest: 0,
        notes: 'Superseria z A2',
        unilateral: false,
        barbell: true,
        superset: 'A1 -> po zakończeniu od razu przejdź do A2 (0s przerwy)',
        muscles: 'Mięsień dwugłowy ramienia (biceps)',
        activeZones: ['arms'],
        cues: [
          'Trzymaj łokcie przyklejone do boków tułowia przez cały zakres ruchu.',
          'Opuszczaj sztangę do pełnego wyprostu bez bujania plecami.'
        ],
        ytQuery: 'barbell bicep curl proper form'
      },
      {
        id: 't2_m7',
        name: '7. [A2] Triceps (linka)',
        animType: 'tricep_pushdown',
        equipment: 'cable',
        sets: 3,
        reps: '10-12',
        targetMaxReps: 12,
        rest: 60,
        notes: 'Prostowanie z wyciągu',
        unilateral: false,
        barbell: false,
        superset: 'A2 -> po zakończeniu 60s przerwy przed kolejną superserią',
        muscles: 'Mięsień trójgłowy ramienia (triceps)',
        activeZones: ['arms'],
        cues: [
          'Zablokuj łokcie nieruchomo przy żebrach i prostuj przedramiona do końca.',
          'Na samym dole rozdziel końcówki sznura na zewnątrz, mocno dopinając triceps.'
        ],
        ytQuery: 'tricep rope pushdown form'
      },
      {
        id: 't2_m8',
        name: '8. Martwy robak (Dead bug)',
        animType: 'dead_bug',
        equipment: 'none',
        sets: 2,
        reps: '15 (max)',
        targetMaxReps: 15,
        rest: 60,
        notes: 'Dociskaj lędźwie do maty',
        unilateral: false,
        barbell: false,
        muscles: 'Głębokie mięśnie brzucha (core)',
        activeZones: ['core'],
        cues: [
          'Przez cały czas trwania serii odcinek lędźwiowy musi być na 100% wklejony w matę (zero szpary pod plecami).',
          'Wyciągaj powoli przeciwległą rękę i nogę tuż nad podłogę z długim wydechem.'
        ],
        ytQuery: 'dead bug core exercise proper form'
      }
    ],
    finisher: {
      type: 'CIRCUIT',
      title: 'Finisher: 2 Obwody (120s przerwy między obwodami)',
      restBetweenRounds: 120,
      rounds: 2,
      description: 'Wykonaj wszystkie 4 ćwiczenia jedno po drugim w pełnym skupieniu technicznym, następnie odpocznij 120 sekund i powtórz drugi obwód.',
      tasks: [
        'Cossack squat TRX – 15 powt. na stronę',
        'Russian kettlebell swing – 15 powt.',
        'Burpees w miejscu – 10 powt.',
        'Single leg calf raises (wspięcia na łydki) – 10 powt. na nogę'
      ]
    }
  },
  3: {
    id: 3,
    title: 'Trening 3: Full Body Workout',
    subtitle: 'Całe ciało + kondycyjny AMRAP 6 minut pod Hyrox',
    warmup: [
      {
        id: 't3_w1',
        name: "1. World's Greatest Stretch",
        animType: 'lunge',
        equipment: 'none',
        sets: 2,
        reps: '5',
        notes: 'Na każdą stronę',
        unilateral: true,
        muscles: 'Kompleksowa mobilność bioder, klatki i tylnej taśmy',
        activeZones: ['glutes', 'back', 'hamstrings'],
        cues: [
          'Zrób głęboki wykrok w przód, sięgnij łokciem do kostki przedniej nogi.',
          'Następnie otwórz klatkę z rotacją ręki do sufitu i wyprostuj przednie kolano.'
        ],
        ytQuery: 'worlds greatest stretch mobility'
      },
      {
        id: 't3_w2',
        name: '2. Bird dog',
        animType: 'quadruped',
        equipment: 'none',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę; stabilny tułów',
        unilateral: true,
        muscles: 'Stabilizacja kręgosłupa, pośladek',
        activeZones: ['core', 'glutes', 'back'],
        cues: [
          'W klęku podpartym wyciągnij przeciwległą rękę i nogę w jednej linii z tułowiem.',
          'Wyobraź sobie, że na lędźwiach stoi kubek z wodą – miednica ani drgnie.'
        ],
        ytQuery: 'bird dog exercise proper form'
      },
      {
        id: 't3_w3',
        name: '3. Band pull-aparts',
        animType: 'standing_push_pull',
        equipment: 'band',
        sets: 2,
        reps: '15',
        notes: 'Rozciąganie gumy przed sobą',
        unilateral: false,
        muscles: 'Tylny akton barku, mięśnie międzyłopatkowe',
        activeZones: ['shoulders', 'back'],
        cues: [
          'Trzymaj gumę przed klatką na prostych łokciach i rozciągaj ją do boków, ściskając łopatki.',
          'Nie unoś barków do uszu.'
        ],
        ytQuery: 'band pull aparts proper form'
      },
      {
        id: 't3_w4',
        name: '4. Bear crawl',
        animType: 'quadruped',
        equipment: 'none',
        sets: 2,
        reps: '10 m',
        notes: 'W przód i w tył',
        unilateral: false,
        muscles: 'Core, stabilizacja barków, czworogłowe',
        activeZones: ['core', 'shoulders', 'quads'],
        cues: [
          'Unieś kolana na 2-3 cm nad ziemię i poruszaj się naprzemiennie (lewa ręka + prawa noga).',
          'Trzymaj biodra nisko na wysokości barków.'
        ],
        ytQuery: 'bear crawl exercise technique'
      },
      {
        id: 't3_w5',
        name: '5. Air squats',
        animType: 'squat',
        equipment: 'none',
        sets: 2,
        reps: '10',
        notes: 'Z 2-sekundową pauzą na dole',
        unilateral: false,
        muscles: 'Rozgrzanie stawów skokowych, kolan i bioder',
        activeZones: ['quads', 'glutes'],
        cues: [
          'Zejdź do pełnego przysiadu i zatrzymaj ruch na pełne 2 sekundy na dole, utrzymując napięcie.',
          'Wstań dynamicznie w górę.'
        ],
        ytQuery: 'air squat pause proper form'
      }
    ],
    main: [
      {
        id: 't3_m1',
        name: '1. KB / DB RDL',
        animType: 'rdl',
        equipment: 'kb_low',
        sets: 3,
        reps: '8-10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Rumuński MC; proste plecy',
        unilateral: false,
        barbell: false,
        muscles: 'Dwugłowe uda, pośladki, prostowniki grzbietu',
        activeZones: ['hamstrings', 'glutes', 'back'],
        cues: [
          'Odblokuj lekko kolana i prowadź hantle/kettle blisko ud i piszczeli, wypychając biodra daleko w tył.',
          'Zatrzymaj ruch w momencie, gdy biodra przestają cofać się w tył (zazwyczaj w połowie piszczeli).'
        ],
        ytQuery: 'dumbbell romanian deadlift proper form'
      },
      {
        id: 't3_m2',
        name: '2. Seated DB Overhead Press',
        animType: 'overhead',
        equipment: 'db_overhead',
        sets: 3,
        reps: '8-10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Wyciskanie hantli siedząc',
        unilateral: false,
        barbell: false,
        muscles: 'Obręcz barkowa, triceps',
        activeZones: ['shoulders', 'arms'],
        cues: [
          'Oprzyj plecy stabilnie o ławkę, łokcie prowadź lekko przed linią ciała (nie całkowicie na boki).',
          'Wyciskaj hantle pionowo nad głowę do pełnego wyprostu.'
        ],
        ytQuery: 'seated dumbbell shoulder press form'
      },
      {
        id: 't3_m3',
        name: '3. Lat pulldown',
        animType: 'pull_vertical',
        equipment: 'lat_bar',
        sets: 3,
        reps: '10-12',
        targetMaxReps: 12,
        rest: 90,
        notes: 'Ściąganie drążka do klatki',
        unilateral: false,
        barbell: false,
        muscles: 'Najszerszy grzbietu, biceps',
        activeZones: ['back', 'arms'],
        cues: [
          'Zacznij ruch od ściągnięcia łopatek w dół, a następnie ciągnij łokcie w stronę bioder, prowadząc drążek do górnej części mostka.',
          'Kontroluj powrót drążka w górę, czując rozciągnięcie pleców.'
        ],
        ytQuery: 'lat pulldown proper form'
      },
      {
        id: 't3_m4',
        name: '4. Bulgarian split squat',
        animType: 'lunge',
        equipment: 'bench_back',
        sets: 3,
        reps: '8-10',
        targetMaxReps: 10,
        rest: 90,
        notes: 'Przysiad bułgarski; na nogę',
        unilateral: true,
        barbell: false,
        muscles: 'Pośladek, czworogłowy uda, stabilizacja',
        activeZones: ['glutes', 'quads'],
        cues: [
          'Oprzyj grzbiet tylnej stopy na ławce, ciężar ciała w 90% spoczywa na nodze przedniej.',
          'Pochyl lekko tułów do przodu (bardziej zaangażujesz pośladek) i schodź tylnym kolanem w dół.'
        ],
        ytQuery: 'bulgarian split squat form'
      },
      {
        id: 't3_m5',
        name: '5. Face pulls',
        animType: 'standing_push_pull',
        equipment: 'cable',
        sets: 3,
        reps: '12-15',
        targetMaxReps: 15,
        rest: 60,
        notes: 'Z rotacją zewnętrzną ramion',
        unilateral: false,
        barbell: false,
        muscles: 'Tylny akton barku, stożek rotatorów, zdrowie barków',
        activeZones: ['shoulders', 'back'],
        cues: [
          'Ustaw wyciąg na wysokości oczu i ciągnij sznur w stronę czoła.',
          'Rozszerzaj dłonie tak, aby na końcu ruchu kciuki były skierowane za głowę (pozycja podwójnego bicepsa).'
        ],
        ytQuery: 'face pull proper form cable'
      },
      {
        id: 't3_m6',
        name: '6. Plank',
        animType: 'plank_side',
        equipment: 'none',
        sets: 3,
        reps: '40-60s',
        targetMaxReps: 60,
        rest: 60,
        notes: 'Deska klasyczna',
        unilateral: false,
        barbell: false,
        muscles: 'Cały gorset mięśniowy core',
        activeZones: ['core', 'shoulders'],
        cues: [
          'Oprzyj się na przedramionach, podwiń miednicę pod siebie i mocno zepnij pośladki oraz uda.',
          'Wypychaj się z przedramion i przyciągaj izometrycznie łokcie w stronę palców stóp.'
        ],
        ytQuery: 'plank proper form core'
      },
      {
        id: 't3_m7',
        name: "7. Farmer's walk",
        animType: 'farmer_walk',
        equipment: 'kb_low',
        sets: 3,
        reps: '30 m',
        targetMaxReps: 30,
        rest: 90,
        notes: 'Ciężkie hantle/KB w dłoniach',
        unilateral: false,
        barbell: false,
        muscles: 'Chwyt, czworoboczny, stabilizacja core pod Hyrox Farmers Carry',
        activeZones: ['core', 'shoulders', 'quads'],
        cues: [
          'Weź ciężkie kettle lub hantle, ściągnij barki w dół i lekko w tył („dumna klatka”).',
          'Idź szybkimi, krótkimi, stabilnymi krokami bez kołysania tułowiem na boki.'
        ],
        ytQuery: 'farmers walk proper form'
      }
    ],
    finisher: {
      type: 'AMRAP',
      title: 'Finisher: AMRAP 6 minut',
      durationMinutes: 6,
      description: 'Wykonaj jak najwięcej obwodów w 6 minut. Zapisz wynik (pełne rundy + dodatkowe powtórzenia)!',
      tasks: [
        '10x Wall Ball (lub DB Thrusters z lekkim ciężarem)',
        '10x Box jumps (wskoki na skrzynię lub szybkie wejścia)',
        '150m na wioślarzu (Ergometr)'
      ]
    }
  }
};

// --- ANATOMICZNY SYMULATOR SYLWETKI CZŁOWIEKA (100% WBUDOWANY W KOD, ZERO BLOKAD) ---
function AnatomicalExerciseAnimator({ exercise }) {
  const [phase, setPhase] = useState(0);
  const [slowMo, setSlowMo] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    let frameId;
    let start = performance.now();
    const duration = slowMo ? 4400 : 2200;

    const loop = (now) => {
      const elapsed = (now - start) % duration;
      const rawProgress = elapsed / duration; // 0..1
      // Płynna sinusoida 0 -> 1 -> 0
      const p = 0.5 - 0.5 * Math.cos(rawProgress * Math.PI * 2);
      setPhase(p);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [slowMo, paused]);

  const lerp = (a, b, t) => a + (b - a) * t;
  const zones = exercise.activeZones || [];
  const isActive = (z) => zones.includes(z);

  const skinColor = '#e2e8f0';
  const activeMuscleColor = '#fb7185'; // Różowo-koralowy dla aktywnych partii
  const activeGlow = 'rgba(244, 63, 94, 0.45)';
  const outfitTop = '#f43f5e';
  const outfitShorts = '#1e293b';

  // Obliczanie współrzędnych stawów dla każdego typu ruchu (widok z boku / półprofilu, czytelne proporcje człowieka)
  let pose = {
    head: { x: 130, y: 46 },
    shoulder: { x: 130, y: 74 },
    hip: { x: 126, y: 126 },
    kneeFront: { x: 136, y: 164 },
    ankleFront: { x: 134, y: 204 },
    kneeBack: { x: 118, y: 164 },
    ankleBack: { x: 116, y: 204 },
    elbow: { x: 145, y: 100 },
    wrist: { x: 158, y: 88 },
    propType: exercise.equipment || 'none',
    phaseLabel: phase < 0.3 ? 'Pozycja wyjściowa' : phase > 0.7 ? 'Szczytowe napięcie (RIR 2)' : 'Kontrola ruchu'
  };

  const t = phase;

  switch (exercise.animType) {
    case 'squat': {
      const drop = lerp(0, 38, t);
      const hipBack = lerp(0, -18, t);
      const kneeFwd = lerp(0, 18, t);
      pose = {
        ...pose,
        head: { x: lerp(132, 136, t), y: 44 + drop * 0.85 },
        shoulder: { x: lerp(130, 134, t), y: 72 + drop * 0.85 },
        hip: { x: 124 + hipBack, y: 124 + drop },
        kneeFront: { x: 134 + kneeFwd, y: 164 + drop * 0.15 },
        ankleFront: { x: 134, y: 204 },
        kneeBack: { x: 124 + kneeFwd * 0.8, y: 162 + drop * 0.15 },
        ankleBack: { x: 124, y: 202 },
        elbow: { x: lerp(142, 146, t), y: 98 + drop * 0.85 },
        wrist: { x: lerp(152, 155, t), y: 82 + drop * 0.85 },
        phaseLabel: t > 0.65 ? 'Dół przysiadu (poniżej 90°)' : t < 0.25 ? 'Pełny wyprost bioder' : 'Kontrolowane zejście'
      };
      break;
    }

    case 'lunge': {
      const drop = lerp(0, 32, t);
      pose = {
        ...pose,
        head: { x: 132, y: 44 + drop },
        shoulder: { x: 130, y: 72 + drop },
        hip: { x: 128, y: 124 + drop },
        kneeFront: { x: lerp(148, 162, t), y: lerp(164, 166, t) },
        ankleFront: { x: 160, y: 204 },
        kneeBack: { x: lerp(112, 114, t), y: lerp(164, 194, t) },
        ankleBack: { x: 84, y: 204 },
        elbow: { x: 130, y: 102 + drop },
        wrist: { x: 132, y: 128 + drop },
        phaseLabel: t > 0.65 ? 'Kolano blisko ziemi (stabilne biodro)' : 'Wyjście z przedniej pięty'
      };
      break;
    }

    case 'rdl':
    case 'hinge_row': {
      const isRow = exercise.animType === 'hinge_row';
      const hinge = isRow ? 0.85 : t;
      const rowPull = isRow ? t : 0;
      pose = {
        ...pose,
        head: { x: lerp(134, 174, hinge), y: lerp(44, 86, hinge) },
        shoulder: { x: lerp(130, 160, hinge), y: lerp(72, 100, hinge) },
        hip: { x: lerp(124, 100, hinge), y: lerp(124, 128, hinge) },
        kneeFront: { x: 128, y: 166 },
        ankleFront: { x: 132, y: 204 },
        kneeBack: { x: 120, y: 164 },
        ankleBack: { x: 124, y: 202 },
        elbow: {
          x: isRow ? lerp(158, 134, rowPull) : lerp(132, 154, hinge),
          y: isRow ? lerp(134, 104, rowPull) : lerp(102, 136, hinge)
        },
        wrist: {
          x: isRow ? lerp(158, 144, rowPull) : lerp(134, 154, hinge),
          y: isRow ? lerp(162, 124, rowPull) : lerp(128, 166, hinge)
        },
        phaseLabel: isRow
          ? t > 0.6
            ? 'Mocne dociągnięcie łokcia do biodra'
            : 'Stabilny opad tułowia (Hip Hinge)'
          : t > 0.6
          ? 'Rozciągnięcie dwugłowych (proste plecy!)'
          : 'Dynamiczny wyprost biodra'
      };
      break;
    }

    case 'single_rdl': {
      pose = {
        ...pose,
        head: { x: lerp(134, 178, t), y: lerp(44, 96, t) },
        shoulder: { x: lerp(130, 162, t), y: lerp(72, 104, t) },
        hip: { x: lerp(126, 118, t), y: lerp(124, 126, t) },
        kneeFront: { x: 128, y: 166 },
        ankleFront: { x: 130, y: 204 },
        kneeBack: { x: lerp(120, 84, t), y: lerp(166, 124, t) },
        ankleBack: { x: lerp(118, 52, t), y: lerp(204, 122, t) },
        elbow: { x: lerp(132, 156, t), y: lerp(102, 136, t) },
        wrist: { x: lerp(134, 156, t), y: lerp(128, 166, t) },
        phaseLabel: t > 0.6 ? 'Waga w linii tułów – tylna noga' : 'Równowaga jednonóż'
      };
      break;
    }

    case 'windmill': {
      pose = {
        ...pose,
        head: { x: lerp(130, 158, t), y: lerp(46, 86, t) },
        shoulder: { x: lerp(130, 152, t), y: lerp(74, 102, t) },
        hip: { x: lerp(126, 104, t), y: lerp(124, 126, t) },
        kneeFront: { x: 146, y: 166 },
        ankleFront: { x: 152, y: 204 },
        kneeBack: { x: 108, y: 166 },
        ankleBack: { x: 104, y: 204 },
        elbow: { x: lerp(130, 152, t), y: lerp(44, 66, t) },
        wrist: { x: lerp(130, 152, t), y: lerp(18, 36, t) },
        phaseLabel: t > 0.6 ? 'Wypchnięcie biodra, wzrok na ciężarze' : 'Stabilizacja ciężaru nad głową'
      };
      break;
    }

    case 'bench_press': {
      pose = {
        ...pose,
        head: { x: 68, y: 138 },
        shoulder: { x: 92, y: 140 },
        hip: { x: 146, y: 142 },
        kneeFront: { x: 184, y: 144 },
        ankleFront: { x: 186, y: 198 },
        kneeBack: { x: 178, y: 144 },
        ankleBack: { x: 180, y: 198 },
        elbow: { x: lerp(96, 94, t), y: lerp(112, 152, t) },
        wrist: { x: 96, y: lerp(78, 122, t) },
        phaseLabel: t > 0.6 ? 'Sztanga przy mostku (łopatki wbite)' : 'Dynamiczne wyciśnięcie w górę'
      };
      break;
    }

    case 'hip_thrust': {
      const hipY = lerp(164, 124, t);
      pose = {
        ...pose,
        head: { x: 76, y: lerp(118, 112, t) },
        shoulder: { x: 94, y: 126 },
        hip: { x: 138, y: hipY },
        kneeFront: { x: 178, y: 128 },
        ankleFront: { x: 178, y: 198 },
        kneeBack: { x: 172, y: 128 },
        ankleBack: { x: 172, y: 198 },
        elbow: { x: 118, y: lerp(144, 122, t) },
        wrist: { x: 138, y: hipY - 6 },
        phaseLabel: t > 0.65 ? 'Pełny wyprost i mocne dopięcie pośladków!' : 'Kontrolowane opuszczenie bioder'
      };
      break;
    }

    case 'overhead':
    case 'pull_vertical': {
      const isPull = exercise.animType === 'pull_vertical';
      const armT = isPull ? 1 - t : t;
      pose = {
        ...pose,
        head: { x: 130, y: 54 },
        shoulder: { x: 128, y: 82 },
        hip: { x: 126, y: 134 },
        kneeFront: { x: 134, y: 170 },
        ankleFront: { x: 134, y: 204 },
        kneeBack: { x: 120, y: 170 },
        ankleBack: { x: 120, y: 204 },
        elbow: { x: lerp(146, 134, armT), y: lerp(104, 52, armT) },
        wrist: { x: lerp(146, 132, armT), y: lerp(78, 22, armT) },
        phaseLabel: isPull
          ? t > 0.6
            ? 'Ściągnięcie łopatek i łokci w dół'
            : 'Pełne rozciągnięcie najszerszego grzbietu'
          : t > 0.6
          ? 'Pełny wyprost nad głową (brzuch spięty)'
          : 'Pozycja na wysokości brody'
      };
      break;
    }

    case 'lateral_raise':
    case 'arm_curl':
    case 'tricep_pushdown':
    case 'standing_push_pull': {
      const mode = exercise.animType;
      let elbowPos = { x: 132, y: 106 };
      let wristPos = { x: 158, y: 106 };

      if (mode === 'arm_curl') {
        wristPos = { x: lerp(138, 152, t), y: lerp(136, 82, t) };
      } else if (mode === 'tricep_pushdown') {
        wristPos = { x: lerp(152, 138, t), y: lerp(88, 136, t) };
      } else if (mode === 'lateral_raise') {
        elbowPos = { x: lerp(134, 156, t), y: lerp(106, 78, t) };
        wristPos = { x: lerp(138, 182, t), y: lerp(132, 76, t) };
      } else {
        // Pallof / Face pull / Band
        elbowPos = { x: lerp(138, 154, t), y: 92 };
        wristPos = { x: lerp(148, 184, t), y: 88 };
      }

      pose = {
        ...pose,
        elbow: elbowPos,
        wrist: wristPos,
        phaseLabel: t > 0.65 ? 'Szczytowe dopięcie (utrzymaj 1s)' : 'Kontrolowany powrót'
      };
      break;
    }

    case 'plank_side':
    case 'quadruped':
    case 'ball_curl':
    case 'dead_bug': {
      const mode = exercise.animType;
      if (mode === 'dead_bug') {
        pose = {
          ...pose,
          head: { x: 64, y: 176 },
          shoulder: { x: 88, y: 178 },
          hip: { x: 138, y: 180 },
          kneeFront: { x: lerp(142, 182, t), y: lerp(144, 170, t) },
          ankleFront: { x: lerp(168, 212, t), y: lerp(144, 174, t) },
          kneeBack: { x: 138, y: 144 },
          ankleBack: { x: 164, y: 144 },
          elbow: { x: lerp(90, 58, t), y: lerp(148, 168, t) },
          wrist: { x: lerp(92, 34, t), y: lerp(124, 172, t) },
          phaseLabel: 'Lędźwie wklejone na 100% w matę!'
        };
      } else if (mode === 'ball_curl') {
        const curl = t;
        pose = {
          ...pose,
          head: { x: 64, y: 182 },
          shoulder: { x: 88, y: 182 },
          hip: { x: 136, y: lerp(156, 142, curl) },
          kneeFront: { x: lerp(176, 158, curl), y: lerp(144, 118, curl) },
          ankleFront: { x: lerp(212, 178, curl), y: 152 },
          kneeBack: { x: lerp(174, 156, curl), y: lerp(144, 118, curl) },
          ankleBack: { x: lerp(210, 176, curl), y: 152 },
          elbow: { x: 108, y: 186 },
          wrist: { x: 132, y: 188 },
          phaseLabel: t > 0.6 ? 'Przyciągnij piłkę piętami (biodra wysoko!)' : 'Kontrolowany wyprost nóg'
        };
      } else if (mode === 'quadruped') {
        pose = {
          ...pose,
          head: { x: 176, y: lerp(118, 126, t) },
          shoulder: { x: 154, y: 126 },
          hip: { x: 102, y: 128 },
          kneeFront: { x: 102, y: 188 },
          ankleFront: { x: 74, y: 196 },
          kneeBack: { x: lerp(102, 64, t), y: lerp(188, 126, t) },
          ankleBack: { x: lerp(74, 32, t), y: lerp(196, 124, t) },
          elbow: { x: lerp(154, 184, t), y: lerp(160, 122, t) },
          wrist: { x: lerp(154, 212, t), y: lerp(192, 120, t) },
          phaseLabel: 'Stabilny tułów i płynny zakres ruchu'
        };
      } else {
        // Plank / Copenhagen
        const lift = lerp(0, -6, t);
        pose = {
          ...pose,
          head: { x: 68, y: 136 + lift },
          shoulder: { x: 92, y: 142 + lift },
          hip: { x: 144, y: 152 + lift },
          kneeFront: { x: 178, y: 162 + lift },
          ankleFront: { x: 210, y: 172 },
          kneeBack: { x: 178, y: lerp(186, 166, t) },
          ankleBack: { x: 210, y: lerp(194, 176, t) },
          elbow: { x: 88, y: 188 },
          wrist: { x: 112, y: 190 },
          phaseLabel: 'Ciało w jednej linii – mocno spięty brzuch i przywodziciele'
        };
      }
      break;
    }

    case 'rower':
    case 'farmer_walk':
    default: {
      if (exercise.animType === 'rower') {
        pose = {
          ...pose,
          head: { x: lerp(142, 102, t), y: 88 },
          shoulder: { x: lerp(138, 106, t), y: 114 },
          hip: { x: lerp(132, 114, t), y: 162 },
          kneeFront: { x: lerp(158, 146, t), y: lerp(132, 158, t) },
          ankleFront: { x: 186, y: 176 },
          kneeBack: { x: lerp(156, 144, t), y: lerp(132, 158, t) },
          ankleBack: { x: 184, y: 176 },
          elbow: { x: lerp(164, 96, t), y: 132 },
          wrist: { x: lerp(184, 116, t), y: 134 },
          phaseLabel: t > 0.6 ? 'Mocny ciąg nogami i dociągnięcie uchwytu' : 'Powrót do przodu'
        };
      } else {
        // Farmer walk
        const step = Math.sin(t * Math.PI * 2) * 14;
        pose = {
          ...pose,
          kneeFront: { x: 130 + step, y: 164 },
          ankleFront: { x: 130 + step * 1.3, y: 204 },
          kneeBack: { x: 130 - step, y: 164 },
          ankleBack: { x: 130 - step * 1.3, y: 204 },
          elbow: { x: 130, y: 106 },
          wrist: { x: 130, y: 136 },
          phaseLabel: 'Łopatki ściągnięte w dół, stabilny marsz z ciężarem'
        };
      }
      break;
    }
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
      {/* Pasek nagłówka symulatora */}
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> Symulator ruchu 2D
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSlowMo(!slowMo)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
              slowMo
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {slowMo ? '0.5x Wolno' : '1.0x Tempo'}
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
          >
            {paused ? 'Start' : 'Pauza'}
          </button>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.ytQuery)}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1 ml-1"
          >
            <span>YT</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Okno SVG z anatomiczną sylwetką człowieka */}
      <div className="relative w-full h-56 bg-gradient-to-b from-slate-900/60 to-slate-950 flex items-center justify-center">
        <svg viewBox="0 0 260 225" className="w-full h-full">
          {/* Linie siatki i podłoga */}
          <line x1="20" y1="206" x2="240" y2="206" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="206" x2="225" y2="206" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />

          {/* Sprzęt treningowy w tle (ławka / skrzynia / piłka / wioślarz) */}
          {(exercise.animType === 'bench_press' || exercise.animType === 'hip_thrust' || exercise.equipment === 'bench') && (
            <g>
              <rect x="52" y="146" width="90" height="10" rx="4" fill="#334155" stroke="#475569" />
              <line x1="65" y1="156" x2="65" y2="205" stroke="#475569" strokeWidth="5" />
              <line x1="128" y1="156" x2="128" y2="205" stroke="#475569" strokeWidth="5" />
            </g>
          )}

          {exercise.equipment === 'bench_back' && (
            <g>
              <rect x="58" y="162" width="42" height="10" rx="3" fill="#334155" />
              <line x1="68" y1="172" x2="68" y2="205" stroke="#475569" strokeWidth="4" />
              <line x1="90" y1="172" x2="90" y2="205" stroke="#475569" strokeWidth="4" />
            </g>
          )}

          {exercise.equipment === 'ball' && (
            <circle cx={pose.ankleFront.x} cy="180" r="24" fill="#0ea5e9" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
          )}

          {/* DALSZA NOGA (Tylna) */}
          <line
            x1={pose.hip.x}
            y1={pose.hip.y}
            x2={pose.kneeBack.x}
            y2={pose.kneeBack.y}
            stroke={isActive('hamstrings') || isActive('quads') ? '#be123c' : '#64748b'}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            x1={pose.kneeBack.x}
            y1={pose.kneeBack.y}
            x2={pose.ankleBack.x}
            y2={pose.ankleBack.y}
            stroke="#64748b"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* But tylny */}
          <ellipse cx={pose.ankleBack.x + 4} cy={pose.ankleBack.y} rx="9" ry="4.5" fill="#475569" />

          {/* TUŁÓW (Anatomiczny kształt klatki, pleców i brzucha) */}
          <line
            x1={pose.shoulder.x}
            y1={pose.shoulder.y}
            x2={pose.hip.x}
            y2={pose.hip.y}
            stroke={isActive('core') || isActive('back') || isActive('chest') ? activeMuscleColor : outfitTop}
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Podświetlenie pośladka (Glutes) */}
          <circle
            cx={pose.hip.x - 2}
            cy={pose.hip.y}
            r="11"
            fill={isActive('glutes') ? activeMuscleColor : outfitShorts}
            stroke={isActive('glutes') ? '#fda4af' : 'none'}
            strokeWidth="2"
          />

          {/* BLIŻSZA NOGA (Przednia – udo + łydka + staw kolanowy) */}
          <line
            x1={pose.hip.x}
            y1={pose.hip.y}
            x2={pose.kneeFront.x}
            y2={pose.kneeFront.y}
            stroke={isActive('quads') || isActive('hamstrings') ? activeMuscleColor : skinColor}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <line
            x1={pose.kneeFront.x}
            y1={pose.kneeFront.y}
            x2={pose.ankleFront.x}
            y2={pose.ankleFront.y}
            stroke={skinColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx={pose.kneeFront.x} cy={pose.kneeFront.y} r="5.5" fill="#f8fafc" />
          {/* But sportowy przedni */}
          <path
            d={`M ${pose.ankleFront.x - 6} ${pose.ankleFront.y - 3} L ${pose.ankleFront.x + 12} ${pose.ankleFront.y - 1} L ${pose.ankleFront.x + 13} ${pose.ankleFront.y + 4} L ${pose.ankleFront.x - 7} ${pose.ankleFront.y + 4} Z`}
            fill="#f43f5e"
          />

          {/* GŁOWA + SZYJA + KUCYK SPORTOWY */}
          <line
            x1={pose.shoulder.x}
            y1={pose.shoulder.y}
            x2={pose.head.x}
            y2={pose.head.y}
            stroke={skinColor}
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Kucyk */}
          <path
            d={`M ${pose.head.x - 10} ${pose.head.y - 4} Q ${pose.head.x - 24} ${pose.head.y - 10} ${pose.head.x - 22} ${pose.head.y + 6}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={pose.head.x} cy={pose.head.y} r="12.5" fill={skinColor} />
          {/* Opaska sportowa */}
          <path
            d={`M ${pose.head.x - 11} ${pose.head.y - 4} Q ${pose.head.x} ${pose.head.y - 9} ${pose.head.x + 11} ${pose.head.y - 4}`}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3.5"
          />

          {/* RAMIĘ I PRZEDRAMIĘ */}
          <circle
            cx={pose.shoulder.x}
            cy={pose.shoulder.y}
            r="8"
            fill={isActive('shoulders') ? activeMuscleColor : outfitTop}
          />
          <line
            x1={pose.shoulder.x}
            y1={pose.shoulder.y}
            x2={pose.elbow.x}
            y2={pose.elbow.y}
            stroke={isActive('arms') || isActive('shoulders') ? activeMuscleColor : skinColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1={pose.elbow.x}
            y1={pose.elbow.y}
            x2={pose.wrist.x}
            y2={pose.wrist.y}
            stroke={isActive('arms') ? activeMuscleColor : skinColor}
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          <circle cx={pose.wrist.x} cy={pose.wrist.y} r="4.5" fill="#f8fafc" />

          {/* AKCESORIA W DŁONIACH (Kettlebell / Sztanga / Hantle / Wyciąg) */}
          {(exercise.equipment === 'kb_chest' ||
            exercise.equipment === 'kb_low' ||
            exercise.equipment === 'kb_overhead') && (
            <g transform={`translate(${pose.wrist.x}, ${pose.wrist.y})`}>
              <path d="M -5 -4 C -5 -10, 5 -10, 5 -4" fill="none" stroke="#94a3b8" strokeWidth="3" />
              <circle cx="0" cy="5" r="9.5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="0" y="8" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0f172a">
                KB
              </text>
            </g>
          )}

          {exercise.equipment === 'barbell' && (
            <g transform={`translate(${pose.wrist.x}, ${pose.wrist.y})`}>
              <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="3.5" />
              <circle cx="0" cy="0" r="4" fill="#94a3b8" />
            </g>
          )}

          {(exercise.equipment === 'db_sides' ||
            exercise.equipment === 'db_overhead' ||
            exercise.equipment === 'plate') && (
            <g transform={`translate(${pose.wrist.x}, ${pose.wrist.y})`}>
              <rect x="-9" y="-4" width="18" height="8" rx="3" fill="#38bdf8" />
            </g>
          )}

          {exercise.equipment === 'cable' && (
            <line
              x1="235"
              y1="85"
              x2={pose.wrist.x}
              y2={pose.wrist.y}
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />
          )}

          {(exercise.equipment === 'pullup_bar' || exercise.equipment === 'lat_bar') && (
            <g>
              <line x1="90" y1="18" x2="175" y2="18" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
              <line x1="132" y1="18" x2={pose.wrist.x} y2={pose.wrist.y} stroke="#38bdf8" strokeWidth="2.5" />
            </g>
          )}
        </svg>

        {/* Etykieta aktualnej fazy ruchu na dole */}
        <div className="absolute bottom-2 inset-x-2.5 bg-slate-950/90 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-300">{pose.phaseLabel}</span>
          <span className="text-[10px] text-rose-400 font-semibold">● Aktywne mięśnie</span>
        </div>
      </div>
    </div>
  );
}

// --- POMOCNICZE FUNKCJE INDEXED-DB DO TRWAŁEGO ZAPISU FILMIKÓW Z TELEFONU ---
const DB_NAME = 'HyroxAsiaVideoDB_v2';
const STORE_NAME = 'exercise_videos';

const openVideoDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveVideoBlobToDB = async (key, file, meta = {}) => {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({
      key,
      blob: file,
      name: file.name || 'nagranie.mp4',
      updatedAt: new Date().toISOString(),
      ...meta
    });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const getAllVideosFromDB = async () => {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

const deleteVideoFromDB = async (key) => {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

// --- KALKULATOR TALERZY NA SZTANGĘ ---
const calculatePlates = (totalWeight, barWeight = 20) => {
  const weightNum = parseFloat(totalWeight);
  if (isNaN(weightNum) || weightNum <= barWeight) return [];
  let perSide = (weightNum - barWeight) / 2;
  const availablePlates = [20, 15, 10, 5, 2.5, 1.25];
  const result = [];
  for (const plate of availablePlates) {
    while (perSide >= plate - 0.001) {
      result.push(plate);
      perSide = Math.round((perSide - plate) * 100) / 100;
    }
  }
  return result;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const saved = localStorage.getItem('hyrox_selected_week');
    return saved ? Number(saved) : 1;
  });
  const [selectedWorkout, setSelectedWorkout] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('hyrox_asia_logs_v3');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [finisherLogs, setFinisherLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('hyrox_asia_finishers_v3');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [openDemos, setOpenDemos] = useState({});
  const [openPlateCalc, setOpenPlateCalc] = useState({});
  const [localVideos, setLocalVideos] = useState({});
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const [restTimer, setRestTimer] = useState({ active: false, remaining: 0, total: 0, label: '' });
  const [finisherTimer, setFinisherTimer] = useState({ active: false, seconds: 0, mode: 'EMOM', totalSeconds: 300 });

  const wakeLockRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('hyrox_asia_logs_v3', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('hyrox_asia_finishers_v3', JSON.stringify(finisherLogs));
  }, [finisherLogs]);

  useEffect(() => {
    localStorage.setItem('hyrox_selected_week', String(selectedWeek));
  }, [selectedWeek]);

  const refreshVideosFromDB = async () => {
    try {
      const items = await getAllVideosFromDB();
      const map = {};
      items.forEach((item) => {
        map[item.key] = {
          ...item,
          url: URL.createObjectURL(item.blob)
        };
      });
      setLocalVideos(map);
    } catch (e) {
      console.error('Błąd IndexedDB:', e);
    }
  };

  useEffect(() => {
    refreshVideosFromDB();
  }, []);

  const toggleWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      alert('Twoja przeglądarka nie wspiera automatycznej blokady wygaszania ekranu.');
      return;
    }
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setWakeLockActive(false);
      } else {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setWakeLockActive(true);
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockActive(false);
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const playBeep = (freq = 880, duration = 0.18) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignoruj
    }
  };

  useEffect(() => {
    if (!restTimer.active) return;
    if (restTimer.remaining <= 0) {
      playBeep(1046, 0.35);
      setRestTimer((prev) => ({ ...prev, active: false }));
      return;
    }
    if (restTimer.remaining <= 3) {
      playBeep(660, 0.12);
    }
    const t = setTimeout(() => {
      setRestTimer((prev) => ({ ...prev, remaining: prev.remaining - 1 }));
    }, 1000);
    return () => clearTimeout(t);
  }, [restTimer]);

  useEffect(() => {
    if (!finisherTimer.active) return;
    if (finisherTimer.seconds >= finisherTimer.totalSeconds) {
      playBeep(1046, 0.5);
      setFinisherTimer((prev) => ({ ...prev, active: false }));
      return;
    }
    const t = setTimeout(() => {
      const nextSec = finisherTimer.seconds + 1;
      if (finisherTimer.mode === 'EMOM' && nextSec % 60 === 0 && nextSec < finisherTimer.totalSeconds) {
        playBeep(987, 0.35);
      } else if (finisherTimer.mode === 'EMOM' && nextSec % 60 >= 57) {
        playBeep(550, 0.1);
      }
      setFinisherTimer((prev) => ({ ...prev, seconds: nextSec }));
    }, 1000);
    return () => clearTimeout(t);
  }, [finisherTimer]);

  const getExerciseLog = (week, exercise) => {
    const weekData = logs[week] || {};
    const existing = weekData[exercise.id];
    if (existing && existing.sets && existing.sets.length === exercise.sets) {
      return existing;
    }
    const defaultSets = Array.from({ length: exercise.sets }, (_, i) => ({
      setNumber: i + 1,
      weight: existing?.sets?.[i]?.weight ?? '',
      weightRight: existing?.sets?.[i]?.weightRight ?? '',
      reps: existing?.sets?.[i]?.reps ?? '',
      repsRight: existing?.sets?.[i]?.repsRight ?? '',
      rir: existing?.sets?.[i]?.rir ?? '2',
      done: existing?.sets?.[i]?.done ?? false
    }));
    return {
      sets: defaultSets,
      splitLR: existing?.splitLR ?? false,
      barWeight: existing?.barWeight ?? 20,
      note: existing?.note ?? '',
      recordedForPawel: existing?.recordedForPawel ?? false
    };
  };

  const getPreviousWeekAdvice = (exercise, setIdx) => {
    if (selectedWeek <= 1) return null;
    const prevLog = logs[selectedWeek - 1]?.[exercise.id];
    const prevSet = prevLog?.sets?.[setIdx];
    if (!prevSet || (!prevSet.weight && !prevSet.reps)) return null;

    const w = parseFloat(prevSet.weight);
    const r = parseInt(prevSet.reps, 10);
    const rir = prevSet.rir;

    let suggestion = null;
    let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

    if (!isNaN(w)) {
      if (rir === '3-4' || rir === '5+' || (!isNaN(r) && exercise.targetMaxReps && r >= exercise.targetMaxReps && rir === '2')) {
        const increment = w >= 20 ? 2.5 : 1.5;
        suggestion = `Progresja: spróbuj ${(w + increment).toFixed(1).replace('.0', '')} kg (tydz. temu ${w}kg × ${prevSet.reps || '?'}, RIR ${rir})`;
        badgeColor = 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60';
      } else if (rir === '0') {
        suggestion = `Zostań na ${w} kg i pilnuj RIR 2 (tydz. temu upadek RIR 0)`;
        badgeColor = 'bg-amber-950/70 text-amber-300 border-amber-700/60';
      } else {
        suggestion = `Tydz. ${selectedWeek - 1}: ${w} kg × ${prevSet.reps || '?'} (RIR ${rir})`;
      }
    } else {
      suggestion = `Tydz. ${selectedWeek - 1}: ${prevSet.reps} powt.`;
    }

    return { text: suggestion, badgeColor, prevWeight: prevSet.weight, prevReps: prevSet.reps };
  };

  const updateExerciseLog = (exercise, updater) => {
    setLogs((prev) => {
      const current = getExerciseLog(selectedWeek, exercise);
      const updated = updater(current);
      return {
        ...prev,
        [selectedWeek]: {
          ...(prev[selectedWeek] || {}),
          [exercise.id]: updated
        }
      };
    });
  };

  const handleSetChange = (exercise, setIdx, field, value) => {
    updateExerciseLog(exercise, (curr) => {
      const newSets = [...curr.sets];
      newSets[setIdx] = { ...newSets[setIdx], [field]: value };
      return { ...curr, sets: newSets };
    });
  };

  const handleToggleSetDone = (exercise, setIdx) => {
    const curr = getExerciseLog(selectedWeek, exercise);
    const willBeDone = !curr.sets[setIdx].done;

    updateExerciseLog(exercise, (c) => {
      const newSets = [...c.sets];
      const prevAdvice = getPreviousWeekAdvice(exercise, setIdx);
      newSets[setIdx] = {
        ...newSets[setIdx],
        done: willBeDone,
        weight: newSets[setIdx].weight || prevAdvice?.prevWeight || '',
        reps: newSets[setIdx].reps || prevAdvice?.prevReps || exercise.reps.split('-')[0] || ''
      };
      return { ...c, sets: newSets };
    });

    if (willBeDone && exercise.rest && exercise.rest > 0) {
      setRestTimer({
        active: true,
        remaining: exercise.rest,
        total: exercise.rest,
        label: `${exercise.name} (Seria ${setIdx + 1})`
      });
    }
  };

  const handleVideoUpload = async (exercise, file) => {
    if (!file) return;
    const key = `w${selectedWeek}_${exercise.id}`;
    await saveVideoBlobToDB(key, file, {
      week: selectedWeek,
      exerciseId: exercise.id,
      exerciseName: exercise.name
    });
    updateExerciseLog(exercise, (curr) => ({ ...curr, recordedForPawel: true }));
    await refreshVideosFromDB();
    setOpenDemos((prev) => ({ ...prev, [exercise.id]: true }));
  };

  const handleDeleteVideo = async (key) => {
    await deleteVideoFromDB(key);
    await refreshVideosFromDB();
  };

  const handleShareVideo = async (videoObj) => {
    if (navigator.share && videoObj?.blob) {
      try {
        const file = new File([videoObj.blob], `${videoObj.exerciseName.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`, {
          type: videoObj.blob.type || 'video/mp4'
        });
        await navigator.share({
          title: `${videoObj.exerciseName} - Tydzień ${videoObj.week}`,
          text: `Hej Pawcio! Przesyłam serię do oceny techniki: ${videoObj.exerciseName} (Tydzień ${videoObj.week})`,
          files: [file]
        });
        return;
      } catch {
        // Fallback
      }
    }
    const a = document.createElement('a');
    a.href = videoObj.url;
    a.download = `${videoObj.exerciseName}_Tydzien_${videoObj.week}.mp4`;
    a.click();
  };

  const handleExportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      logs,
      finisherLogs,
      selectedWeek
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hyrox_plan_asia_backup_tydz_${selectedWeek}.json`;
    a.click();
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.logs) setLogs(data.logs);
        if (data.finisherLogs) setFinisherLogs(data.finisherLogs);
        if (data.selectedWeek) setSelectedWeek(data.selectedWeek);
        alert('Kopia zapasowa została pomyślnie wczytana!');
        setShowBackupModal(false);
      } catch {
        alert('Nieprawidłowy plik kopii zapasowej.');
      }
    };
    reader.readAsText(file);
  };

  const generatePawelReport = () => {
    const workout = WORKOUT_PLAN[selectedWorkout];
    const lines = [
      `🐻 RAPORT TRENINGOWY – TYDZIEŃ ${selectedWeek}`,
      `📌 ${workout.title}`,
      `────────────────────`
    ];
    workout.main.forEach((ex) => {
      const exLog = getExerciseLog(selectedWeek, ex);
      const completedSets = exLog.sets.filter((s) => s.done || s.weight || s.reps);
      if (completedSets.length > 0) {
        const setsStr = completedSets
          .map((s) => {
            if (exLog.splitLR && ex.unilateral) {
              return `L:${s.weight || 0}kg×${s.reps || 0} / P:${s.weightRight || s.weight || 0}kg×${s.repsRight || s.reps || 0} (RIR ${s.rir})`;
            }
            return `${s.weight ? s.weight + 'kg' : 'BW'}×${s.reps || ex.reps} (RIR ${s.rir})`;
          })
          .join(', ');
        lines.push(`✅ ${ex.name}: ${setsStr}${exLog.recordedForPawel ? ' [🎥 Nagrane]' : ''}`);
        if (exLog.note) lines.push(`   💬 Notatka: ${exLog.note}`);
      } else {
        lines.push(`⬜ ${ex.name}: jeszcze nieuzupełnione`);
      }
    });

    const fLog = finisherLogs[selectedWeek]?.[selectedWorkout];
    lines.push(`────────────────────`);
    lines.push(
      `🔥 ${workout.finisher.title}: ${
        fLog?.rounds || fLog?.kcalOrTime
          ? `${fLog.rounds ? fLog.rounds + ' rund/obwodów ' : ''}${fLog.kcalOrTime ? '(' + fLog.kcalOrTime + ')' : ''}`
          : 'Wykonano'
      }`
    );
    return lines.join('\n');
  };

  const currentWorkout = WORKOUT_PLAN[selectedWorkout];
  const currentFinisherLog = finisherLogs[selectedWeek]?.[selectedWorkout] || {
    rounds: '',
    kcalOrTime: '',
    note: '',
    completed: false
  };

  const updateFinisherLog = (field, value) => {
    setFinisherLogs((prev) => ({
      ...prev,
      [selectedWeek]: {
        ...(prev[selectedWeek] || {}),
        [selectedWorkout]: {
          ...currentFinisherLog,
          [field]: value
        }
      }
    }));
  };

  const totalMainSets = currentWorkout.main.reduce((acc, ex) => acc + ex.sets, 0);
  const completedMainSets = currentWorkout.main.reduce((acc, ex) => {
    const l = getExerciseLog(selectedWeek, ex);
    return acc + l.sets.filter((s) => s.done).length;
  }, 0);
  const progressPercent = Math.round((completedMainSets / totalMainSets) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-sans selection:bg-rose-500 selection:text-white">
      {/* GÓRNY PASEK */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white">
                  HYROX PLAN • ASIA
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Trener: Paweł 🐻
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Miesiąc 1–2 (8 tygodni) • Cel od 2. tyg: <strong className="text-rose-300">RIR 2 (70-80% max)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('rir_guide')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition ${
                activeTab === 'rir_guide'
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-900 text-rose-300 border-slate-800 hover:border-rose-500/50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>RIR?</span>
            </button>

            <button
              onClick={toggleWakeLock}
              title="Nie wygaszaj ekranu na treningu"
              className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
                wakeLockActive
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowBackupModal(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </button>
          </div>
        </div>

        {/* WYBÓR TYGODNIA */}
        <div className="max-w-3xl mx-auto mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                selectedWeek === w
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>Tydz. {w}</span>
              {w === 1 && <span className="text-[10px] opacity-80">(Wdrożenie)</span>}
              {w >= 2 && <span className="text-[10px] opacity-85">RIR 2</span>}
            </button>
          ))}
        </div>

        {/* ZAKŁADKI */}
        <div className="max-w-3xl mx-auto mt-2.5 grid grid-cols-4 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('workout')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'workout' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-rose-400" />
            <span>Trening</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'videos' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-sky-400" />
            <span>Moje Wideo ({Object.keys(localVideos).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'progress' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Progres</span>
          </button>
          <button
            onClick={() => setActiveTab('rir_guide')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'rir_guide' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instrukcja RIR</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4">
        {/* ZAKŁADKA RIR */}
        {activeTab === 'rir_guide' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">Jak korzystać ze skali RIR na treningu?</h2>
            <div className="grid gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/50">
                <p className="font-bold text-emerald-300">RIR 2 (Twój cel od 2. tygodnia planu Pawła)</p>
                <p className="text-slate-300 mt-0.5">
                  Kończysz serię i czujesz, że przy maksymalnej walce zrobiłabyś jeszcze dokładnie 2 poprawne
                  powtórzenia, ale 3. już by nie weszło.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/50">
                <p className="font-bold text-amber-300">RIR 5+ (Seria rozgrzewkowa)</p>
                <p className="text-slate-300 mt-0.5">
                  Jeśli po ostatnim powtórzeniu czujesz, że zrobisz jeszcze 5 ruchów, seria była zbyt lekka – dołóż
                  ciężaru i nie wliczaj jej do 3 serii roboczych.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ZAKŁADKA MOJE WIDEO */}
        {activeTab === 'videos' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-sky-400" />
              <span>Twoje nagrane filmiki ({Object.keys(localVideos).length})</span>
            </h2>
            {Object.keys(localVideos).length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                Nie dodałaś jeszcze żadnego filmiku. Przy ćwiczeniu kliknij <strong>+ Mój filmik</strong>.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {Object.values(localVideos).map((vid) => (
                  <div
                    key={vid.key}
                    className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col"
                  >
                    <video src={vid.url} controls playsInline className="w-full h-52 object-cover bg-black" />
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          Tydzień {vid.week}
                        </span>
                        <h3 className="font-bold text-sm text-white mt-1">{vid.exerciseName}</h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleShareVideo(vid)}
                          className="py-1.5 px-2.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Wyślij</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.key)}
                          className="p-1.5 rounded-lg bg-slate-900 text-rose-400 border border-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ZAKŁADKA PROGRES */}
        {activeTab === 'progress' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Progres ciężarów (Tydzień 1 – 8)</span>
            </h2>
            {[1, 2, 3].map((wId) => (
              <div key={wId} className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                <h3 className="text-xs font-bold text-rose-400 uppercase mb-2">{WORKOUT_PLAN[wId].title}</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1.5 pr-2">Ćwiczenie</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((wk) => (
                        <th key={wk} className="py-1.5 px-1.5 text-center">
                          T{wk}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {WORKOUT_PLAN[wId].main.map((ex) => (
                      <tr key={ex.id}>
                        <td className="py-2 pr-2 font-medium text-slate-200">{ex.name}</td>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((wk) => {
                          const l = logs[wk]?.[ex.id];
                          const weights =
                            l?.sets?.map((s) => parseFloat(s.weight)).filter((n) => !isNaN(n) && n > 0) || [];
                          const maxW = weights.length > 0 ? Math.max(...weights) : null;
                          return (
                            <td key={wk} className="py-2 px-1.5 text-center">
                              {maxW ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                                  {maxW}kg
                                </span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ZAKŁADKA TRENING */}
        {activeTab === 'workout' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((id) => {
                const w = WORKOUT_PLAN[id];
                const isSelected = selectedWorkout === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedWorkout(id)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-gradient-to-br from-rose-500/20 to-amber-500/10 border-rose-500/60'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Trening {id}
                    </span>
                    <p className="font-bold text-xs sm:text-sm text-white mt-2 line-clamp-1">
                      {w.title.replace(`Trening ${id}: `, '')}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white">
                    {currentWorkout.title} • Tydzień {selectedWeek}
                  </span>
                  <span className="text-rose-400 font-bold">
                    {completedMainSets}/{totalMainSets} serii ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Raport dla Pawła</span>
              </button>
            </div>

            {/* MOBILIZACJA */}
            <section className="space-y-2.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 px-1">
                🔥 Mobilizacja (Rozgrzewka)
              </h2>

              {currentWorkout.warmup.map((ex) => {
                const exLog = getExerciseLog(selectedWeek, ex);
                const isDemoOpen = !!openDemos[ex.id];
                const videoKey = `w${selectedWeek}_${ex.id}`;
                const uploadedVideo = localVideos[videoKey];

                return (
                  <div key={ex.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-white">{ex.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Serie: <strong className="text-slate-200">{ex.sets}</strong> • Powtórzenia:{' '}
                          <strong className="text-amber-300">{ex.reps}</strong> • {ex.notes}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold flex items-center gap-1 border border-slate-700">
                          <Video className="w-3.5 h-3.5" />
                          <span>+ Filmik</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleVideoUpload(ex, e.target.files?.[0])}
                          />
                        </label>

                        <button
                          onClick={() => setOpenDemos((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition ${
                            isDemoOpen
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-800 text-slate-200 border-slate-700'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Animacja</span>
                          {isDemoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {exLog.sets.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleToggleSetDone(ex, idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                            s.done
                              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            Seria {idx + 1} ({ex.reps})
                          </span>
                        </button>
                      ))}
                    </div>

                    {isDemoOpen && (
                      <div className="pt-3 border-t border-slate-800 grid sm:grid-cols-2 gap-3">
                        <AnatomicalExerciseAnimator exercise={ex} />
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                              {ex.muscles}
                            </span>
                            <ul className="mt-2 space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                              {ex.cues.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                          {uploadedVideo && (
                            <div className="pt-2 border-t border-slate-800 space-y-1.5">
                              <video
                                src={uploadedVideo.url}
                                controls
                                playsInline
                                className="w-full h-36 object-cover rounded-lg bg-black"
                              />
                              <button
                                onClick={() => handleShareVideo(uploadedVideo)}
                                className="w-full py-1.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Wyślij Pawłowi</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            {/* CZĘŚĆ GŁÓWNA */}
            <section className="space-y-3 pt-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 px-1">
                💪 Część Główna (Siła i Kontrola • Cel RIR 2)
              </h2>

              {currentWorkout.main.map((ex) => {
                const exLog = getExerciseLog(selectedWeek, ex);
                const isDemoOpen = !!openDemos[ex.id];
                const isPlateOpen = !!openPlateCalc[ex.id];
                const videoKey = `w${selectedWeek}_${ex.id}`;
                const uploadedVideo = localVideos[videoKey];

                return (
                  <div
                    key={ex.id}
                    className={`bg-slate-900 border rounded-2xl p-4 space-y-3.5 ${
                      ex.superset ? 'border-amber-500/40' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-white">{ex.name}</h3>
                          {ex.superset && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              ⚡ {ex.superset}
                            </span>
                          )}
                          {ex.unilateral && (
                            <button
                              onClick={() => updateExerciseLog(ex, (c) => ({ ...c, splitLR: !c.splitLR }))}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                exLog.splitLR
                                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                                  : 'bg-slate-800 text-sky-300 border-slate-700'
                              }`}
                            >
                              {exLog.splitLR ? '✓ Osobno L / P' : '⇄ Podziel L / P'}
                            </button>
                          )}
                          {ex.barbell && (
                            <button
                              onClick={() => setOpenPlateCalc((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1"
                            >
                              <Scale className="w-3 h-3" />
                              <span>Talerze</span>
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Serie: <strong className="text-white">{ex.sets}</strong> • Zakres:{' '}
                          <strong className="text-rose-400">{ex.reps}</strong> • Przerwa:{' '}
                          <strong className="text-amber-300">{ex.rest}s</strong> • {ex.notes}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold flex items-center gap-1 border border-slate-700">
                          <Video className="w-3.5 h-3.5" />
                          <span>{uploadedVideo ? 'Zmień filmik' : '+ Mój filmik'}</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleVideoUpload(ex, e.target.files?.[0])}
                          />
                        </label>

                        <button
                          onClick={() => setOpenDemos((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition ${
                            isDemoOpen
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-slate-800 text-slate-200 border-slate-700'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Animacja</span>
                          {isDemoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {ex.barbell && isPlateOpen && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300">Talerze na jedną stronę gryfu:</span>
                          <div className="flex items-center gap-1">
                            {[20, 15, 10].map((bw) => (
                              <button
                                key={bw}
                                onClick={() => updateExerciseLog(ex, (c) => ({ ...c, barWeight: bw }))}
                                className={`px-2 py-0.5 rounded font-bold ${
                                  exLog.barWeight === bw ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                Gryf {bw}kg
                              </button>
                            ))}
                          </div>
                        </div>
                        {exLog.sets.map((s, idx) => {
                          const plates = calculatePlates(s.weight, exLog.barWeight);
                          return (
                            <div key={idx} className="flex items-center justify-between text-slate-300">
                              <span>Seria {idx + 1} ({s.weight || 0} kg):</span>
                              <div className="flex items-center gap-1">
                                {plates.length > 0 ? (
                                  plates.map((p, pIdx) => (
                                    <span
                                      key={pIdx}
                                      className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold"
                                    >
                                      +{p}kg
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-500">Sam gryf</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* SERIE */}
                    <div className="space-y-2">
                      {exLog.sets.map((s, idx) => {
                        const advice = getPreviousWeekAdvice(ex, idx);
                        const isTooLightWarmup = s.rir === '5+';

                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border space-y-2 ${
                              isTooLightWarmup
                                ? 'bg-amber-950/30 border-amber-600/50'
                                : s.done
                                ? 'bg-emerald-950/30 border-emerald-600/40'
                                : 'bg-slate-950 border-slate-800/90'
                            }`}
                          >
                            {advice && (
                              <span
                                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${advice.badgeColor}`}
                              >
                                💡 {advice.text}
                              </span>
                            )}

                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                              <span className="w-8 text-xs font-extrabold text-slate-400">#{idx + 1}</span>

                              {!exLog.splitLR ? (
                                <>
                                  <div className="flex-1 min-w-[85px]">
                                    <label className="text-[10px] text-slate-400 block">Ciężar (kg)</label>
                                    <input
                                      type="number"
                                      step="0.5"
                                      placeholder={advice?.prevWeight || 'kg'}
                                      value={s.weight}
                                      onChange={(e) => handleSetChange(ex, idx, 'weight', e.target.value)}
                                      className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-bold text-white"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-[85px]">
                                    <label className="text-[10px] text-slate-400 block">Powt. ({ex.reps})</label>
                                    <input
                                      type="text"
                                      placeholder={ex.reps}
                                      value={s.reps}
                                      onChange={(e) => handleSetChange(ex, idx, 'reps', e.target.value)}
                                      className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-bold text-white"
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                                    <span className="text-[10px] font-bold text-sky-400 block">LEWA</span>
                                    <div className="flex gap-1 mt-1">
                                      <input
                                        type="number"
                                        step="0.5"
                                        placeholder="kg"
                                        value={s.weight}
                                        onChange={(e) => handleSetChange(ex, idx, 'weight', e.target.value)}
                                        className="w-1/2 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                                      />
                                      <input
                                        type="text"
                                        placeholder="powt"
                                        value={s.reps}
                                        onChange={(e) => handleSetChange(ex, idx, 'reps', e.target.value)}
                                        className="w-1/2 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                                    <span className="text-[10px] font-bold text-rose-400 block">PRAWA</span>
                                    <div className="flex gap-1 mt-1">
                                      <input
                                        type="number"
                                        step="0.5"
                                        placeholder="kg"
                                        value={s.weightRight}
                                        onChange={(e) => handleSetChange(ex, idx, 'weightRight', e.target.value)}
                                        className="w-1/2 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                                      />
                                      <input
                                        type="text"
                                        placeholder="powt"
                                        value={s.repsRight}
                                        onChange={(e) => handleSetChange(ex, idx, 'repsRight', e.target.value)}
                                        className="w-1/2 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="w-32">
                                <label className="text-[10px] text-slate-400 block">Zapas (RIR)</label>
                                <select
                                  value={s.rir}
                                  onChange={(e) => handleSetChange(ex, idx, 'rir', e.target.value)}
                                  className={`w-full mt-0.5 px-2 py-1.5 rounded-lg border text-xs font-bold ${
                                    s.rir === '2'
                                      ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300'
                                      : s.rir === '5+'
                                      ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                                      : 'bg-slate-900 border-slate-700 text-slate-200'
                                  }`}
                                >
                                  <option value="2">RIR 2 (Cel 🎯)</option>
                                  <option value="1">RIR 1 (Ciężko)</option>
                                  <option value="0">RIR 0 (Max)</option>
                                  <option value="3-4">RIR 3-4 (Zapas)</option>
                                  <option value="5+">RIR 5+ (Rozgrz.!)</option>
                                </select>
                              </div>

                              <button
                                onClick={() => handleToggleSetDone(ex, idx)}
                                className={`mt-4 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                                  s.done
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 hover:bg-rose-500 text-slate-200 hover:text-white'
                                }`}
                              >
                                <Check className="w-4 h-4" />
                                <span>{s.done ? 'Zrobione' : 'Zrób'}</span>
                              </button>
                            </div>

                            {isTooLightWarmup && (
                              <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-950/60 px-2.5 py-1.5 rounded-lg border border-amber-700/50">
                                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                                <span>
                                  <strong>Zasada Pawła:</strong> Zapas 5+ powtórzeń oznacza serię rozgrzewkową – dołóż
                                  ciężaru!
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      placeholder="Notatka dla siebie lub Pawła..."
                      value={exLog.note}
                      onChange={(e) => updateExerciseLog(ex, (c) => ({ ...c, note: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    />

                    {/* PANEL ANIMACJA + TWOJE WIDEO */}
                    {isDemoOpen && (
                      <div className="pt-3 border-t border-slate-800 grid sm:grid-cols-2 gap-3">
                        <AnatomicalExerciseAnimator exercise={ex} />

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                              Pracujące mięśnie: {ex.muscles}
                            </span>
                            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                              {ex.cues.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>

                          {uploadedVideo ? (
                            <div className="pt-2 border-t border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-emerald-400">
                                  🎥 Twoje nagranie z tego tygodnia
                                </span>
                                <button
                                  onClick={() => handleDeleteVideo(videoKey)}
                                  className="text-[11px] text-rose-400 hover:underline"
                                >
                                  Usuń
                                </button>
                              </div>
                              <video
                                src={uploadedVideo.url}
                                controls
                                playsInline
                                className="w-full h-40 object-cover rounded-lg bg-black"
                              />
                              <button
                                onClick={() => handleShareVideo(uploadedVideo)}
                                className="w-full py-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Wyślij / Udostępnij Pawłowi</span>
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer py-2.5 px-3 rounded-xl border border-dashed border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/10 text-sky-300 text-xs font-semibold flex items-center justify-center gap-2">
                              <Upload className="w-4 h-4" />
                              <span>+ Nagraj lub dodaj swój filmik z galerii</span>
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => handleVideoUpload(ex, e.target.files?.[0])}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            {/* FINISHER */}
            <section className="pt-2">
              <div className="bg-gradient-to-br from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500 text-white">
                      FINISHER HYROX
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{currentWorkout.finisher.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentWorkout.finisher.type === 'EMOM' && (
                      <button
                        onClick={() =>
                          setFinisherTimer({
                            active: !finisherTimer.active,
                            seconds: finisherTimer.active ? finisherTimer.seconds : 0,
                            mode: 'EMOM',
                            totalSeconds: 300
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        {finisherTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{finisherTimer.active ? 'Pauza EMOM' : 'Start EMOM 5:00'}</span>
                      </button>
                    )}

                    {currentWorkout.finisher.type === 'AMRAP' && (
                      <button
                        onClick={() =>
                          setFinisherTimer({
                            active: !finisherTimer.active,
                            seconds: finisherTimer.active ? finisherTimer.seconds : 0,
                            mode: 'AMRAP',
                            totalSeconds: 360
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        {finisherTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{finisherTimer.active ? 'Pauza AMRAP' : 'Start AMRAP 6:00'}</span>
                      </button>
                    )}

                    {currentWorkout.finisher.type === 'CIRCUIT' && (
                      <button
                        onClick={() =>
                          setRestTimer({
                            active: true,
                            remaining: 120,
                            total: 120,
                            label: 'Przerwa między Obwodami (120s)'
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                      >
                        <Play className="w-4 h-4" />
                        <span>Stoper przerwy 120s</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300">{currentWorkout.finisher.description}</p>

                <ul className="space-y-1.5 text-xs text-white font-semibold bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  {currentWorkout.finisher.tasks.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-[11px] font-bold">
                        {i + 1}
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                {(finisherTimer.active || finisherTimer.seconds > 0) && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-rose-400">
                        {finisherTimer.mode} • Runda {Math.floor(finisherTimer.seconds / 60) + 1}
                      </span>
                      <p className="text-2xl font-black text-white font-mono">
                        {String(Math.floor((finisherTimer.totalSeconds - finisherTimer.seconds) / 60)).padStart(2, '0')}:
                        {String((finisherTimer.totalSeconds - finisherTimer.seconds) % 60).padStart(2, '0')}
                      </p>
                    </div>
                    <button
                      onClick={() => setFinisherTimer({ active: false, seconds: 0, mode: 'EMOM', totalSeconds: 300 })}
                      className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="grid sm:grid-cols-3 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Wynik (np. 4 rundy / 5x4 kcal)"
                    value={currentFinisherLog.rounds}
                    onChange={(e) => updateFinisherLog('rounds', e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Czas / obciążenie"
                    value={currentFinisherLog.kcalOrTime}
                    onChange={(e) => updateFinisherLog('kcalOrTime', e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <button
                    onClick={() => updateFinisherLog('completed', !currentFinisherLog.completed)}
                    className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 ${
                      currentFinisherLog.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{currentFinisherLog.completed ? 'Finisher Zrobiony!' : 'Odhacz Finisher'}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* PŁYWAJĄCY STOPER PRZERWY */}
      {restTimer.active && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 bg-slate-900/95 backdrop-blur-md border-2 border-rose-500 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase text-rose-400 block">Przerwa • {restTimer.label}</span>
            <span className="text-2xl font-black font-mono text-white">
              {Math.floor(restTimer.remaining / 60)}:{String(restTimer.remaining % 60).padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRestTimer((prev) => ({ ...prev, remaining: Math.max(0, prev.remaining - 15) }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300"
            >
              -15s
            </button>
            <button
              onClick={() => setRestTimer((prev) => ({ ...prev, remaining: prev.remaining + 15 }))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300"
            >
              +15s
            </button>
            <button
              onClick={() => setRestTimer({ active: false, remaining: 0, total: 0, label: '' })}
              className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold"
            >
              Pomiń
            </button>
          </div>
        </div>
      )}

      {/* MODAL RAPORTU */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Gotowy raport dla Pawła 🐻</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
              {generatePawelReport()}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatePawelReport());
                setCopiedReport(true);
                setTimeout(() => setCopiedReport(false), 2500);
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedReport ? 'Skopiowano!' : 'Kopiuj raport do schowka'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL KOPII ZAPASOWEJ */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <span>Kopia zapasowa treningów</span>
              </h3>
              <button onClick={() => setShowBackupModal(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>
            <div className="grid gap-2.5">
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Pobierz kopię zapasową (.json)</span>
              </button>
              <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700">
                <Upload className="w-4 h-4" />
                <span>Wczytaj kopię zapasową z pliku</span>
                <input type="file" accept="application/json" className="hidden" onChange={handleImportBackup} />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}