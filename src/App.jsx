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
  Timer
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
          ankleBack: { x: lerp(210, 176, t), y: 152 },
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
          ankleBack: { x: 210, y: lerp(194, 176, t) },
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

// --- INDEXED-DB DO ZAPISU FILMIKÓW ---
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

  // Główny stoper na dole (przerwy między seriami + ćwiczenia na czas jak Plank i Copenhagen)
  // { active, paused, mode: 'REST' | 'WORK', remaining, total, endTime, label, nextRest }
  const [bottomTimer, setBottomTimer] = useState({
    active: false,
    paused: false,
    mode: 'REST',
    remaining: 0,
    total: 0,
    endTime: 0,
    label: '',
    nextRest: 0
  });

  // Stoper Finishera (odporny na blokadę ekranu dzięki startTime)
  const [finisherTimer, setFinisherTimer] = useState({
    active: false,
    seconds: 0,
    mode: 'EMOM',
    totalSeconds: 300,
    startTime: 0
  });

  const wakeLockRef = useRef(null);
  const lastBeepSecRef = useRef(-1);
  const lastFinisherBeepRef = useRef(-1);

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
      console.error(e);
    }
  };

  useEffect(() => {
    refreshVideosFromDB();
  }, []);

  const toggleWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      alert('Brak wsparcia blokady ekranu w tej przeglądarce.');
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
        wakeLockRef.current.addEventListener('release', () => setWakeLockActive(false));
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
      // ignore
    }
  };

  // Start stopera przerwy lub ćwiczenia na czas (Plank / Copenhagen)
  const startBottomTimer = (seconds, label, mode = 'REST', nextRest = 0) => {
    lastBeepSecRef.current = -1;
    setBottomTimer({
      active: true,
      paused: false,
      mode,
      remaining: seconds,
      total: seconds,
      endTime: Date.now() + seconds * 1000,
      label,
      nextRest
    });
  };

  const togglePauseBottomTimer = () => {
    setBottomTimer((prev) => {
      if (!prev.active) return prev;
      if (!prev.paused) {
        return { ...prev, paused: true };
      } else {
        return {
          ...prev,
          paused: false,
          endTime: Date.now() + prev.remaining * 1000
        };
      }
    });
  };

  const adjustBottomTimer = (deltaSec) => {
    setBottomTimer((prev) => {
      if (!prev.active) return prev;
      const nextRem = Math.max(0, prev.remaining + deltaSec);
      const nextTot = Math.max(prev.total, nextRem);
      return {
        ...prev,
        remaining: nextRem,
        total: nextTot,
        endTime: Date.now() + nextRem * 1000
      };
    });
  };

  // Odliczanie dolnego stopera oparte o Date.now() (działa dokładnie nawet po zablokowaniu iPhone'a)
  useEffect(() => {
    if (!bottomTimer.active || bottomTimer.paused) return;

    const interval = setInterval(() => {
      const rem = Math.max(0, Math.ceil((bottomTimer.endTime - Date.now()) / 1000));

      if (rem !== lastBeepSecRef.current) {
        lastBeepSecRef.current = rem;
        if (rem > 0 && rem <= 3) {
          playBeep(660, 0.12);
        }
      }

      if (rem <= 0) {
        playBeep(1046, 0.35);
        // Jeśli to był stoper pracy (np. Plank 60s) i ćwiczenie ma przerwę, automatycznie odpal przerwę
        if (bottomTimer.mode === 'WORK' && bottomTimer.nextRest > 0) {
          startBottomTimer(bottomTimer.nextRest, `Przerwa po: ${bottomTimer.label}`, 'REST', 0);
        } else {
          setBottomTimer((prev) => ({ ...prev, active: false, remaining: 0 }));
        }
      } else {
        setBottomTimer((prev) => ({ ...prev, remaining: rem }));
      }
    }, 250);

    return () => clearInterval(interval);
  }, [bottomTimer]);

  // Odliczanie stopera Finishera oparte o Date.now()
  useEffect(() => {
    if (!finisherTimer.active) return;

    const interval = setInterval(() => {
      const elapsed = Math.min(
        finisherTimer.totalSeconds,
        Math.floor((Date.now() - finisherTimer.startTime) / 1000)
      );

      if (elapsed !== lastFinisherBeepRef.current) {
        lastFinisherBeepRef.current = elapsed;
        if (finisherTimer.mode === 'EMOM' && elapsed > 0 && elapsed % 60 === 0 && elapsed < finisherTimer.totalSeconds) {
          playBeep(987, 0.35);
        } else if (finisherTimer.mode === 'EMOM' && elapsed % 60 >= 57) {
          playBeep(550, 0.1);
        }
      }

      if (elapsed >= finisherTimer.totalSeconds) {
        playBeep(1046, 0.5);
        setFinisherTimer((prev) => ({ ...prev, active: false, seconds: prev.totalSeconds }));
      } else {
        setFinisherTimer((prev) => ({ ...prev, seconds: elapsed }));
      }
    }, 250);

    return () => clearInterval(interval);
  }, [finisherTimer]);

  const toggleFinisherTimer = (mode, totalSeconds) => {
    setFinisherTimer((prev) => {
      if (prev.active) {
        return { ...prev, active: false };
      }
      const alreadyElapsed = prev.seconds >= totalSeconds ? 0 : prev.seconds;
      lastFinisherBeepRef.current = alreadyElapsed;
      return {
        active: true,
        mode,
        totalSeconds,
        seconds: alreadyElapsed,
        startTime: Date.now() - alreadyElapsed * 1000
      };
    });
  };

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
    if (!isNaN(w)) {
      if (rir === '3-4' || rir === '5+' || (!isNaN(r) && exercise.targetMaxReps && r >= exercise.targetMaxReps && rir === '2')) {
        const increment = w >= 20 ? 2.5 : 1.5;
        suggestion = `Cel dziś: ${(w + increment).toFixed(1).replace('.0', '')} kg (T${selectedWeek - 1}: ${w}kg × ${prevSet.reps || '?'})`;
      } else {
        suggestion = `Tydz. ${selectedWeek - 1}: ${w} kg × ${prevSet.reps || '?'} (RIR ${rir})`;
      }
    } else {
      suggestion = `Tydz. ${selectedWeek - 1}: ${prevSet.reps} powt.`;
    }

    return { text: suggestion, prevWeight: prevSet.weight, prevReps: prevSet.reps };
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
      startBottomTimer(exercise.rest, exercise.name, 'REST', 0);
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
          text: `${videoObj.exerciseName} (Tydzień ${videoObj.week})`,
          files: [file]
        });
        return;
      } catch {
        // fallback
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
    a.download = `hyrox_plan_backup_t${selectedWeek}.json`;
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
        alert('Wczytano kopię zapasową.');
        setShowBackupModal(false);
      } catch {
        alert('Nieprawidłowy plik.');
      }
    };
    reader.readAsText(file);
  };

  const generatePawelReport = () => {
    const workout = WORKOUT_PLAN[selectedWorkout];
    const lines = [
      `RAPORT • TYDZIEŃ ${selectedWeek}`,
      `${workout.title}`,
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
        lines.push(`✓ ${ex.name}: ${setsStr}${exLog.recordedForPawel ? ' [Wideo]' : ''}`);
        if (exLog.note) lines.push(`  Notatka: ${exLog.note}`);
      } else {
        lines.push(`- ${ex.name}: brak wpisu`);
      }
    });

    const fLog = finisherLogs[selectedWeek]?.[selectedWorkout];
    lines.push(`────────────────────`);
    lines.push(
      `${workout.finisher.title}: ${
        fLog?.rounds || fLog?.kcalOrTime
          ? `${fLog.rounds ? fLog.rounds + ' ' : ''}${fLog.kcalOrTime ? '(' + fLog.kcalOrTime + ')' : ''}`
          : 'Zrobione'
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

  // Obliczenie % paska postępu dla dolnego stopera
  const bottomTimerPercent =
    bottomTimer.total > 0
      ? Math.min(100, Math.max(0, ((bottomTimer.total - bottomTimer.remaining) / bottomTimer.total) * 100))
      : 0;

  // Obliczenie % paska postępu dla Finishera
  const finisherPercent =
    finisherTimer.totalSeconds > 0
      ? Math.min(100, Math.max(0, (finisherTimer.seconds / finisherTimer.totalSeconds) * 100))
      : 0;

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
      className="min-h-screen bg-[#F8B4A6] text-[#141414] pb-32 selection:bg-[#141414] selection:text-white"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* GÓRNY OBSZAR W STYLU MAKIETY */}
      <div className="max-w-xl mx-auto px-4 pt-5 pb-4">
        <div className="flex items-center justify-between gap-2">
          {/* Biała pastylka z wbudowanym paskiem postępu treningu */}
          <div className="flex-1 bg-white rounded-full px-4 py-2 flex flex-col justify-center shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E0533C]" />
                <span className="text-xs font-extrabold tracking-tight text-[#141414]">
                  HYROX • TYDZIEŃ {selectedWeek}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#7A625D]">
                {completedMainSets}/{totalMainSets} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-1 bg-[#F9E5E0] rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#E0533C] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleWakeLock}
              title="Nie wygaszaj ekranu"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm ${
                wakeLockActive ? 'bg-[#141414] text-white' : 'bg-white text-[#141414]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm ${
                soundEnabled ? 'bg-white text-[#141414]' : 'bg-white/60 text-[#7A625D]'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="w-10 h-10 rounded-full bg-white text-[#141414] flex items-center justify-center shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wybór tygodnia 1-8 */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedWeek === w
                  ? 'bg-[#141414] text-white shadow-sm'
                  : 'bg-white/50 text-[#141414] hover:bg-white/80'
              }`}
            >
              Tydz. {w}
            </button>
          ))}
        </div>
      </div>

      {/* GŁÓWNA KARTA */}
      <main className="max-w-xl mx-auto bg-[#FFF6F3] rounded-t-[38px] rounded-b-[38px] px-5 pt-7 pb-10 shadow-xl min-h-[82vh]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#9A7B74]">
              Plan Treningowy • RIR 2
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#141414] leading-tight mt-0.5">
              {activeTab === 'workout'
                ? currentWorkout.shortTitle
                : activeTab === 'progress'
                ? 'Progres'
                : activeTab === 'videos'
                ? 'Moje wideo'
                : 'Skala RIR'}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F9E5E0] p-1 rounded-full">
            <button
              onClick={() => setActiveTab('workout')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'workout' ? 'bg-[#141414] text-white' : 'text-[#141414]'
              }`}
            >
              Plan
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'progress' ? 'bg-[#141414] text-white' : 'text-[#141414]'
              }`}
            >
              Wyniki
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'videos' ? 'bg-[#141414] text-white' : 'text-[#141414]'
              }`}
            >
              Wideo ({Object.keys(localVideos).length})
            </button>
            <button
              onClick={() => setActiveTab('rir_guide')}
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                activeTab === 'rir_guide' ? 'bg-[#141414] text-white' : 'text-[#141414]'
              }`}
            >
              ?
            </button>
          </div>
        </div>

        {/* PASTYLKI WYBORU TRENINGU */}
        {activeTab === 'workout' && (
          <div className="mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[1, 2, 3].map((id) => {
              const w = WORKOUT_PLAN[id];
              const isSelected = selectedWorkout === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedWorkout(id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-[#141414] text-white shadow-sm'
                      : 'bg-transparent text-[#141414] border border-[#141414]/35 hover:border-[#141414]'
                  }`}
                >
                  Trening {id} • {w.shortTitle}
                </button>
              );
            })}
          </div>
        )}

        {/* WIDOK: SKALA RIR */}
        {activeTab === 'rir_guide' && (
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-[24px] bg-[#F9E5E0]">
              <span className="px-2.5 py-1 rounded-full bg-[#141414] text-white text-[11px] font-bold">
                RIR 2 • Cel od 2. tygodnia
              </span>
              <p className="text-sm font-semibold text-[#141414] mt-2">
                Zostawiasz dokładnie 2 powtórzenia w zapasie (70–80% maksa). Czujesz mocną pracę, ale ostatnie 2 ruchy
                wciąż byłyby poprawne technicznie.
              </p>
            </div>
            <div className="p-4 rounded-[24px] bg-[#F9E5E0]">
              <span className="px-2.5 py-1 rounded-full bg-[#E0533C] text-white text-[11px] font-bold">
                RIR 5+ • Za lekko
              </span>
              <p className="text-sm font-semibold text-[#141414] mt-2">
                Jeśli po serii czujesz, że zrobisz jeszcze 5 powtórzeń, traktujesz ją jako rozgrzewkową i dokładasz
                ciężaru.
              </p>
            </div>
          </div>
        )}

        {/* WIDOK: MOJE WIDEO */}
        {activeTab === 'videos' && (
          <div className="mt-6">
            {Object.keys(localVideos).length === 0 ? (
              <div className="p-10 rounded-[28px] bg-[#F9E5E0] text-center text-sm font-semibold text-[#7A625D]">
                Brak wgranych filmików. Kliknij „+ Wideo” przy dowolnym ćwiczeniu.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.values(localVideos).map((vid) => (
                  <div key={vid.key} className="bg-[#F9E5E0] rounded-[24px] overflow-hidden p-3 space-y-2.5">
                    <video src={vid.url} controls playsInline className="w-full h-48 object-cover rounded-[16px] bg-black" />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#7A625D]">Tydzień {vid.week}</span>
                        <h3 className="font-bold text-sm text-[#141414]">{vid.exerciseName}</h3>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleShareVideo(vid)}
                          className="px-3 py-1.5 rounded-full bg-[#141414] text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Wyślij</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.key)}
                          className="p-1.5 rounded-full bg-white text-[#141414]"
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

        {/* WIDOK: TABELA PROGRESU 8 TYGODNI */}
        {activeTab === 'progress' && (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((wId) => (
              <div key={wId} className="bg-[#F9E5E0] rounded-[26px] p-4 overflow-x-auto">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#141414] mb-3">
                  {WORKOUT_PLAN[wId].title}
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#141414]/10 text-[#7A625D]">
                      <th className="py-1.5 pr-2">Ćwiczenie</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((wk) => (
                        <th key={wk} className="py-1.5 px-1 text-center">
                          T{wk}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141414]/5">
                    {WORKOUT_PLAN[wId].main.map((ex) => (
                      <tr key={ex.id}>
                        <td className="py-2 pr-2 font-bold text-[#141414]">{ex.name}</td>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((wk) => {
                          const l = logs[wk]?.[ex.id];
                          const weights =
                            l?.sets?.map((s) => parseFloat(s.weight)).filter((n) => !isNaN(n) && n > 0) || [];
                          const maxW = weights.length > 0 ? Math.max(...weights) : null;
                          return (
                            <td key={wk} className="py-2 px-1 text-center">
                              {maxW ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#141414] text-white font-bold text-[11px]">
                                  {maxW}
                                </span>
                              ) : (
                                <span className="text-[#9A7B74]">-</span>
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

        {/* WIDOK GŁÓWNY: TRENING */}
        {activeTab === 'workout' && (
          <div className="mt-6 space-y-6">
            {/* MOBILIZACJA (ROZGRZEWKA) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#7A625D]">
                  Mobilizacja (Rozgrzewka)
                </h2>
                <span className="text-xs font-bold text-[#7A625D]">{currentWorkout.warmup.length} ćwiczeń</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5">
                {currentWorkout.warmup.map((ex) => {
                  const exLog = getExerciseLog(selectedWeek, ex);
                  const isDemoOpen = !!openDemos[ex.id];
                  const videoKey = `w${selectedWeek}_${ex.id}`;
                  const uploadedVideo = localVideos[videoKey];
                  const allDone = exLog.sets.every((s) => s.done);

                  return (
                    <div
                      key={ex.id}
                      className={`rounded-[24px] p-3.5 transition flex flex-col justify-between gap-2.5 ${
                        allDone ? 'bg-[#F3D5CE]' : 'bg-[#F9E5E0]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-[#141414] leading-snug">{ex.name}</h3>
                          <p className="text-xs font-semibold text-[#7A625D] mt-0.5">
                            {ex.sets} × {ex.reps} • {ex.notes}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <label className="cursor-pointer w-7 h-7 rounded-full bg-white text-[#141414] flex items-center justify-center shadow-sm">
                            <Video className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleVideoUpload(ex, e.target.files?.[0])}
                            />
                          </label>
                          <button
                            onClick={() => setOpenDemos((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                              isDemoOpen ? 'bg-[#141414] text-white' : 'bg-white text-[#141414]'
                            }`}
                          >
                            <Activity className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {exLog.sets.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleToggleSetDone(ex, idx)}
                            className={`flex-1 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1 transition ${
                              s.done
                                ? 'bg-[#141414] text-white'
                                : 'bg-white text-[#141414] hover:bg-white/80'
                            }`}
                          >
                            {s.done && <Check className="w-3 h-3" />}
                            <span>S{idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {isDemoOpen && (
                        <div className="pt-2 space-y-2">
                          <AnatomicalExerciseAnimator exercise={ex} />
                          <ul className="text-[11px] font-medium text-[#5C4742] list-disc pl-4 space-y-1">
                            {ex.cues.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                          {uploadedVideo && (
                            <video
                              src={uploadedVideo.url}
                              controls
                              playsInline
                              className="w-full h-32 object-cover rounded-[16px] bg-black"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CZĘŚĆ GŁÓWNA */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#7A625D]">
                  Część Główna
                </h2>
                <span className="text-xs font-bold text-[#7A625D]">Automatyczny stoper przerw</span>
              </div>

              {currentWorkout.main.map((ex) => {
                const exLog = getExerciseLog(selectedWeek, ex);
                const isDemoOpen = !!openDemos[ex.id];
                const isPlateOpen = !!openPlateCalc[ex.id];
                const videoKey = `w${selectedWeek}_${ex.id}`;
                const uploadedVideo = localVideos[videoKey];

                return (
                  <div
                    key={ex.id}
                    className="bg-[#F9E5E0] rounded-[28px] p-4 space-y-3.5 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-base text-[#141414]">{ex.name}</h3>
                          {ex.superset && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#141414] text-white">
                              {ex.superset}
                            </span>
                          )}
                          {ex.unilateral && (
                            <button
                              onClick={() => updateExerciseLog(ex, (c) => ({ ...c, splitLR: !c.splitLR }))}
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                                exLog.splitLR
                                  ? 'bg-[#141414] text-white'
                                  : 'bg-white text-[#141414]'
                              }`}
                            >
                              {exLog.splitLR ? 'L / P osobno' : 'Podziel L/P'}
                            </button>
                          )}
                          {ex.barbell && (
                            <button
                              onClick={() => setOpenPlateCalc((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#141414] flex items-center gap-1"
                            >
                              <Scale className="w-3 h-3" />
                              <span>Talerze</span>
                            </button>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#7A625D] mt-0.5">
                          {ex.sets} serie × {ex.reps} • Przerwa {ex.rest}s • {ex.notes}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-3 py-1.5 rounded-full bg-white text-[#141414] text-xs font-bold flex items-center gap-1 shadow-sm">
                          <Video className="w-3.5 h-3.5" />
                          <span>{uploadedVideo ? 'Wideo ✓' : '+ Wideo'}</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleVideoUpload(ex, e.target.files?.[0])}
                          />
                        </label>

                        <button
                          onClick={() => setOpenDemos((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition shadow-sm ${
                            isDemoOpen
                              ? 'bg-[#141414] text-white'
                              : 'bg-white text-[#141414]'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Ruch</span>
                        </button>
                      </div>
                    </div>

                    {ex.barbell && isPlateOpen && (
                      <div className="p-3 rounded-[20px] bg-white space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#141414]">Talerze na jedną stronę:</span>
                          <div className="flex gap-1">
                            {[20, 15, 10].map((bw) => (
                              <button
                                key={bw}
                                onClick={() => updateExerciseLog(ex, (c) => ({ ...c, barWeight: bw }))}
                                className={`px-2 py-0.5 rounded-full font-bold ${
                                  exLog.barWeight === bw ? 'bg-[#141414] text-white' : 'bg-[#F9E5E0] text-[#141414]'
                                }`}
                              >
                                {bw}kg
                              </button>
                            ))}
                          </div>
                        </div>
                        {exLog.sets.map((s, idx) => {
                          const plates = calculatePlates(s.weight, exLog.barWeight);
                          return (
                            <div key={idx} className="flex items-center justify-between text-[#7A625D]">
                              <span>Seria {idx + 1} ({s.weight || 0} kg):</span>
                              <div className="flex gap-1">
                                {plates.length > 0 ? (
                                  plates.map((p, pIdx) => (
                                    <span
                                      key={pIdx}
                                      className="px-2 py-0.5 rounded-full bg-[#F9E5E0] text-[#141414] font-bold"
                                    >
                                      +{p}kg
                                    </span>
                                  ))
                                ) : (
                                  <span>Sam gryf</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Wiersze serii */}
                    <div className="space-y-2">
                      {exLog.sets.map((s, idx) => {
                        const advice = getPreviousWeekAdvice(ex, idx);
                        const isTooLightWarmup = s.rir === '5+';

                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-[20px] transition space-y-1.5 ${
                              s.done ? 'bg-[#F3D5CE]' : 'bg-[#FFF6F3]'
                            }`}
                          >
                            {advice && (
                              <span className="inline-block text-[10px] font-bold text-[#7A625D] px-1">
                                {advice.text}
                              </span>
                            )}

                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="w-5 text-xs font-extrabold text-[#141414] text-center">
                                {idx + 1}
                              </span>

                              {!exLog.splitLR ? (
                                <>
                                  <input
                                    type="number"
                                    step="0.5"
                                    placeholder={advice?.prevWeight ? `${advice.prevWeight} kg` : 'kg'}
                                    value={s.weight}
                                    onChange={(e) => handleSetChange(ex, idx, 'weight', e.target.value)}
                                    className="w-16 sm:w-20 px-2.5 py-2 rounded-full bg-white text-xs font-extrabold text-[#141414] placeholder:text-[#9A7B74] outline-none text-center"
                                  />
                                  <input
                                    type="text"
                                    placeholder={`${ex.reps}`}
                                    value={s.reps}
                                    onChange={(e) => handleSetChange(ex, idx, 'reps', e.target.value)}
                                    className="w-16 sm:w-20 px-2.5 py-2 rounded-full bg-white text-xs font-extrabold text-[#141414] placeholder:text-[#9A7B74] outline-none text-center"
                                  />
                                </>
                              ) : (
                                <div className="flex-1 grid grid-cols-2 gap-1.5">
                                  <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
                                    <span className="text-[10px] font-extrabold text-[#7A625D]">L</span>
                                    <input
                                      type="number"
                                      step="0.5"
                                      placeholder="kg"
                                      value={s.weight}
                                      onChange={(e) => handleSetChange(ex, idx, 'weight', e.target.value)}
                                      className="w-full text-xs font-bold text-[#141414] outline-none text-center"
                                    />
                                    <input
                                      type="text"
                                      placeholder="powt"
                                      value={s.reps}
                                      onChange={(e) => handleSetChange(ex, idx, 'reps', e.target.value)}
                                      className="w-full text-xs font-bold text-[#141414] outline-none text-center"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
                                    <span className="text-[10px] font-extrabold text-[#E0533C]">P</span>
                                    <input
                                      type="number"
                                      step="0.5"
                                      placeholder="kg"
                                      value={s.weightRight}
                                      onChange={(e) => handleSetChange(ex, idx, 'weightRight', e.target.value)}
                                      className="w-full text-xs font-bold text-[#141414] outline-none text-center"
                                    />
                                    <input
                                      type="text"
                                      placeholder="powt"
                                      value={s.repsRight}
                                      onChange={(e) => handleSetChange(ex, idx, 'repsRight', e.target.value)}
                                      className="w-full text-xs font-bold text-[#141414] outline-none text-center"
                                    />
                                  </div>
                                </div>
                              )}

                              <select
                                value={s.rir}
                                onChange={(e) => handleSetChange(ex, idx, 'rir', e.target.value)}
                                className="flex-1 min-w-[72px] px-2 py-2 rounded-full bg-white text-xs font-bold text-[#141414] outline-none text-center"
                              >
                                <option value="2">RIR 2</option>
                                <option value="1">RIR 1</option>
                                <option value="0">RIR 0</option>
                                <option value="3-4">RIR 3-4</option>
                                <option value="5+">RIR 5+</option>
                              </select>

                              {/* Dedykowany stoper PRACY tylko tam, gdzie ćwiczenie jest na sekundy (Copenhagen 30s / Plank 60s) */}
                              {ex.timedSeconds && (
                                <button
                                  onClick={() =>
                                    startBottomTimer(
                                      ex.timedSeconds,
                                      `${ex.name} (Seria ${idx + 1})`,
                                      'WORK',
                                      ex.rest || 0
                                    )
                                  }
                                  title="Odliczaj czas trzymania pozycji"
                                  className="px-3 py-2 rounded-full bg-white hover:bg-[#141414] text-[#141414] hover:text-white font-bold text-xs flex items-center gap-1 transition shadow-sm"
                                >
                                  <Timer className="w-3.5 h-3.5 text-[#E0533C]" />
                                  <span>{ex.timedSeconds}s</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleToggleSetDone(ex, idx)}
                                className={`px-3.5 py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1 transition ${
                                  s.done
                                    ? 'bg-[#141414] text-white'
                                    : 'bg-[#F8B4A6] hover:bg-[#141414] text-[#141414] hover:text-white'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {isTooLightWarmup && (
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E0533C] px-2">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>RIR 5+ = seria zbyt lekka (rozgrzewkowa), dołóż ciężaru.</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      placeholder="Dodaj notatkę..."
                      value={exLog.note}
                      onChange={(e) => updateExerciseLog(ex, (c) => ({ ...c, note: e.target.value }))}
                      className="w-full px-4 py-2 rounded-full bg-[#FFF6F3] text-xs font-medium text-[#141414] placeholder:text-[#9A7B74] outline-none"
                    />

                    {isDemoOpen && (
                      <div className="pt-2 grid sm:grid-cols-2 gap-3">
                        <AnatomicalExerciseAnimator exercise={ex} />

                        <div className="bg-[#FFF6F3] rounded-[24px] p-3.5 flex flex-col justify-between space-y-3 border border-[#F3D5CE]">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#F9E5E0] text-[#141414]">
                              {ex.muscles}
                            </span>
                            <ul className="mt-2.5 space-y-1.5 text-xs font-medium text-[#5C4742] list-disc pl-4">
                              {ex.cues.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>

                          {uploadedVideo ? (
                            <div className="space-y-2">
                              <video
                                src={uploadedVideo.url}
                                controls
                                playsInline
                                className="w-full h-36 object-cover rounded-[16px] bg-black"
                              />
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleShareVideo(uploadedVideo)}
                                  className="flex-1 py-2 rounded-full bg-[#141414] text-white font-bold text-xs flex items-center justify-center gap-1"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span>Wyślij Pawłowi</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(videoKey)}
                                  className="px-3 py-2 rounded-full bg-white text-[#141414] text-xs font-bold"
                                >
                                  Usuń
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="cursor-pointer py-2.5 px-3 rounded-full bg-[#F9E5E0] hover:bg-[#F8B4A6] text-[#141414] text-xs font-bold flex items-center justify-center gap-1.5 transition">
                              <Upload className="w-3.5 h-3.5" />
                              <span>+ Dodaj swój filmik z galerii</span>
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

            {/* FINISHER Z PASKIEM POSTĘPU CZASU */}
            <section className="bg-[#F8B4A6] rounded-[30px] p-5 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#141414] text-white">
                    Finisher
                  </span>
                  <h3 className="text-lg font-extrabold text-[#141414] mt-1.5">
                    {currentWorkout.finisher.title}
                  </h3>
                </div>

                {currentWorkout.finisher.type === 'EMOM' && (
                  <button
                    onClick={() => toggleFinisherTimer('EMOM', 300)}
                    className="px-4 py-2.5 rounded-full bg-[#141414] text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    {finisherTimer.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{finisherTimer.active ? 'Pauza' : 'Start 5:00'}</span>
                  </button>
                )}

                {currentWorkout.finisher.type === 'AMRAP' && (
                  <button
                    onClick={() => toggleFinisherTimer('AMRAP', 360)}
                    className="px-4 py-2.5 rounded-full bg-[#141414] text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    {finisherTimer.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{finisherTimer.active ? 'Pauza' : 'Start 6:00'}</span>
                  </button>
                )}

                {currentWorkout.finisher.type === 'CIRCUIT' && (
                  <button
                    onClick={() => startBottomTimer(120, 'Przerwa między Obwodami', 'REST', 0)}
                    className="px-4 py-2.5 rounded-full bg-[#141414] text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Przerwa 120s</span>
                  </button>
                )}
              </div>

              <p className="text-xs font-semibold text-[#141414]/80">{currentWorkout.finisher.description}</p>

              <ul className="space-y-1.5 text-xs font-bold text-[#141414] bg-[#FFF6F3] p-3.5 rounded-[22px]">
                {currentWorkout.finisher.tasks.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#141414] text-white flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              {(finisherTimer.active || finisherTimer.seconds > 0) && (
                <div className="p-4 rounded-[22px] bg-[#141414] text-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#F8B4A6]">
                        {finisherTimer.mode} • Minuta {Math.min(Math.floor(finisherTimer.seconds / 60) + 1, Math.ceil(finisherTimer.totalSeconds / 60))}
                      </span>
                      <p className="text-2xl font-extrabold font-mono">
                        {String(Math.floor((finisherTimer.totalSeconds - finisherTimer.seconds) / 60)).padStart(2, '0')}:
                        {String((finisherTimer.totalSeconds - finisherTimer.seconds) % 60).padStart(2, '0')}
                      </p>
                    </div>
                    {finisherTimer.mode === 'EMOM' && (
                      <div className="text-right">
                        <span className="text-[10px] text-white/60 block">Do nowej minuty</span>
                        <span className="text-lg font-extrabold font-mono text-[#F8B4A6]">
                          {60 - (finisherTimer.seconds % 60)}s
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        setFinisherTimer({ active: false, seconds: 0, mode: 'EMOM', totalSeconds: 300, startTime: 0 })
                      }
                      className="p-2 rounded-full bg-white/15 text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pasek postępu Finishera */}
                  <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F8B4A6] transition-all duration-300 rounded-full"
                      style={{ width: `${finisherPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Wynik (np. 4 rundy)"
                  value={currentFinisherLog.rounds}
                  onChange={(e) => updateFinisherLog('rounds', e.target.value)}
                  className="px-4 py-2.5 rounded-full bg-[#FFF6F3] text-xs font-bold text-[#141414] placeholder:text-[#9A7B74] outline-none"
                />
                <input
                  type="text"
                  placeholder="Ciężar / czas"
                  value={currentFinisherLog.kcalOrTime}
                  onChange={(e) => updateFinisherLog('kcalOrTime', e.target.value)}
                  className="px-4 py-2.5 rounded-full bg-[#FFF6F3] text-xs font-bold text-[#141414] placeholder:text-[#9A7B74] outline-none"
                />
                <button
                  onClick={() => updateFinisherLog('completed', !currentFinisherLog.completed)}
                  className={`px-4 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    currentFinisherLog.completed
                      ? 'bg-[#141414] text-white'
                      : 'bg-[#FFF6F3] text-[#141414]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{currentFinisherLog.completed ? 'Zrobione' : 'Zaliczone'}</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* DOLNA CZARNA PASTYLKA STOPERA Z PŁYNNYM PASKIEM PROGRESU */}
      <div className="fixed bottom-5 inset-x-4 max-w-sm mx-auto z-40">
        {bottomTimer.active ? (
          <div
            className={`relative overflow-hidden rounded-full pl-5 pr-2 py-2.5 shadow-2xl flex items-center justify-between gap-2 transition-colors ${
              bottomTimer.remaining <= 3 ? 'bg-[#E0533C] text-white' : 'bg-[#141414] text-white'
            }`}
          >
            {/* Dolny pasek postępu wypełniający pastylkę */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-[#F8B4A6] transition-all duration-300"
              style={{ width: `${bottomTimerPercent}%` }}
            />

            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  bottomTimer.mode === 'WORK' ? 'bg-[#E0533C] text-white' : 'bg-white/15 text-[#F8B4A6]'
                }`}
              >
                {bottomTimer.mode === 'WORK' ? 'TRZYMAJ' : 'PRZERWA'}
              </span>
              <span className="text-lg font-extrabold font-mono">
                {Math.floor(bottomTimer.remaining / 60)}:{String(bottomTimer.remaining % 60).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold text-white/70 truncate">
                {bottomTimer.label}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => adjustBottomTimer(-15)}
                className="px-2 py-1 rounded-full bg-white/15 text-[10px] font-bold"
              >
                -15s
              </button>
              <button
                onClick={() => adjustBottomTimer(15)}
                className="px-2 py-1 rounded-full bg-white/15 text-[10px] font-bold"
              >
                +15s
              </button>
              <button
                onClick={togglePauseBottomTimer}
                className="w-7 h-7 rounded-full bg-white/15 text-white flex items-center justify-center"
              >
                {bottomTimer.paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setBottomTimer((prev) => ({ ...prev, active: false, remaining: 0 }))}
                className="w-7 h-7 rounded-full bg-white text-[#141414] flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-[#141414] text-white rounded-full pl-5 pr-2 py-2 shadow-2xl flex items-center justify-between">
            <div
              className="absolute bottom-0 left-0 h-1 bg-[#E0533C] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
            <div>
              <span className="text-[11px] font-semibold text-white/60 block">
                Trening {selectedWorkout} • Tydz. {selectedWeek}
              </span>
              <span className="text-sm font-extrabold">
                {completedMainSets} z {totalMainSets} serii ({progressPercent}%)
              </span>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 rounded-full bg-white text-[#141414] font-extrabold text-xs flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Raport</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL RAPORTU */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF6F3] rounded-[32px] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-[#141414]">Podsumowanie treningu</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full bg-[#F9E5E0] text-[#141414] font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <pre className="p-4 rounded-[22px] bg-[#F9E5E0] text-xs text-[#141414] whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
              {generatePawelReport()}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatePawelReport());
                setCopiedReport(true);
                setTimeout(() => setCopiedReport(false), 2500);
              }}
              className="w-full py-3 rounded-full bg-[#141414] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedReport ? 'Skopiowano!' : 'Kopiuj raport'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL KOPII ZAPASOWEJ */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF6F3] rounded-[32px] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-[#141414]">Kopia zapasowa</h3>
              <button
                onClick={() => setShowBackupModal(false)}
                className="w-8 h-8 rounded-full bg-[#F9E5E0] text-[#141414] font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-2.5">
              <button
                onClick={handleExportBackup}
                className="w-full py-3 px-4 rounded-full bg-[#141414] text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Pobierz plik zapasowy (.json)</span>
              </button>
              <label className="cursor-pointer w-full py-3 px-4 rounded-full bg-[#F9E5E0] text-[#141414] font-bold text-xs flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Wczytaj plik zapasowy</span>
                <input type="file" accept="application/json" className="hidden" onChange={handleImportBackup} />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}