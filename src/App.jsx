import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Video,
  ExternalLink,
  Copy,
  Volume2,
  VolumeX,
  Trash2,
  Upload,
  Download,
  ShieldCheck,
  Smartphone,
  Scale,
  AlertTriangle,
  Share2,
  Activity,
  Timer,
  Heart,
  Flame,
  Watch,
  RefreshCw,
  Sliders
} from 'lucide-react';

// --- BAZA DANYCH PLANU TRENINGOWEGO ---
const WORKOUT_PLAN = {
  1: {
    id: 1,
    shortTitle: 'Nogi i Core',
    title: 'Trening 1: Nogi i Core',
    subtitle: 'Siła dolnych partii • SkiErg EMOM',
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
        muscles: 'Mobilność bioder i dwugłowe',
        activeZones: ['quads', 'glutes', 'hamstrings'],
        cues: [
          'Złap czubki butów i zejdź do głębokiego przysiadu z prostymi plecami.',
          'Rozpychaj kolana łokciami na zewnątrz i otwórz klatkę.',
          'Wyprostuj kolana unosząc biodra wysoko bez puszczania stóp.'
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
        muscles: 'Przywodziciele i biodra',
        activeZones: ['quads', 'glutes'],
        cues: [
          'Stań szeroko i przenieś ciężar na jedną nogę, schodząc nisko.',
          'Druga noga prosta, palce stopy skieruj w sufit.',
          'Cała stopa nogi pracującej przyklejona do podłogi.'
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
        muscles: 'Aktywacja pośladków',
        activeZones: ['glutes', 'core'],
        cues: [
          'Aktywuj pośladek w pełnym zakresie ruchu, pilnując miednicy.',
          'Przytrzymaj napięcie przez 1s w każdym powtórzeniu.'
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
        muscles: 'Core – antyrotacja',
        activeZones: ['core', 'shoulders'],
        cues: [
          'Stań bokiem do wyciągu lub gumy na wysokości mostka.',
          'Wyciśnij uchwyt przed klatkę i zablokuj rotację tułowia.'
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
        muscles: 'Dwugłowe uda i pośladki',
        activeZones: ['hamstrings', 'glutes', 'core'],
        cues: [
          'Pięty wbij w piłkę gimnastyczną, unieś biodra wysoko.',
          'Przyciągnij piłkę piętami pod pośladki bez opuszczania bioder.'
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
        muscles: 'Rozgrzewka całego ciała',
        activeZones: ['quads', 'back', 'core'],
        cues: [
          'Odepchnięcie nogami -> odchylenie tułowia -> przyciągnięcie rąk.',
          'Powrót: wyprost rąk -> pochylenie tułowia -> ugięcie kolan.'
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
          'Trzymaj ciężar pionowo przy mostku, łokcie skierowane w dół.',
          'Zejdź poniżej kąta prostego w kolanach z prostymi plecami.',
          'Wstawaj dynamicznie, pchając całą stopą w podłogę.'
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
        muscles: 'Obręcz barkowa, core',
        activeZones: ['shoulders', 'core'],
        cues: [
          'Złap talerz oburącz i wykonuj ciasne krążenia wokół głowy.',
          'Brzuch i pośladki mocno spięte – biodra stoją nieruchomo.'
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
        muscles: 'Pośladki, czworogłowe uda',
        activeZones: ['quads', 'glutes'],
        cues: [
          'Stawiaj kroki na szerokość bioder.',
          'Tylne kolano schodzi nisko nad ziemię, wychodź z przedniej pięty.'
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
        muscles: 'Dwugłowy uda, pośladek',
        activeZones: ['hamstrings', 'glutes', 'back'],
        cues: [
          'Odblokuj kolano nogi postawnej i cofaj biodro daleko w tył.',
          'Nie otwieraj biodra na bok – oba kolce biodrowe patrzą w ziemię.'
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
        muscles: 'Mięśnie skośne, stabilizacja barku',
        activeZones: ['core', 'shoulders', 'glutes'],
        cues: [
          'Stopy pod kątem 45° w stronę przeciwną do uniesionego ciężaru.',
          'Wypchnij biodro nad tylną nogę, wzrok cały czas na ciężarze.'
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
        timedSeconds: 30,
        targetMaxReps: 30,
        rest: 0,
        notes: 'Superseria z A2; na stronę',
        unilateral: true,
        barbell: false,
        superset: 'A1 • 0s przerwy',
        muscles: 'Przywodziciele uda, core',
        activeZones: ['core', 'quads'],
        cues: [
          'Podpór bokiem na przedramieniu, górna noga na ławce.',
          'Utrzymaj biodra wysoko w jednej linii przez 20-30s.'
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
        superset: 'A2 • 60s przerwy',
        muscles: 'Przywodziciele uda',
        activeZones: ['quads', 'core'],
        cues: [
          'Leżąc na boku unoś dolną, wyprostowaną nogę jak najwyżej.',
          'Kontroluj opuszczanie przez 2 sekundy.'
        ],
        ytQuery: 'side lying hip adduction exercise'
      }
    ],
    finisher: {
      type: 'EMOM',
      title: 'Finisher: EMOM 5 min (SkiErg)',
      durationMinutes: 5,
      description: 'W każdej minucie wykonaj 4 kcal na SkiErg. Reszta minuty to Twoja przerwa.',
      tasks: ['4 kcal na SkiErg co minutę (5 rund)']
    }
  },
  2: {
    id: 2,
    shortTitle: 'Góra Ciała',
    title: 'Trening 2: Góra Ciała',
    subtitle: 'Siła góry, pośladki • 2 Obwody',
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
        muscles: 'Rotacja odcinka piersiowego',
        activeZones: ['back', 'shoulders'],
        cues: [
          'W klęku podpartym wsuń rękę pod pachą drugiej, kładąc bark na macie.',
          'Otwórz klatkę wysoko do sufitu, prowadząc wzrok za dłonią.'
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
        muscles: 'Mobilność najszerszego i barków',
        activeZones: ['back', 'shoulders'],
        cues: [
          'Złap kijek podchwytem, oprzyj łokcie na ławce i cofnij biodra do pięt.',
          'Opuść klatkę między ramiona.'
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
        muscles: 'Rotacja bioder',
        activeZones: ['glutes'],
        cues: [
          'Usiądź z nogami ugiętymi pod kątem 90 stopni.',
          'Przekładaj kolana płynnie ze strony na stronę z prostym tułowiem.'
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
        muscles: 'Aktywacja łopatek',
        activeZones: ['back', 'shoulders'],
        cues: [
          'Zawiśnij na drążku na prostych łokciach.',
          'Ściągnij same łopatki mocno w dół, oddalając barki od uszu.'
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
        muscles: 'Mobilność kręgosłupa',
        activeZones: ['back', 'core'],
        cues: [
          'Z wydechem zaokrąglij plecy, z wdechem otwórz klatkę do przodu.'
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
        muscles: 'Klatka, barki, triceps',
        activeZones: ['chest', 'shoulders', 'arms'],
        cues: [
          'Ściągnij łopatki wbijając je w ławkę, stopy stabilnie na ziemi.',
          'Opuszczaj sztangę na dolną część mostka i wyciskaj dynamicznie.'
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
        muscles: 'Najszerszy grzbietu, core',
        activeZones: ['back', 'arms', 'core'],
        cues: [
          'Szeroki rozkrok nad dwoma KB, proste plecy w opadzie.',
          'Jedna ręka wciska KB w ziemię, druga wiosłuje łokciem do biodra.'
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
        muscles: 'Pośladki, dwugłowe uda',
        activeZones: ['glutes', 'hamstrings'],
        cues: [
          'Oprzyj dół łopatek o ławkę, broda przyciągnięta do mostka.',
          'W górze piszczele pionowo – przytrzymaj dopięcie pośladków 1-2s.'
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
        muscles: 'Boczny akton barku',
        activeZones: ['shoulders'],
        cues: [
          'Unoś hantle lekko po skosie przed sobą do wysokości barków.',
          'Zero bujania tułowiem.'
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
          'Pochyl lekko tułów i wchodź wyłącznie siłą nogi postawionej na skrzyni.',
          'Opuszczaj się pod kontrolą przez 2-3 sekundy.'
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
        superset: 'A1 • 0s przerwy',
        muscles: 'Biceps',
        activeZones: ['arms'],
        cues: [
          'Łokcie przyklejone do boków tułowia, pełny zakres ruchu.'
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
        superset: 'A2 • 60s przerwy',
        muscles: 'Triceps',
        activeZones: ['arms'],
        cues: [
          'Zablokuj łokcie przy żebrach, na dole rozdziel końcówki sznura na boki.'
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
        muscles: 'Głęboki core',
        activeZones: ['core'],
        cues: [
          'Odcinek lędźwiowy na 100% wklejony w matę przez całą serię.',
          'Wyciągaj powoli przeciwległą rękę i nogę z wydechem.'
        ],
        ytQuery: 'dead bug core exercise proper form'
      }
    ],
    finisher: {
      type: 'CIRCUIT',
      title: 'Finisher: 2 Obwody (120s przerwy)',
      restBetweenRounds: 120,
      rounds: 2,
      description: 'Wykonaj 4 ćwiczenia pod rząd, odpocznij 120s i powtórz 2. obwód.',
      tasks: [
        'Cossack squat TRX – 15 powt. na stronę',
        'Russian kettlebell swing – 15 powt.',
        'Burpees w miejscu – 10 powt.',
        'Single leg calf raises – 10 powt. na nogę'
      ]
    }
  },
  3: {
    id: 3,
    shortTitle: 'Full Body',
    title: 'Trening 3: Full Body Workout',
    subtitle: 'Całe ciało • AMRAP 6 min',
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
        muscles: 'Kompleksowa mobilność',
        activeZones: ['glutes', 'back', 'hamstrings'],
        cues: [
          'Głęboki wykrok, łokieć do kostki, następnie rotacja ręki do sufitu.'
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
        muscles: 'Stabilizacja core i pośladek',
        activeZones: ['core', 'glutes', 'back'],
        cues: [
          'Wyciągnij przeciwległą rękę i nogę bez poruszania miednicą.'
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
        muscles: 'Tylny akton barku i łopatki',
        activeZones: ['shoulders', 'back'],
        cues: [
          'Proste łokcie, rozciągaj gumę do klatki ściskając łopatki.'
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
        muscles: 'Core i obręcz barkowa',
        activeZones: ['core', 'shoulders', 'quads'],
        cues: [
          'Kolana 3 cm nad ziemią, krótkie kroki naprzemienne z prostymi plecami.'
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
        muscles: 'Mobilność bioder i kolan',
        activeZones: ['quads', 'glutes'],
        cues: [
          'Zatrzymaj ruch na pełne 2 sekundy na dole przysiadu.'
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
        muscles: 'Dwugłowe uda, pośladki',
        activeZones: ['hamstrings', 'glutes', 'back'],
        cues: [
          'Prowadź ciężar blisko nóg wypychając biodra daleko w tył.'
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
        muscles: 'Barki, triceps',
        activeZones: ['shoulders', 'arms'],
        cues: [
          'Plecy stabilnie na oparciu, łokcie lekko przed linią tułowia.'
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
        muscles: 'Najszerszy grzbietu',
        activeZones: ['back', 'arms'],
        cues: [
          'Zacznij od ściągnięcia łopatek w dół, prowadź drążek do mostka.'
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
        muscles: 'Pośladek, czworogłowy uda',
        activeZones: ['glutes', 'quads'],
        cues: [
          '90% ciężaru na nodze przedniej, lekko pochylony tułów.'
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
        muscles: 'Tylny akton barku, rotatory',
        activeZones: ['shoulders', 'back'],
        cues: [
          'Ciągnij sznur w stronę czoła, kciuki rotuj za głowę.'
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
        timedSeconds: 60,
        targetMaxReps: 60,
        rest: 60,
        notes: 'Deska klasyczna',
        unilateral: false,
        barbell: false,
        muscles: 'Core',
        activeZones: ['core', 'shoulders'],
        cues: [
          'Podwiń miednicę, mocno zepnij pośladki i brzuch.'
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
        muscles: 'Chwyt, core, czworoboczny',
        activeZones: ['core', 'shoulders', 'quads'],
        cues: [
          'Barki ściągnięte w dół, szybkie i krótkie kroki bez kołysania.'
        ],
        ytQuery: 'farmers walk proper form'
      }
    ],
    finisher: {
      type: 'AMRAP',
      title: 'Finisher: AMRAP 6 min',
      durationMinutes: 6,
      description: 'Zrób jak najwięcej obwodów w 6 minut i zapisz wynik.',
      tasks: [
        '10x Wall Ball (lub DB Thrusters)',
        '10x Box jumps (wskoki lub wejścia)',
        '150m na wioślarzu (Ergometr)'
      ]
    }
  }
};

// --- SYMULATOR RUCHU W KOLORYSTYCE PEACH / CORAL & BLACK ---
function AnatomicalExerciseAnimator({ exercise }) {
  const [phase, setPhase] = useState(0);
  const [slowMo, setSlowMo] = useState(false);

  useEffect(() => {
    let frameId;
    let start = performance.now();
    const duration = slowMo ? 4400 : 2200;

    const loop = (now) => {
      const elapsed = (now - start) % duration;
      const rawProgress = elapsed / duration;
      const p = 0.5 - 0.5 * Math.cos(rawProgress * Math.PI * 2);
      setPhase(p);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [slowMo]);

  const lerp = (a, b, t) => a + (b - a) * t;
  const zones = exercise.activeZones || [];
  const isActive = (z) => zones.includes(z);

  const skinColor = '#F3C6B6';
  const skinBackColor = '#E2B1A0';
  const activeMuscleColor = '#E0533C';
  const outfitTop = '#141414';
  const outfitShorts = '#141414';

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
    phaseLabel: phase < 0.3 ? 'Start' : phase > 0.7 ? 'Spięcie (RIR 2)' : 'Praca'
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
        phaseLabel: t > 0.65 ? 'Dół przysiadu' : 'Wyprost'
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
        phaseLabel: t > 0.65 ? 'Zejście w dół' : 'Góra z przedniej pięty'
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
        phaseLabel: isRow ? 'Wiosłowanie do biodra' : 'Hip Hinge (proste plecy)'
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
        phaseLabel: 'Waga jednonóż'
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
        phaseLabel: 'Wzrok na ciężarze'
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
        phaseLabel: t > 0.6 ? 'Sztanga do mostka' : 'Wyciśnięcie'
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
        phaseLabel: t > 0.65 ? 'Dopięcie pośladków' : 'Opuszczenie bioder'
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
        phaseLabel: isPull ? 'Ściągnięcie łopatek' : 'Wyciskanie nad głowę'
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
        elbowPos = { x: lerp(138, 154, t), y: 92 };
        wristPos = { x: lerp(148, 184, t), y: 88 };
      }
      pose = { ...pose, elbow: elbowPos, wrist: wristPos, phaseLabel: 'Kontrola napięcia' };
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
          phaseLabel: 'Lędźwie dociśnięte'
        };
      } else if (mode === 'ball_curl') {
        pose = {
          ...pose,
          head: { x: 64, y: 182 },
          shoulder: { x: 88, y: 182 },
          hip: { x: 136, y: lerp(156, 142, t) },
          kneeFront: { x: lerp(176, 158, t), y: lerp(144, 118, t) },
          ankleFront: { x: lerp(212, 178, t), y: 152 },
          kneeBack: { x: lerp(174, 156, t), y: lerp(144, 118, t) },
          ankleBack: { x: 210, y: 176, t), y: 152 },
          elbow: { x: 108, y: 186 },
          wrist: { x: 132, y: 188 },
          phaseLabel: 'Biodra wysoko'
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
          phaseLabel: 'Stabilny core'
        };
      } else {
        const lift = lerp(0, -6, t);
        pose = {
          ...pose,
          head: { x: 68, y: 136 + lift },
          shoulder: { x: 92, y: 142 + lift },
          hip: { x: 144, y: 152 + lift },
          kneeFront: { x: 178, y: 162 + lift },
          ankleFront: { x: 210, y: 172 },
          kneeBack: { x: 178, y: lerp(186, 166, t) },
          ankleBack: { x: 210, y: 176, t), y: 176 },
          elbow: { x: 88, y: 188 },
          wrist: { x: 112, y: 190 },
          phaseLabel: 'Izometria'
        };
      }
      break;
    }
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
          phaseLabel: 'Ergometr'
        };
      } else {
        const step = Math.sin(t * Math.PI * 2) * 14;
        pose = {
          ...pose,
          kneeFront: { x: 130 + step, y: 164 },
          ankleFront: { x: 130 + step * 1.3, y: 204 },
          kneeBack: { x: 130 - step, y: 164 },
          ankleBack: { x: 130 - step * 1.3, y: 204 },
          elbow: { x: 130, y: 106 },
          wrist: { x: 130, y: 136 },
          phaseLabel: 'Stabilny marsz'
        };
      }
      break;
    }
  }

  return (
    <div className="bg-[#FFF6F3] rounded-[24px] p-3 flex flex-col justify-between border border-[#F3D5CE]">
      <div className="flex items-center justify-between gap-2 pb-2">
        <span className="text-xs font-bold text-[#141414]">{pose.phaseLabel}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSlowMo(!slowMo)}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition ${
              slowMo ? 'bg-[#141414] text-white' : 'bg-white text-[#141414] border border-[#141414]/15'
            }`}
          >
            {slowMo ? '0.5x' : '1.0x'}
          </button>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.ytQuery)}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F8B4A6] text-[#141414] flex items-center gap-1"
          >
            <span>YT</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="relative w-full h-52 bg-[#F9E5E0] rounded-[18px] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 260 225" className="w-full h-full">
          <line x1="25" y1="206" x2="235" y2="206" stroke="#E5B8AD" strokeWidth="4" strokeLinecap="round" />

          {(exercise.animType === 'bench_press' || exercise.animType === 'hip_thrust' || exercise.equipment === 'bench') && (
            <g>
              <rect x="52" y="146" width="90" height="10" rx="5" fill="#141414" />
              <line x1="65" y1="156" x2="65" y2="205" stroke="#8C736E" strokeWidth="5" />
              <line x1="128" y1="156" x2="128" y2="205" stroke="#8C736E" strokeWidth="5" />
            </g>
          )}

          {exercise.equipment === 'bench_back' && (
            <g>
              <rect x="58" y="162" width="42" height="10" rx="4" fill="#141414" />
              <line x1="68" y1="172" x2="68" y2="205" stroke="#8C736E" strokeWidth="4" />
              <line x1="90" y1="172" x2="90" y2="205" stroke="#8C736E" strokeWidth="4" />
            </g>
          )}

          {exercise.equipment === 'ball' && (
            <circle cx={pose.ankleFront.x} cy="180" r="24" fill="#F8B4A6" stroke="#E0533C" strokeWidth="2.5" />
          )}

          <line
            x1={pose.hip.x}
            y1={pose.hip.y}
            x2={pose.kneeBack.x}
            y2={pose.kneeBack.y}
            stroke={isActive('hamstrings') || isActive('quads') ? activeMuscleColor : skinBackColor}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <line
            x1={pose.kneeBack.x}
            y1={pose.kneeBack.y}
            x2={pose.ankleBack.x}
            y2={pose.ankleBack.y}
            stroke={skinBackColor}
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          <ellipse cx={pose.ankleBack.x + 4} cy={pose.ankleBack.y} rx="9" ry="4.5" fill="#141414" />

          <line
            x1={pose.shoulder.x}
            y1={pose.shoulder.y}
            x2={pose.hip.x}
            y2={pose.hip.y}
            stroke={isActive('core') || isActive('back') || isActive('chest') ? activeMuscleColor : outfitTop}
            strokeWidth="18"
            strokeLinecap="round"
          />

          <circle
            cx={pose.hip.x - 2}
            cy={pose.hip.y}
            r="11"
            fill={isActive('glutes') ? activeMuscleColor : outfitShorts}
          />

          <line
            x1={pose.hip.x}
            y1={pose.hip.y}
            x2={pose.kneeFront.x}
            y2={pose.kneeFront.y}
            stroke={isActive('quads') || isActive('hamstrings') ? activeMuscleColor : skinColor}
            strokeWidth="13"
            strokeLinecap="round"
          />
          <line
            x1={pose.kneeFront.x}
            y1={pose.kneeFront.y}
            x2={pose.ankleFront.x}
            y2={pose.ankleFront.y}
            stroke={skinColor}
            strokeWidth="9.5"
            strokeLinecap="round"
          />
          <circle cx={pose.kneeFront.x} cy={pose.kneeFront.y} r="5" fill="#FFF6F3" />
          <path
            d={`M ${pose.ankleFront.x - 6} ${pose.ankleFront.y - 3} L ${pose.ankleFront.x + 12} ${pose.ankleFront.y - 1} L ${pose.ankleFront.x + 13} ${pose.ankleFront.y + 4} L ${pose.ankleFront.x - 7} ${pose.ankleFront.y + 4} Z`}
            fill="#141414"
          />

          <line
            x1={pose.shoulder.x}
            y1={pose.shoulder.y}
            x2={pose.head.x}
            y2={pose.head.y}
            stroke={skinColor}
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d={`M ${pose.head.x - 10} ${pose.head.y - 5} Q ${pose.head.x - 26} ${pose.head.y - 12} ${pose.head.x - 23} ${pose.head.y + 10}`}
            fill="none"
            stroke="#141414"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle cx={pose.head.x} cy={pose.head.y} r="12" fill={skinColor} />
          <circle cx={pose.head.x - 11} cy={pose.head.y - 5} r="3" fill="#E0533C" />

          <circle
            cx={pose.shoulder.x}
            cy={pose.shoulder.y}
            r="7.5"
            fill={isActive('shoulders') ? activeMuscleColor : outfitTop}
          />
          <line
            x1={pose.shoulder.x}
            y1={pose.shoulder.y}
            x2={pose.elbow.x}
            y2={pose.elbow.y}
            stroke={isActive('arms') || isActive('shoulders') ? activeMuscleColor : skinColor}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <line
            x1={pose.elbow.x}
            y1={pose.elbow.y}
            x2={pose.wrist.x}
            y2={pose.wrist.y}
            stroke={isActive('arms') ? activeMuscleColor : skinColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx={pose.wrist.x} cy={pose.wrist.y} r="4" fill="#FFF6F3" />

          {(exercise.equipment === 'kb_chest' ||
            exercise.equipment === 'kb_low' ||
            exercise.equipment === 'kb_overhead') && (
            <g transform={`translate(${pose.wrist.x}, ${pose.wrist.y})`}>
              <path d="M -5 -4 C -5 -10, 5 -10, 5 -4" fill="none" stroke="#141414" strokeWidth="3" />
              <circle cx="0" cy="5" r="9.5" fill="#141414" />
              <text x="0" y="8" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#ffffff">
                KB
              </text>
            </g>
          )}

          {exercise.equipment === 'barbell' && (
            <g transform={`translate(${pose.wrist.x}, ${pose.wrist.y})`}>
              <circle cx="0" cy="0" r="14" fill="#141414" stroke="#E0533C" strokeWidth="3" />
              <circle cx="0" cy="0" r="4" fill="#FFF6F3" />
            </g>
          )}

          {(exercise.equipment === 'db_sides' ||
            exercise.equipment === 'db_overhead' ||
            exercise.equipment === 'plate') && (
            <g transform={`translate(${pose.wrist.x}, ${pose.wrist.y})`}>
              <rect x="-9" y="-4" width="18" height="8" rx="3" fill="#141414" />
            </g>
          )}

          {exercise.equipment === 'cable' && (
            <line
              x1="235"
              y1="85"
              x2={pose.wrist.x}
              y2={pose.wrist.y}
              stroke="#141414"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />
          )}

          {(exercise.equipment === 'pullup_bar' || exercise.equipment === 'lat_bar') && (
            <g>
              <line x1="90" y1="18" x2="175" y2="18" stroke="#141414" strokeWidth="5" strokeLinecap="round" />
              <line x1="132" y1="18" x2={pose.wrist.x} y2={pose.wrist.y} stroke="#E0533C" strokeWidth="2.5" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// --- KOMPONENT INTEGRACJI ZE STRAVA API ---
function StravaGarminSection({ selectedWeek, selectedWorkout, logs, setLogs }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stravaToken, setStravaToken] = useState(() => localStorage.getItem('strava_access_token') || '');
  const [stravaClientId, setStravaClientId] = useState(() => localStorage.getItem('strava_client_id') || '');
  const [stravaClientSecret, setStravaClientSecret] = useState(() => localStorage.getItem('strava_client_secret') || '');

  // Dane zegarka dla tego konkretnego treningu
  const currentGarminData = logs[selectedWeek]?.[`garmin_w${selectedWorkout}`] || {
    durationMinutes: '',
    avgHr: '',
    maxHr: '',
    calories: '',
    activityName: '',
    syncedAt: null
  };

  const updateGarminData = (fields) => {
    setLogs((prev) => ({
      ...prev,
      [selectedWeek]: {
        ...(prev[selectedWeek] || {}),
        [`garmin_w${selectedWorkout}`]: {
          ...currentGarminData,
          ...fields
        }
      }
    }));
  };

  const saveStravaCredentials = () => {
    localStorage.setItem('strava_access_token', stravaToken.trim());
    localStorage.setItem('strava_client_id', stravaClientId.trim());
    localStorage.setItem('strava_client_secret', stravaClientSecret.trim());
    setIsConfigOpen(false);
    alert('Zapisano dane Stravy na Twoim telefonie!');
  };

  // Pobranie ostatniej aktywności ze Strava API
  const fetchLatestStravaActivity = async () => {
    const token = stravaToken.trim();
    if (!token) {
      setIsConfigOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Błąd autoryzacji Strava. Sprawdź swój token.');
      }

      const activities = await res.json();
      if (!activities || activities.length === 0) {
        alert('Nie znaleziono żadnych ostatnich aktywności na Stravie.');
        setIsLoading(false);
        return;
      }

      const act = activities[0];
      const durationMin = Math.round((act.moving_time || act.elapsed_time || 0) / 60);
      const calories = act.calories ? Math.round(act.calories) : act.kilojoules ? Math.round(act.kilojoules * 0.239) : '';
      const avgHr = act.average_heartrate ? Math.round(act.average_heartrate) : '';
      const maxHr = act.max_heartrate ? Math.round(act.max_heartrate) : '';

      updateGarminData({
        durationMinutes: durationMin || '',
        calories: calories || '',
        avgHr: avgHr || '',
        maxHr: maxHr || '',
        activityName: act.name || 'Trening',
        syncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      alert(err.message || 'Nie udało się pobrać danych ze Stravy.');
      setIsConfigOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8B4A6] rounded-[30px] p-5 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#141414] text-white flex items-center justify-center">
            <Watch className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#141414]">
              Dane z zegarka (Garmin • Strava)
            </h3>
            <p className="text-[11px] font-semibold text-[#141414]/70">
              {currentGarminData.syncedAt
                ? `Zsynchronizowano o ${currentGarminData.syncedAt} (${currentGarminData.activityName})`
                : 'Automatycznie pobierz tętno i spalone kcal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            title="Ustawienia połączenia ze Stravą"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#141414] flex items-center justify-center shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={fetchLatestStravaActivity}
            disabled={isLoading}
            className="px-4 py-2 rounded-full bg-[#141414] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Pobieram...' : 'Pobierz ze Stravy'}</span>
          </button>
        </div>
      </div>

      {/* Formularz konfiguracji tokenu Strava */}
      {isConfigOpen && (
        <div className="p-4 rounded-[22px] bg-[#FFF6F3] space-y-2.5 text-xs text-[#141414]">
          <p className="font-bold">Konfiguracja Strava API (jednorazowo):</p>
          <p className="text-[11px] text-[#7A625D]">
            Wygeneruj darmowy token na <strong>strava.com/settings/api</strong> i wklej poniżej:
          </p>
          <input
            type="text"
            placeholder="Strava Access Token..."
            value={stravaToken}
            onChange={(e) => setStravaToken(e.target.value)}
            className="w-full px-3 py-2 rounded-full bg-white text-xs font-mono outline-none border border-[#F3D5CE]"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="px-3 py-1.5 rounded-full bg-[#F9E5E0] font-bold text-xs"
            >
              Anuluj
            </button>
            <button
              onClick={saveStravaCredentials}
              className="px-4 py-1.5 rounded-full bg-[#141414] text-white font-bold text-xs"
            >
              Zapisz token
            </button>
          </div>
        </div>
      )}

      {/* 4 Pastelowe Kafelki Wyników z Zegarka (z opcją ręcznej edycji w 3 sekundy) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[#FFF6F3] p-3 rounded-[20px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7A625D]">
            <span className="text-[10px] font-extrabold uppercase">Czas</span>
            <Timer className="w-3.5 h-3.5 text-[#141414]" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <input
              type="number"
              placeholder="0"
              value={currentGarminData.durationMinutes}
              onChange={(e) => updateGarminData({ durationMinutes: e.target.value })}
              className="w-full text-lg font-black text-[#141414] bg-transparent outline-none"
            />
            <span className="text-xs font-bold text-[#7A625D]">min</span>
          </div>
        </div>

        <div className="bg-[#FFF6F3] p-3 rounded-[20px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7A625D]">
            <span className="text-[10px] font-extrabold uppercase">Kalorie</span>
            <Flame className="w-3.5 h-3.5 text-[#E0533C]" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <input
              type="number"
              placeholder="0"
              value={currentGarminData.calories}
              onChange={(e) => updateGarminData({ calories: e.target.value })}
              className="w-full text-lg font-black text-[#141414] bg-transparent outline-none"
            />
            <span className="text-xs font-bold text-[#7A625D]">kcal</span>
          </div>
        </div>

        <div className="bg-[#FFF6F3] p-3 rounded-[20px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7A625D]">
            <span className="text-[10px] font-extrabold uppercase">Śr. Tętno</span>
            <Heart className="w-3.5 h-3.5 text-[#E0533C]" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <input
              type="number"
              placeholder="0"
              value={currentGarminData.avgHr}
              onChange={(e) => updateGarminData({ avgHr: e.target.value })}
              className="w-full text-lg font-black text-[#141414] bg-transparent outline-none"
            />
            <span className="text-xs font-bold text-[#7A625D]">bpm</span>
          </div>
        </div>

        <div className="bg-[#FFF6F3] p-3 rounded-[20px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7A625D]">
            <span className="text-[10px] font-extrabold uppercase">Max Tętno</span>
            <Activity className="w-3.5 h-3.5 text-[#E0533C]" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <input
              type="number"
              placeholder="0"
              value={currentGarminData.maxHr}
              onChange={(e) => updateGarminData({ maxHr: e.target.value })}
              className="w-full text-lg font-black text-[#141414] bg-transparent outline-none"
            />
            <span className="text-xs font-bold text-[#7A625D]">bpm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Eksport całości
export { StravaGarminSection };