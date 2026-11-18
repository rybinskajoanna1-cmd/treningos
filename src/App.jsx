import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dumbbell,
  Flame,
  Check,
  Play,
  Pause,
  RotateCcw,
  Video,
  ChevronDown,
  ChevronUp,
  Info,
  Trophy,
  TrendingUp,
  ExternalLink,
  Timer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Share2,
  X,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Upload,
  Camera,
  Trash2,
  Link,
  Film,
  Eye,
  Gauge,
  MessageSquare,
  Send,
} from 'lucide-react';

// ============================================================================
// BAZA INDEXEDDB DO TRWAŁEGO PRZECHOWYWANIA FILMIKÓW Z TELEFONU / GALERII
// ============================================================================
const DB_NAME = 'AsiaHyroxVideoDB';
const STORE_NAME = 'exerciseVideos';

const openVideoDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
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
    const store = tx.objectStore(STORE_NAME);
    store.put({
      id: key,
      blob: file,
      fileName: file.name || 'nagranie_treningowe.mp4',
      mimeType: file.type || 'video/mp4',
      updatedAt: new Date().toISOString(),
      ...meta,
    });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const getVideoBlobFromDB = async (key) => {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

const deleteVideoBlobFromDB = async (key) => {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

const getAllVideoKeysFromDB = async () => {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAllKeys();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

// ============================================================================
// KOMPLETNA BAZA DANYCH PLANU TRENINGOWEGO "OPORSKI PAWEŁ - MIESIĄC 1 HYROX"
// ============================================================================

const PLAN_RULES = [
  {
    title: 'Czas trwania',
    text: 'Realizuj plan do 2 miesięcy od rozpoczęcia. Wykonuj 3 treningi w tygodniu.',
    icon: Calendar,
  },
  {
    title: 'Progresja i ciężar (RIR 2)',
    text: 'Od 2. tygodnia pracuj blisko upadku mięśniowego (zostaw max 2 ruchy w zapasie, ciężar 70-80% maksa). Jeśli po ostatnim powtórzeniu czujesz, że mogłabyś zrobić jeszcze 5, to znaczy, że seria była zbyt lekka i nie liczysz jej jako roboczej.',
    icon: TrendingUp,
  },
  {
    title: 'Technika',
    text: 'Przed treningiem sprawdź ćwiczenia na YouTube. Nagrywaj po jednej serii rozgrzewkowej każdego ćwiczenia (również mobilizacji) i wysyłaj mi do oceny.',
    icon: Video,
  },
  {
    title: 'Odżywianie',
    text: 'Przed treningiem zjedz posiłek bogaty w węglowodany (80-100g). W ostateczności ratuj się cukrami prostymi na treningu (np. żelki).',
    icon: Flame,
  },
];

const WORKOUTS = [
  {
    id: 'w1',
    name: 'Trening 1: Nogi i Core',
    shortName: 'Trening 1',
    subtitle: 'Nogi i Core • Hyrox Prep',
    warmup: [
      {
        id: 'w1_m1',
        name: 'Deep squat to stand',
        sets: 2,
        reps: '15',
        notes: 'Spokojne, kontrolowane ruchy',
        animType: 'goblet_squat',
        muscles: 'Biodra, Grupa kulszowo-goleniowa, Odcinek piersiowy',
        cues: [
          'Stań nieco szerzej niż na szerokość bioder, złap dłońmi za czubki butów.',
          'Zejdź do głębokiego przysiadu, otwierając biodra łokciami od wewnątrz i prostując klatkę piersiową.',
          'Trzymając stopy, wyprostuj kolana i unieś biodra wysoko, rozciągając tył ud.',
        ],
      },
      {
        id: 'w1_m2',
        name: 'Cossack squat',
        sets: 2,
        reps: '10',
        notes: 'Na każdą nogę',
        animType: 'cossack',
        muscles: 'Przywodziciele, Pośladki, Mobilność stawu skokowego',
        cues: [
          'Stań w bardzo szerokim rozkroku, stopy skierowane lekko na zewnątrz.',
          'Przenieś ciężar ciała na jedną nogę i zejdź nisko w bok, utrzymując całą stopę na podłodze.',
          'Druga noga pozostaje wyprostowana, palce stopy skieruj w górę do sufitu.',
        ],
      },
      {
        id: 'w1_m3',
        name: 'Glute crusher',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        animType: 'kneeling_mobility',
        muscles: 'Mięsień pośladkowy średni i wielki, Rotatory biodra',
        cues: [
          'Przyjmij pozycję gołębia (jedna noga zgięta z przodu, druga wyprostowana z tyłu).',
          'Kontrolowanym ruchem opuszczaj tułów nad przednie podudzie, czując rozciąganie pośladka.',
          'Unoś się z powrotem pracą biodra, utrzymując prosty kręgosłup.',
        ],
      },
      {
        id: 'w1_m4',
        name: 'Pallof press',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        animType: 'cable_pull',
        muscles: 'Mięśnie skośne brzucha, Core (antyrotacja)',
        cues: [
          'Stań bokiem do wyciągu lub zaczepionej gumy oporowej, trzymaj uchwyt oburącz przy mostku.',
          'Napnij mocno brzuch i pośladki, wypychając dłonie prosto przed klatkę piersiową.',
          'Nie pozwól, aby guma zrotowała Twój tułów – przytrzymaj sekundę na wyproście.',
        ],
      },
      {
        id: 'w1_m5',
        name: 'Exercise ball hamstring curl',
        sets: 2,
        reps: '10-15',
        notes: 'Utrzymuj biodra wysoko',
        animType: 'hip_thrust',
        muscles: 'Mięśnie dwugłowe ud, Pośladki, Core',
        cues: [
          'Połóż się na plecach, pięty oprzyj na piłce gimnastycznej, ręce stabilnie wzdłuż ciała.',
          'Unieś biodra wysoko, tworząc prostą linię od barków do stóp.',
          'Zginaj kolana, przyciągając piłkę pod pośladki bez opuszczania bioder.',
        ],
      },
      {
        id: 'w1_m6',
        name: 'Ergometr wioślarski',
        sets: 1,
        reps: '200 m',
        notes: 'Średnie tempo',
        animType: 'rower',
        muscles: 'Całe ciało: Nogi (60%), Tułów (20%), Ramiona (20%)',
        cues: [
          'Kolejność ruchu podczas ciągnięcia: najpierw mocne odepchnięcie nogami, potem odchylenie tułowia, na końcu dociągnięcie rąk pod żebra.',
          'Powrót w odwrotnej kolejności: wyprostuj ręce, pochyl tułów, dopiero na końcu ugnij kolana.',
          'Trzymaj płynny, średni rytm na rozgrzanie.',
        ],
      },
    ],
    main: [
      {
        id: 'w1_e1',
        name: 'Goblet squat',
        sets: 3,
        reps: '10-12',
        rest: 90,
        notes: 'Trzymaj ciężar blisko klatki',
        animType: 'goblet_squat',
        muscles: 'Czworogłowe ud, Pośladki, Brzuch (stabilizacja)',
        defaultUnit: 'kg',
        cues: [
          'Chwyć kettlebell lub hantlę oburącz tuż przy mostku, łokcie skierowane wąsko w dół.',
          'Weź wdech do brzucha i zejdź do głębokiego przysiadu, prowadząc kolana w linii palców stóp.',
          'Wstań dynamicznie, utrzymując pionowy tułów i ciężar przyklejony do klatki.',
        ],
      },
      {
        id: 'w1_e2',
        name: 'Halo plate',
        sets: 3,
        reps: '10-12',
        rest: 60,
        notes: 'Krążenia talerzem; na stronę',
        animType: 'overhead_press',
        muscles: 'Obręcz barkowa, Stożek rotatorów, Core',
        defaultUnit: 'kg',
        cues: [
          'Chwyć talerz po bokach, napnij mocno brzuch i pośladki (żebra schowane).',
          'Wykonuj ciasne krążenia talerzem wokół głowy, prowadząc go blisko szyi i karku.',
          'Poruszają się wyłącznie ramiona i barki – tułów i głowa stoją nieruchomo.',
        ],
      },
      {
        id: 'w1_e3',
        name: 'Walking lunges',
        sets: 3,
        reps: '8-10',
        rest: 90,
        notes: 'Wykroki chodzone; na nogę',
        animType: 'lunge',
        muscles: 'Pośladki, Czworogłowe ud, Stabilizatory miednicy',
        defaultUnit: 'kg',
        cues: [
          'Trzymaj hantle wzdłuż tułowia, ściągnij łopatki.',
          'Zrób stabilny krok w przód i zejdź w dół tak, aby tylne kolano niemal dotknęło ziemi (kąt ok. 90° w obu kolanach).',
          'Odepchnij się mocno z całej przedniej stopy, przechodząc od razu do kolejnego kroku.',
        ],
      },
      {
        id: 'w1_e4',
        name: 'Single leg KB RDL',
        sets: 3,
        reps: '8-10',
        rest: 90,
        notes: 'Martwy ciąg jednonóż; na nogę',
        animType: 'rdl',
        muscles: 'Dwugłowe uda, Pośladek nogi podporowej, Równowaga',
        defaultUnit: 'kg',
        cues: [
          'Stań na jednej nodze z minimalnie ugiętym kolanem, kettlebell trzymaj w przeciwnej dłoni.',
          'Cofaj biodro w tył jak zawias, pochylając prosty tułów równolegle do podłogi (wolna noga idzie w tył w linii tułowia).',
          'Pilnuj, aby biodra nie otwierały się na bok – oba kolce biodrowe patrzą w podłogę.',
        ],
      },
      {
        id: 'w1_e5',
        name: 'Windmill',
        sets: 3,
        reps: '8-10',
        rest: 60,
        notes: 'Wiatrak; na stronę',
        animType: 'windmill',
        muscles: 'Skośne brzucha, Pośladek, Stabilizacja barku',
        defaultUnit: 'kg',
        cues: [
          'Ustaw stopy pod kątem 45 stopni w stronę przeciwną do ręki nad głową.',
          'Wypychając biodro w bok nad tylną nogę, zsuwaj wolną dłoń po wewnętrznej stronie przedniej nogi.',
          'Wzrok przez cały czas skierowany na górną dłoń, ramię idealnie prostopadle do podłogi.',
        ],
      },
      {
        id: 'w1_e6',
        name: '[A1] Copenhagen adduction',
        sets: 3,
        reps: '20-30s',
        rest: 0,
        superset: 'A',
        supersetRole: 'A1',
        isTimed: true,
        targetSeconds: 25,
        notes: 'Superseria z A2; na stronę',
        animType: 'plank_core',
        muscles: 'Przywodziciele uda (wewnętrzna część), Skośne brzucha',
        defaultUnit: 's',
        cues: [
          'Przyjmij pozycję podporu bokiem na przedramieniu, górną nogę oprzyj na ławce.',
          'Unieś biodra tak, aby ciało tworzyło prostą linię, a dolna noga była uniesiona nad ziemią.',
          'Utrzymaj izometryczne napięcie przez 20-30 sekund na stronę, po czym od razu przejdź do A2.',
        ],
      },
      {
        id: 'w1_e7',
        name: '[A2] Side lying hip adduction',
        sets: 3,
        reps: '15',
        rest: 60,
        superset: 'A',
        supersetRole: 'A2',
        notes: 'Przywodzenie; na stronę',
        animType: 'dead_bug',
        muscles: 'Przywodziciele uda',
        defaultUnit: 'kg',
        cues: [
          'Połóż się na boku, górną nogę zegnij i postaw stopę na ziemi przed dolnym udem.',
          'Dolną nogę trzymaj całkowicie wyprostowaną, palce stopy zadarte na siebie.',
          'Unoś dolną nogę jak najwyżej w górę pracą wewnętrznej części uda, z kontrolowanym opuszczaniem.',
        ],
      },
    ],
    finisher: {
      type: 'emom',
      title: 'Finisher (Zakończenie): EMOM 5 minut',
      description:
        'W każdej minucie wykonaj 4 kcal na SkiErg. Pracujesz maksymalnie 60 sekund w rundzie (jeśli skończysz szybciej, reszta minuty to Twoja przerwa).',
      rounds: 5,
      roundDuration: 60,
    },
  },
  {
    id: 'w2',
    name: 'Trening 2: Góra Ciała',
    shortName: 'Trening 2',
    subtitle: 'Góra Ciała • Siła & Obwody',
    warmup: [
      {
        id: 'w2_m1',
        name: 'Thread the needle',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        animType: 'kneeling_mobility',
        muscles: 'Rotacja odcinka piersiowego kręgosłupa, Tylny akton barku',
        cues: [
          'W klęku podpartym wsuń jedną rękę pod klatką piersiową daleko w bok, kładąc bark i skroń na macie.',
          'Następnie otwórz klatkę piersiową, sięgając tą samą ręką wysoko do sufitu i odprowadzając ją wzrokiem.',
          'Biodra trzymaj stabilnie nad kolanami.',
        ],
      },
      {
        id: 'w2_m2',
        name: 'Kneeling lat stretch on bench',
        sets: 2,
        reps: '10',
        notes: 'Z użyciem kijka (stick)',
        animType: 'kneeling_mobility',
        muscles: 'Najszerszy grzbietu, Odcinek piersiowy, Triceps',
        cues: [
          'Uklęknij przed ławką, chwyć kijek podchwytem na szerokość barków i oprzyj łokcie na krawędzi ławki.',
          'Cofnij biodra w stronę pięt i opuść klatkę piersiową w dół między ramiona.',
          'Zegnij łokcie, przenosząc kijek za głowę, i oddychaj głęboko.',
        ],
      },
      {
        id: 'w2_m3',
        name: '90-90 stretch',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę',
        animType: 'kneeling_mobility',
        muscles: 'Rotacja wewnętrzna i zewnętrzna w stawie biodrowym',
        cues: [
          'Usiądź na podłodze z obiema nogami ugiętymi w kolanach pod kątem 90 stopni (jedna z przodu, druga z boku).',
          'Trzymając prosty kręgosłup, płynnie przekładaj kolana na drugą stronę bez odrywania pięt.',
          'W krańcowej pozycji delikatnie pochyl mostek nad przednie kolano.',
        ],
      },
      {
        id: 'w2_m4',
        name: 'Scapula pull-up',
        sets: 2,
        reps: '10',
        notes: 'Aktywne zwisy na drążku',
        animType: 'lat_pulldown',
        muscles: 'Dolny czworoboczny, Równoległoboczne (stabilizacja łopatki)',
        cues: [
          'Zawiśnij na drążku na całkowicie wyprostowanych w łokciach rękach.',
          'Bez uginania łokci ściągnij łopatki mocno w dół i do siebie, unosząc ciało o kilka centymetrów.',
          'Przytrzymaj sekundę na górze i kontrolowanie wróć do luźnego zwisu.',
        ],
      },
      {
        id: 'w2_m5',
        name: 'Koci grzbiet',
        sets: 2,
        reps: '10',
        notes: 'Płynne przejścia',
        animType: 'kneeling_mobility',
        muscles: 'Prostowniki grzbietu, Mobilność całego kręgosłupa',
        cues: [
          'W klęku podpartym dłonie ustaw pod barkami, kolana pod biodrami.',
          'Z wydechem zaokrąglij mocno cały kręgosłup w górę, chowając głowę i podwijając miednicę.',
          'Z wdechem płynnie otwórz klatkę piersiową, kierując brzuch w dół.',
        ],
      },
    ],
    main: [
      {
        id: 'w2_e1',
        name: 'Bench press',
        sets: 3,
        reps: '8-10',
        rest: 90,
        notes: 'Wyciskanie leżąc na ławce',
        animType: 'bench_press',
        muscles: 'Klatka piersiowa, Przedni akton barków, Triceps',
        defaultUnit: 'kg',
        cues: [
          'Połóż się na ławce, ściągnij i obniż łopatki, wbij stopy mocno w podłogę.',
          'Opuszczaj sztangę pod kontrolą w okolice dolnej części mostka, łokcie pod kątem ok. 45-60°.',
          'Wyciśnij sztangę dynamicznie w górę z wydechem.',
        ],
      },
      {
        id: 'w2_e2',
        name: 'Gorilla row alt',
        sets: 3,
        reps: '10',
        rest: 90,
        notes: 'Wiosłowanie; na stronę',
        animType: 'rdl',
        muscles: 'Najszerszy grzbietu, Czworoboczny, Core',
        defaultUnit: 'kg',
        cues: [
          'Stań w szerokim rozkroku nad dwoma kettlebellami, cofnij biodra i pochyl prosty tułów.',
          'Jedna ręka mocno wciska odważnik w ziemię dla stabilizacji, gdy druga wiosłuje ciężarem do biodra.',
          'Wykonuj ruch naprzemiennie bez kołysania tułowiem.',
        ],
      },
      {
        id: 'w2_e3',
        name: 'Hip thrust',
        sets: 3,
        reps: '10',
        rest: 90,
        notes: 'Pełen wyprost bioder, dopięcie',
        animType: 'hip_thrust',
        muscles: 'Mięsień pośladkowy wielki, Dwugłowe ud',
        defaultUnit: 'kg',
        cues: [
          'Oprzyj dolny kąt łopatek o ławkę, sztangę z gąbką ułóż na biodrach.',
          'Wypchnij biodra w górę z pięt tak, aby w górnej pozycji podudzia były pionowe.',
          'Podwiń lekko miednicę, mocno dopnij pośladki na sekundę na górze, wzrok skierowany przed siebie.',
        ],
      },
      {
        id: 'w2_e4',
        name: 'Lateral raises',
        sets: 3,
        reps: '20',
        rest: 60,
        notes: 'Wznosy bokiem; mniejszy ciężar',
        animType: 'lateral_raise',
        muscles: 'Boczny akton mięśnia naramiennego (barki)',
        defaultUnit: 'kg',
        cues: [
          'Stań stabilnie, pochyl minimalnie tułów w przód, łokcie lekko ugięte.',
          'Unoś hantle na boki (lekko przed linią barków – w płaszczyźnie łopatki) do wysokości barków.',
          'Nie bujaj tułowiem, opuszczaj ciężar powoli, utrzymując stałe napięcie bocznego aktonu barków.',
        ],
      },
      {
        id: 'w2_e5',
        name: 'Step up on box',
        sets: 3,
        reps: '10',
        rest: 90,
        notes: 'Wejścia na skrzynię; na nogę',
        animType: 'lunge',
        muscles: 'Pośladek, Czworogłowy uda, Stabilizacja kolana',
        defaultUnit: 'kg',
        cues: [
          'Postaw całą stopę na skrzyni, pochyl lekko tułów nad przednią nogę.',
          'Wchodź w górę pracą wyłącznie nogi na skrzyni – nie wybijaj się z dolnej stopy.',
          'Schodź w dół bardzo powoli i pod pełną kontrolą.',
        ],
      },
      {
        id: 'w2_e6',
        name: '[A1] Biceps (sztanga)',
        sets: 3,
        reps: '10-12',
        rest: 0,
        superset: 'A',
        supersetRole: 'A1',
        notes: 'Superseria z A2',
        animType: 'biceps_curl',
        muscles: 'Mięsień dwugłowy ramienia (Biceps), Przedramiona',
        defaultUnit: 'kg',
        cues: [
          'Chwyć sztangę podchwytem na szerokość barków, łokcie przyklejone do boków tułowia.',
          'Uginaj przedramiona bez bujania biodrami, dopnij biceps na górze.',
          'Opuszczaj sztangę pod kontrolą do pełnego wyprostu i od razu przejdź do wyciągu na triceps.',
        ],
      },
      {
        id: 'w2_e7',
        name: '[A2] Triceps (linka)',
        sets: 3,
        reps: '10-12',
        rest: 60,
        superset: 'A',
        supersetRole: 'A2',
        notes: 'Prostowanie z wyciągu',
        animType: 'cable_pull',
        muscles: 'Mięsień trójgłowy ramienia (Triceps)',
        defaultUnit: 'kg',
        cues: [
          'Chwyć sznur wyciągu górnego, zablokuj łokcie nieruchomo przy żebrach.',
          'Wyprostuj przedramiona w dół, na samym dole rozdzielając końce linki na zewnątrz.',
          'Wróć kontrolowanie w górę bez odrywania łokci od tułowia.',
        ],
      },
      {
        id: 'w2_e8',
        name: 'Martwy robak (Dead bug)',
        sets: 2,
        reps: '15 (max)',
        rest: 60,
        notes: 'Dociskaj lędźwie do maty',
        animType: 'dead_bug',
        muscles: 'Mięsień poprzeczny i prosty brzucha (głęboki Core)',
        defaultUnit: 'powt',
        cues: [
          'Połóż się na plecach, unieś ręce pionowo w górę, a nogi zegnij pod kątem 90° w biodrach i kolanach.',
          'Kluczowe: wciśnij odcinek lędźwiowy mocno w matę (zero szczeliny pod plecami).',
          'Powoli wyprostuj jednocześnie przeciwną rękę za głowę i nogę nad podłogą, po czym wróć z wydechem.',
        ],
      },
    ],
    finisher: {
      type: 'circuits',
      title: 'Finisher (Zakończenie): 2 Obwody (120s przerwy między obwodami)',
      restBetween: 120,
      circuitsCount: 2,
      items: [
        'Cossack squat TRX - 15 powt. na stronę',
        'Russian kettlebell swing - 15 powt.',
        'Burpees w miejscu - 10 powt.',
        'Single leg calf raises (wspięcia na łydki) - 10 powt. na nogę',
      ],
    },
  },
  {
    id: 'w3',
    name: 'Trening 3: Full Body Workout',
    shortName: 'Trening 3',
    subtitle: 'Full Body Workout • AMRAP Hyrox',
    warmup: [
      {
        id: 'w3_m1',
        name: "World's Greatest Stretch",
        sets: 2,
        reps: '5',
        notes: 'Na każdą stronę',
        animType: 'lunge',
        muscles: 'Zginacze biodra, Odcinek piersiowy, Przywodziciele',
        cues: [
          'Zrób głęboki wykrok w przód, oprzyj dłonie na podłodze po wewnętrznej stronie stopy.',
          'Zejdź łokciem bliższej ręki nisko w stronę kostki, a następnie zrotuj tułów, sięgając tą ręką do sufitu.',
          'Tylne kolano trzymaj wyprostowane i aktywne.',
        ],
      },
      {
        id: 'w3_m2',
        name: 'Bird dog',
        sets: 2,
        reps: '10',
        notes: 'Na każdą stronę; stabilny tułów',
        animType: 'kneeling_mobility',
        muscles: 'Głębokie stabilizatory kręgosłupa, Pośladek, Core',
        cues: [
          'W klęku podpartym usztywnij brzuch tak, jakby na lędźwiach stała szklanka z wodą.',
          'Jednocześnie wyprostuj w linii tułowia przeciwną rękę i nogę (sięgaj w dal, nie zadzieraj zbyt wysoko).',
          'Zatrzymaj ruch na sekundę i kontrolowanie dotknij łokciem kolana pod brzuchem.',
        ],
      },
      {
        id: 'w3_m3',
        name: 'Band pull-aparts',
        sets: 2,
        reps: '15',
        notes: 'Rozciąganie gumy przed sobą',
        animType: 'cable_pull',
        muscles: 'Tylny akton barków, Środkowy czworoboczny, Łopatki',
        cues: [
          'Trzymaj długą gumę oporową na wysokości barków przed sobą, łokcie proste.',
          'Rozciągnij gumę na boki ruchem z tylnego aktonu barków i ściągnięciem łopatek, aż guma dotknie mostka.',
          'Nie wypychaj żeber w przód i nie unoś barków do uszu.',
        ],
      },
      {
        id: 'w3_m4',
        name: 'Bear crawl',
        sets: 2,
        reps: '10 m',
        notes: 'W przód i w tył',
        animType: 'plank_core',
        muscles: 'Core, Obręcz barkowa, Czworogłowe ud',
        cues: [
          'Z klęku podpartego oderwij kolana od podłogi zaledwie na 2-3 centymetry.',
          'Poruszaj się małymi krokami (prawa ręka z lewą stopą jednocześnie) 10m w przód i 10m w tył.',
          'Utrzymuj płaskie plecy i niskie biodra.',
        ],
      },
      {
        id: 'w3_m5',
        name: 'Air squats',
        sets: 2,
        reps: '10',
        notes: 'Z 2-sekundową pauzą na dole',
        animType: 'goblet_squat',
        muscles: 'Czworogłowe ud, Pośladki, Mobilność bioder',
        cues: [
          'Zejdź do pełnego przysiadu z ciężarem ciała rozłożonym równomiernie na całej stopie.',
          'Zatrzymaj się na samym dole na pełne 2 sekundy, utrzymując aktywne napięcie mięśni (nie siadaj luźno).',
          'Wyjdź dynamicznie w górę.',
        ],
      },
    ],
    main: [
      {
        id: 'w3_e1',
        name: 'KB / DB RDL',
        sets: 3,
        reps: '8-10',
        rest: 90,
        notes: 'Rumuński MC; proste plecy',
        animType: 'rdl',
        muscles:
          'Grupa kulszowo-goleniowa (dwugłowe ud), Pośladki, Prostowniki',
        defaultUnit: 'kg',
        cues: [
          'Trzymaj hantle lub kettlebelle blisko ud, ściągnij łopatki w dół (jakbyś trzymała ołówki pod pachami).',
          'Wypychaj biodra daleko w tył przy lekko ugiętych kolanach, aż poczujesz mocne rozciąganie dwugłowych ud.',
          'Wróć dynamicznie wypychając biodra w przód.',
        ],
      },
      {
        id: 'w3_e2',
        name: 'Seated DB Overhead Press',
        sets: 3,
        reps: '8-10',
        rest: 90,
        notes: 'Wyciskanie hantli siedząc',
        animType: 'overhead_press',
        muscles: 'Przedni i boczny akton barków, Triceps',
        defaultUnit: 'kg',
        cues: [
          'Usiądź stabilnie na ławce z oparciem, dociśnij plecy i napnij brzuch.',
          'Wyciskaj hantle po lekkim łuku nad głowę, prowadząc łokcie delikatnie przed linią tułowia.',
          'Opuszczaj ciężar do poziomu uszu/brody pod pełną kontrolą.',
        ],
      },
      {
        id: 'w3_e3',
        name: 'Lat pulldown',
        sets: 3,
        reps: '10-12',
        rest: 90,
        notes: 'Ściąganie drążka do klatki',
        animType: 'lat_pulldown',
        muscles: 'Mięsień najszerszy grzbietu, Obły większy, Biceps',
        defaultUnit: 'kg',
        cues: [
          'Chwyć drążek wyciągu górnego nieco szerzej niż barki, zablokuj uda pod wałkami.',
          'Zainicjuj ruch od obniżenia łopatek, a następnie ściągnij drążek do górnej części mostka, kierując łokcie w dół.',
          'Kontroluj powrót drążka w górę, rozciągając grzbiet.',
        ],
      },
      {
        id: 'w3_e4',
        name: 'Bulgarian split squat',
        sets: 3,
        reps: '8-10',
        rest: 90,
        notes: 'Przysiad bułgarski; na nogę',
        animType: 'lunge',
        muscles: 'Pośladek, Czworogłowy uda przedniej nogi',
        defaultUnit: 'kg',
        cues: [
          'Oprzyj grzbiet tylnej stopy na ławce, przednią stopę ustaw stabilnie w wykroku.',
          'Zejdź biodrem w dół i lekko w tył, utrzymując lekko pochylony tułów dla mocniejszego zaangażowania pośladka i czworogłowego.',
          'Całą pracę wykonuje noga przednia.',
        ],
      },
      {
        id: 'w3_e5',
        name: 'Face pulls',
        sets: 3,
        reps: '12-15',
        rest: 60,
        notes: 'Z rotacją zewnętrzną ramion',
        animType: 'cable_pull',
        muscles: 'Tylny akton barków, Stożek rotatorów, Czworoboczny',
        defaultUnit: 'kg',
        cues: [
          'Ustaw wyciąg na wysokości oczu, chwyć linkę tak, aby kciuki były skierowane do Ciebie.',
          'Ciągnij środek linki w stronę czoła/oczu, jednocześnie rotując dłonie w tył (pozycja podwójnego bicepsa na końcu).',
          'Przytrzymaj sekundę spięcie tylnych barków i łopatek.',
        ],
      },
      {
        id: 'w3_e6',
        name: 'Plank',
        sets: 3,
        reps: '40-60s',
        rest: 60,
        isTimed: true,
        targetSeconds: 50,
        notes: 'Deska klasyczna',
        animType: 'plank_core',
        muscles: 'Cały gorset mięśniowy brzucha (Core), Pośladki',
        defaultUnit: 's',
        cues: [
          'Oprzyj się na przedramionach (łokcie pod barkami) i palcach stóp.',
          'Podwiń miednicę pod siebie, mocno zegnij pośladki i przyciągaj izometrycznie łokcie w stronę palców stóp.',
          'Oddychaj spokojnie przy żelaznym napięciu brzucha przez 40-60 sekund.',
        ],
      },
      {
        id: 'w3_e7',
        name: "Farmer's walk",
        sets: 3,
        reps: '30 m',
        rest: 90,
        notes: 'Ciężkie hantle/KB w dłoniach',
        animType: 'farmers_walk',
        muscles: 'Chwyt (przedramiona), Czworoboczny, Core, Kondycja Hyrox',
        defaultUnit: 'kg',
        cues: [
          'Chwyć bardzo ciężkie kettlebelle lub hantle w obie dłonie (kluczowa konkurencja pod Hyrox!).',
          'Wyprostuj sylwetkę, ściągnij łopatki w dół i w tył, usztywnij brzuch.',
          'Idź szybkim, krótkim, stabilnym krokiem na dystansie 30 metrów bez bujania ciężarem.',
        ],
      },
    ],
    finisher: {
      type: 'amrap',
      title: 'Finisher (Zakończenie): AMRAP 6 minut',
      durationSeconds: 360,
      description: 'Wykonaj jak najwięcej obwodów w 6 minut:',
      items: [
        '10x Wall Ball (lub DB Thrusters z lekkim ciężarem)',
        '10x Box jumps (wskoki na skrzynię lub szybkie wejścia)',
        '150m na wioślarzu (Ergometr)',
      ],
    },
  },
];

// ============================================================================
// ANATOMICZNY, LUDZKI SYMULATOR RUCHU (PROPORCJONALNA SYLWETKA + MIĘŚNIE)
// ============================================================================
const HumanExerciseAnimator = ({ exercise }) => {
  const [slowMo, setSlowMo] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const type = exercise?.animType || 'goblet_squat';
  const durationSec = slowMo ? 4.8 : 2.4;

  // Przełącznik fazy ruchu wyświetlany dla czytelności biomechaniki
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % 3);
    }, (durationSec * 1000) / 3);
    return () => clearInterval(interval);
  }, [durationSec]);

  const phaseLabels = [
    '1. Faza ekscentryczna (kontrola i wdech)',
    '2. Szczytowe napięcie / pełny zakres',
    '3. Faza koncentryczna (dynamiczna praca)',
  ];

  // Pomocnicza funkcja rysująca anatomiczny segment kończyny (zaokrąglony mięsień zamiast kreski)
  const Limb = ({
    x1,
    y1,
    x2,
    y2,
    w1 = 14,
    w2 = 10,
    color = '#e4e4e7',
    highlight = false,
  }) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const mx = (x1 + x2) / 2 + nx * (w1 * 0.16);
    const my = (y1 + y2) / 2 + ny * (w1 * 0.16);

    const p1x = x1 + nx * (w1 / 2);
    const p1y = y1 + ny * (w1 / 2);
    const p2x = x2 + nx * (w2 / 2);
    const p2y = y2 + ny * (w2 / 2);
    const p3x = x2 - nx * (w2 / 2);
    const p3y = y2 - ny * (w2 / 2);
    const p4x = x1 - nx * (w1 / 2);
    const p4y = y1 - ny * (w1 / 2);

    return (
      <g>
        <path
          d={`M ${p1x} ${p1y} Q ${mx + nx * (w1 / 2)} ${
            my + ny * (w1 / 2)
          } ${p2x} ${p2y} L ${p3x} ${p3y} Q ${mx - nx * (w1 / 2)} ${
            my - ny * (w1 / 2)
          } ${p4x} ${p4y} Z`}
          fill={highlight ? 'url(#activeMuscleGrad)' : color}
          stroke={highlight ? '#fb7185' : '#3f3f46'}
          strokeWidth="1.2"
        />
        <circle
          cx={x1}
          cy={y1}
          r={w1 * 0.44}
          fill={highlight ? '#f43f5e' : color}
        />
        <circle
          cx={x2}
          cy={y2}
          r={w2 * 0.44}
          fill={highlight ? '#f43f5e' : color}
        />
      </g>
    );
  };

  // Anatomiczna głowa z kobiecym kucykiem i sportową sylwetką
  const AthleteHead = ({ cx, cy, lookRight = true }) => (
    <g>
      {/* Kucyk */}
      <path
        d={
          lookRight
            ? `M ${cx - 10} ${cy - 4} Q ${cx - 26} ${cy - 12} ${cx - 24} ${
                cy + 6
              } Q ${cx - 18} ${cy + 2} ${cx - 9} ${cy + 1}`
            : `M ${cx + 10} ${cy - 4} Q ${cx + 26} ${cy - 12} ${cx + 24} ${
                cy + 6
              } Q ${cx + 18} ${cy + 2} ${cx + 9} ${cy + 1}`
        }
        fill="#be185d"
      />
      {/* Szyja */}
      <rect x={cx - 4} y={cy + 8} width="8" height="10" rx="4" fill="#d4d4d8" />
      {/* Głowa */}
      <circle
        cx={cx}
        cy={cy}
        r="12.5"
        fill="#f4f4f5"
        stroke="#52525b"
        strokeWidth="1.2"
      />
      {/* Opaska sportowa / włosy */}
      <path
        d={`M ${cx - 12} ${cy - 2} A 12.5 12.5 0 0 1 ${cx + 12} ${cy - 2} Z`}
        fill="#9d174d"
      />
    </g>
  );

  return (
    <div className="space-y-2.5">
      <div className="relative w-full h-72 bg-gradient-to-b from-zinc-900 via-[#151318] to-zinc-950 rounded-3xl border border-[#d4a5b0]/30 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Siatka studyjna */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(244,63,94,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,63,94,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Górny pasek informacyjny o mięśniach i tempie */}
        <div className="relative z-10 flex items-center justify-between px-3.5 pt-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-[10px] font-bold uppercase tracking-wider text-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Aktywne mięśnie
            </span>
            <span className="text-[11px] text-zinc-300 font-medium truncate max-w-[180px] sm:max-w-xs">
              {exercise?.muscles || 'Całe ciało • Technika Hyrox'}
            </span>
          </div>

          <button
            onClick={() => setSlowMo(!slowMo)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition ${
              slowMo
                ? 'bg-[#8c3b52] border-[#d4a5b0] text-white shadow-md'
                : 'bg-zinc-800/90 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            {slowMo ? '0.5x Wolno' : '1.0x Tempo'}
          </button>
        </div>

        {/* GŁÓWNA SCENA ANATOMICZNA SVG */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <style>{`
            @keyframes animSquatBody {
              0%, 100% { transform: translateY(0px); }
              45%, 55% { transform: translateY(34px); }
            }
            @keyframes animRdlHinge {
              0%, 100% { transform: rotate(0deg); }
              45%, 55% { transform: rotate(52deg); }
            }
            @keyframes animFreeLeg {
              0%, 100% { transform: rotate(0deg); }
              45%, 55% { transform: rotate(-52deg); }
            }
            @keyframes animBenchArm {
              0%, 100% { transform: translateY(0px); }
              45%, 55% { transform: translateY(-32px); }
            }
            @keyframes animHipBridge {
              0%, 100% { transform: translateY(18px) rotate(10deg); }
              45%, 55% { transform: translateY(-16px) rotate(-2deg); }
            }
            @keyframes animLateralArmL {
              0%, 100% { transform: rotate(0deg); }
              45%, 55% { transform: rotate(68deg); }
            }
            @keyframes animLateralArmR {
              0%, 100% { transform: rotate(0deg); }
              45%, 55% { transform: rotate(-68deg); }
            }
            @keyframes animCurlForearm {
              0%, 100% { transform: rotate(0deg); }
              45%, 55% { transform: rotate(-105deg); }
            }
            @keyframes animPulldownBar {
              0%, 100% { transform: translateY(0px); }
              45%, 55% { transform: translateY(38px); }
            }
            @keyframes animCablePull {
              0%, 100% { transform: translateX(0px); }
              45%, 55% { transform: translateX(-26px); }
            }
            @keyframes animDeadBugLimb {
              0%, 100% { transform: rotate(0deg); }
              45%, 55% { transform: rotate(55deg); }
            }
            @keyframes animRowerSlide {
              0%, 100% { transform: translateX(-24px); }
              50% { transform: translateX(22px); }
            }
            @keyframes animWalkStep1 {
              0%, 100% { transform: rotate(-18deg); }
              50% { transform: rotate(18deg); }
            }
            @keyframes animWalkStep2 {
              0%, 100% { transform: rotate(18deg); }
              50% { transform: rotate(-18deg); }
            }
            @keyframes animCossackShift {
              0%, 100% { transform: translate(0px, 0px); }
              50% { transform: translate(-28px, 28px); }
            }
          `}</style>

          <svg viewBox="0 0 320 210" className="w-full h-52 max-w-[340px]">
            <defs>
              <linearGradient
                id="activeMuscleGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <linearGradient id="torsoSuit" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8c3b52" />
                <stop offset="100%" stopColor="#4c1d2b" />
              </linearGradient>
              <filter
                id="muscleGlow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Podłoga i linia osi biomechanicznej */}
            <line
              x1="25"
              y1="185"
              x2="295"
              y2="185"
              stroke="#52525b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="160"
              y1="20"
              x2="160"
              y2="185"
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.3"
            />

            {/* 1. GOBLET SQUAT / AIR SQUAT / DEEP SQUAT */}
            {type === 'goblet_squat' && (
              <g>
                {/* Strzałka toru ruchu */}
                <path
                  d="M 92 65 L 92 125 M 87 118 L 92 126 L 97 118 M 87 72 L 92 64 L 97 72"
                  stroke="#fb7185"
                  strokeWidth="1.8"
                  fill="none"
                />
                {/* Podudzia i stopy stabilne */}
                <Limb
                  x1={182}
                  y1={132}
                  x2={174}
                  y2={178}
                  w1={14}
                  w2={10}
                  color="#d4d4d8"
                />
                <path
                  d="M 167 175 L 194 178 L 194 184 L 166 184 Z"
                  fill="#f43f5e"
                />

                {/* Ruchoma górna część ciała + uda */}
                <g
                  style={{
                    animation: `animSquatBody ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  {/* Udo i pośladek (AKTYWNE MIĘŚNIE) */}
                  <g filter="url(#muscleGlow)">
                    <Limb
                      x1={146}
                      y1={108}
                      x2={182}
                      y2={132}
                      w1={21}
                      w2={15}
                      highlight={true}
                    />
                    <circle
                      cx={143}
                      cy={108}
                      r="13"
                      fill="url(#activeMuscleGrad)"
                    />
                  </g>
                  {/* Tułów */}
                  <Limb
                    x1={154}
                    y1={56}
                    x2={146}
                    y2={106}
                    w1={24}
                    w2={20}
                    color="url(#torsoSuit)"
                  />
                  <AthleteHead cx={158} cy={34} lookRight={true} />
                  {/* Ramię i przedramię trzymające Kettlebell przy mostku */}
                  <Limb
                    x1={158}
                    y1={60}
                    x2={174}
                    y2={84}
                    w1={11}
                    w2={9}
                    color="#e4e4e7"
                  />
                  <Limb
                    x1={174}
                    y1={84}
                    x2={182}
                    y2={62}
                    w1={9}
                    w2={8}
                    color="#e4e4e7"
                  />
                  {/* Kettlebell */}
                  <path
                    d="M 178 55 C 178 49, 190 49, 190 55"
                    stroke="#a1a1aa"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx={184}
                    cy={63}
                    r="10"
                    fill="#27272a"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                  <text
                    x="179"
                    y="66"
                    fill="#fff"
                    fontSize="7"
                    fontWeight="bold"
                  >
                    KB
                  </text>
                </g>
              </g>
            )}

            {/* 2. WYKROKI (WALKING LUNGES / BULGARIAN / STEP UP) */}
            {type === 'lunge' && (
              <g>
                {/* Skrzynia/ławka w tle dla orientacji */}
                <rect
                  x="64"
                  y="152"
                  width="38"
                  height="32"
                  rx="4"
                  fill="#27272a"
                  stroke="#52525b"
                  strokeDasharray="3 2"
                />
                {/* Przednie podudzie */}
                <Limb
                  x1={196}
                  y1={134}
                  x2={196}
                  y2={178}
                  w1={14}
                  w2={10}
                  color="#d4d4d8"
                />
                <path
                  d="M 188 176 L 214 179 L 214 184 L 188 184 Z"
                  fill="#f43f5e"
                />

                <g
                  style={{
                    animation: `animSquatBody ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  {/* Tylna noga w wykroku */}
                  <Limb
                    x1={152}
                    y1={108}
                    x2={122}
                    y2={146}
                    w1={18}
                    w2={13}
                    highlight={true}
                  />
                  <Limb
                    x1={122}
                    y1={146}
                    x2={92}
                    y2={152}
                    w1={12}
                    w2={9}
                    color="#a1a1aa"
                  />
                  {/* Przednie udo i pośladek (GŁÓWNA PRACA) */}
                  <g filter="url(#muscleGlow)">
                    <Limb
                      x1={154}
                      y1={108}
                      x2={196}
                      y2={134}
                      w1={21}
                      w2={15}
                      highlight={true}
                    />
                    <circle
                      cx={150}
                      cy={108}
                      r="13"
                      fill="url(#activeMuscleGrad)"
                    />
                  </g>
                  {/* Pionowy tułów */}
                  <Limb
                    x1={156}
                    y1={54}
                    x2={154}
                    y2={106}
                    w1={23}
                    w2={19}
                    color="url(#torsoSuit)"
                  />
                  <AthleteHead cx={158} cy={32} lookRight={true} />
                  {/* Ręka z hantlą wzdłuż ciała */}
                  <Limb
                    x1={156}
                    y1={58}
                    x2={156}
                    y2={112}
                    w1={10}
                    w2={8}
                    color="#e4e4e7"
                  />
                  <rect
                    x="145"
                    y="110"
                    width="22"
                    height="9"
                    rx="3"
                    fill="#27272a"
                    stroke="#fb7185"
                    strokeWidth="1.5"
                  />
                </g>
              </g>
            )}

            {/* 3. RDL (MARTWY CIĄG RUMUŃSKI / JEDNONÓŻ / GORILLA ROW) */}
            {type === 'rdl' && (
              <g>
                {/* Noga podporowa z lekko ugiętym kolanem */}
                <Limb
                  x1={152}
                  y1={138}
                  x2={156}
                  y2={178}
                  w1={14}
                  w2={10}
                  color="#d4d4d8"
                />
                <path
                  d="M 148 176 L 175 179 L 175 184 L 148 184 Z"
                  fill="#f43f5e"
                />
                <g filter="url(#muscleGlow)">
                  <Limb
                    x1={142}
                    y1={102}
                    x2={152}
                    y2={138}
                    w1={21}
                    w2={15}
                    highlight={true}
                  />
                  <circle
                    cx={140}
                    cy={100}
                    r="13"
                    fill="url(#activeMuscleGrad)"
                  />
                </g>

                {/* Zawias biodrowy (Hip Hinge) */}
                <g
                  style={{
                    transformOrigin: '142px 102px',
                    animation: `animRdlHinge ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={148}
                    y1={50}
                    x2={142}
                    y2={102}
                    w1={23}
                    w2={19}
                    highlight={true}
                  />
                  <AthleteHead cx={152} cy={28} lookRight={true} />
                  {/* Ramię trzymające ciężar pionowo w dół */}
                  <Limb
                    x1={152}
                    y1={56}
                    x2={164}
                    y2={112}
                    w1={10}
                    w2={8}
                    color="#e4e4e7"
                  />
                  <circle
                    cx={166}
                    cy={122}
                    r="10"
                    fill="#27272a"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                </g>
                {/* Strzałka cofania biodra */}
                <path
                  d="M 122 100 L 98 100 M 104 95 L 97 100 L 104 105"
                  stroke="#fb7185"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            )}

            {/* 4. BENCH PRESS (WYCISKANIE LEŻĄC NA ŁAWCE) */}
            {type === 'bench_press' && (
              <g>
                {/* Ławka treningowa */}
                <rect
                  x="70"
                  y="132"
                  width="145"
                  height="12"
                  rx="4"
                  fill="#3f3f46"
                  stroke="#71717a"
                />
                <rect x="85" y="144" width="10" height="40" fill="#27272a" />
                <rect x="190" y="144" width="10" height="40" fill="#27272a" />

                {/* Sylwetka leżąca na ławce */}
                <AthleteHead cx={92} cy={118} lookRight={true} />
                <g filter="url(#muscleGlow)">
                  <Limb
                    x1={110}
                    y1={122}
                    x2={182}
                    y2={125}
                    w1={22}
                    w2={19}
                    highlight={true}
                  />
                </g>
                {/* Nogi wbite w podłogę */}
                <Limb
                  x1={182}
                  y1={125}
                  x2={224}
                  y2={136}
                  w1={18}
                  w2={14}
                  color="#d4d4d8"
                />
                <Limb
                  x1={224}
                  y1={136}
                  x2={222}
                  y2={178}
                  w1={13}
                  w2={10}
                  color="#d4d4d8"
                />
                <path
                  d="M 215 176 L 238 179 L 238 184 L 215 184 Z"
                  fill="#f43f5e"
                />

                {/* Ruch sztangi i ramion w górę/dół */}
                <g
                  style={{
                    animation: `animBenchArm ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={124}
                    y1={120}
                    x2={124}
                    y2={82}
                    w1={12}
                    w2={9}
                    highlight={true}
                  />
                  {/* Sztanga z talerzami */}
                  <line
                    x1="100"
                    y1="80"
                    x2="148"
                    y2="80"
                    stroke="#e4e4e7"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <rect
                    x="116"
                    y="64"
                    width="16"
                    height="32"
                    rx="4"
                    fill="#e11d48"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </g>
              </g>
            )}

            {/* 5. HIP THRUST / GLUTE BRIDGE */}
            {type === 'hip_thrust' && (
              <g>
                {/* Oparcie ławki pod łopatkami */}
                <rect
                  x="58"
                  y="114"
                  width="42"
                  height="70"
                  rx="6"
                  fill="#27272a"
                  stroke="#52525b"
                  strokeWidth="2"
                />
                {/* Podudzie pionowo */}
                <Limb
                  x1={212}
                  y1={120}
                  x2={212}
                  y2={178}
                  w1={14}
                  w2={10}
                  color="#d4d4d8"
                />
                <path
                  d="M 204 176 L 230 179 L 230 184 L 204 184 Z"
                  fill="#f43f5e"
                />

                {/* Ruchome biodra i tułów */}
                <g
                  style={{
                    transformOrigin: '96px 118px',
                    animation: `animHipBridge ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <AthleteHead cx={82} cy={100} lookRight={true} />
                  <Limb
                    x1={96}
                    y1={118}
                    x2={160}
                    y2={120}
                    w1={22}
                    w2={20}
                    color="url(#torsoSuit)"
                  />
                  {/* Pośladek i udo (GLÓWNA PRACA) */}
                  <g filter="url(#muscleGlow)">
                    <circle
                      cx={160}
                      cy={122}
                      r="15"
                      fill="url(#activeMuscleGrad)"
                    />
                    <Limb
                      x1={160}
                      y1={120}
                      x2={212}
                      y2={120}
                      w1={21}
                      w2={15}
                      highlight={true}
                    />
                  </g>
                  {/* Sztanga na biodrach */}
                  <circle
                    cx={160}
                    cy={104}
                    r="13"
                    fill="#e11d48"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </g>
              </g>
            )}

            {/* 6. LATERAL RAISES (WZNOSY BOKIEM - WIDOK Z PRZODU) */}
            {type === 'lateral_raise' && (
              <g>
                <AthleteHead cx={160} cy={38} lookRight={true} />
                {/* Tułów z przodu */}
                <path
                  d="M 140 54 L 180 54 L 173 108 L 147 108 Z"
                  fill="url(#torsoSuit)"
                  stroke="#d4a5b0"
                  strokeWidth="1"
                />
                {/* Nogi stabilnie */}
                <Limb
                  x1={151}
                  y1={108}
                  x2={147}
                  y2={178}
                  w1={16}
                  w2={10}
                  color="#d4d4d8"
                />
                <Limb
                  x1={169}
                  y1={108}
                  x2={173}
                  y2={178}
                  w1={16}
                  w2={10}
                  color="#d4d4d8"
                />

                {/* Barki świecące */}
                <g filter="url(#muscleGlow)">
                  <circle
                    cx={136}
                    cy={58}
                    r="10"
                    fill="url(#activeMuscleGrad)"
                  />
                  <circle
                    cx={184}
                    cy={58}
                    r="10"
                    fill="url(#activeMuscleGrad)"
                  />
                </g>

                {/* Lewe i prawe ramię unoszące hantle */}
                <g
                  style={{
                    transformOrigin: '136px 58px',
                    animation: `animLateralArmR ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={136}
                    y1={58}
                    x2={132}
                    y2={112}
                    w1={11}
                    w2={8}
                    highlight={true}
                  />
                  <rect
                    x="122"
                    y="110"
                    width="18"
                    height="7"
                    rx="2"
                    fill="#e11d48"
                    stroke="#fff"
                  />
                </g>
                <g
                  style={{
                    transformOrigin: '184px 58px',
                    animation: `animLateralArmL ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={184}
                    y1={58}
                    x2={188}
                    y2={112}
                    w1={11}
                    w2={8}
                    highlight={true}
                  />
                  <rect
                    x="180"
                    y="110"
                    width="18"
                    height="7"
                    rx="2"
                    fill="#e11d48"
                    stroke="#fff"
                  />
                </g>
              </g>
            )}

            {/* 7. BICEPS CURL (UGINANIE ZE SZTANGĄ) */}
            {type === 'biceps_curl' && (
              <g>
                <AthleteHead cx={156} cy={34} lookRight={true} />
                <Limb
                  x1={154}
                  y1={54}
                  x2={152}
                  y2={108}
                  w1={23}
                  w2={19}
                  color="url(#torsoSuit)"
                />
                <Limb
                  x1={152}
                  y1={108}
                  x2={154}
                  y2={178}
                  w1={18}
                  w2={11}
                  color="#d4d4d8"
                />
                <path
                  d="M 146 176 L 174 179 L 174 184 L 146 184 Z"
                  fill="#f43f5e"
                />

                {/* Ramię przyklejone do boku (BICEPS PODŚWIETLONY) */}
                <g filter="url(#muscleGlow)">
                  <Limb
                    x1={156}
                    y1={58}
                    x2={158}
                    y2={96}
                    w1={13}
                    w2={11}
                    highlight={true}
                  />
                </g>
                {/* Przedramię uginające się w łokciu */}
                <g
                  style={{
                    transformOrigin: '158px 96px',
                    animation: `animCurlForearm ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={158}
                    y1={96}
                    x2={164}
                    y2={132}
                    w1={10}
                    w2={8}
                    highlight={true}
                  />
                  <circle
                    cx={166}
                    cy={135}
                    r="8"
                    fill="#e11d48"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </g>
              </g>
            )}

            {/* 8. LAT PULLDOWN / SCAPULA PULL-UP */}
            {type === 'lat_pulldown' && (
              <g>
                {/* Konstrukcja wyciągu */}
                <line
                  x1="160"
                  y1="10"
                  x2="160"
                  y2="55"
                  stroke="#71717a"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <AthleteHead cx={160} cy={74} lookRight={true} />
                {/* Najszerszy grzbietu (AKTYWNY) */}
                <g filter="url(#muscleGlow)">
                  <path
                    d="M 136 90 L 184 90 L 172 142 L 148 142 Z"
                    fill="url(#activeMuscleGrad)"
                  />
                </g>
                {/* Ruchomy drążek i ramiona */}
                <g
                  style={{
                    animation: `animPulldownBar ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <line
                    x1="104"
                    y1="36"
                    x2="216"
                    y2="36"
                    stroke="#fff"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <Limb
                    x1={138}
                    y1={92}
                    x2={116}
                    y2={38}
                    w1={12}
                    w2={9}
                    highlight={true}
                  />
                  <Limb
                    x1={182}
                    y1={92}
                    x2={204}
                    y2={38}
                    w1={12}
                    w2={9}
                    highlight={true}
                  />
                </g>
              </g>
            )}

            {/* 9. OVERHEAD PRESS / HALO PLATE */}
            {type === 'overhead_press' && (
              <g>
                <AthleteHead cx={160} cy={66} lookRight={true} />
                <path
                  d="M 140 82 L 180 82 L 174 142 L 146 142 Z"
                  fill="url(#torsoSuit)"
                />
                <g filter="url(#muscleGlow)">
                  <circle
                    cx={136}
                    cy={86}
                    r="11"
                    fill="url(#activeMuscleGrad)"
                  />
                  <circle
                    cx={184}
                    cy={86}
                    r="11"
                    fill="url(#activeMuscleGrad)"
                  />
                </g>
                <g
                  style={{
                    animation: `animBenchArm ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={136}
                    y1={86}
                    x2={128}
                    y2={48}
                    w1={11}
                    w2={9}
                    highlight={true}
                  />
                  <Limb
                    x1={184}
                    y1={86}
                    x2={192}
                    y2={48}
                    w1={11}
                    w2={9}
                    highlight={true}
                  />
                  <rect
                    x="114"
                    y="42"
                    width="24"
                    height="8"
                    rx="3"
                    fill="#e11d48"
                    stroke="#fff"
                  />
                  <rect
                    x="182"
                    y="42"
                    width="24"
                    height="8"
                    rx="3"
                    fill="#e11d48"
                    stroke="#fff"
                  />
                </g>
              </g>
            )}

            {/* 10. WYCIĄG / FACE PULLS / TRICEPS / PALLOF / BAND PULL */}
            {type === 'cable_pull' && (
              <g>
                {/* Kolumna wyciągu z prawej */}
                <rect x="248" y="25" width="10" height="160" fill="#3f3f46" />
                <circle cx="248" cy="76" r="6" fill="#f43f5e" />

                <AthleteHead cx={124} cy={40} lookRight={true} />
                <Limb
                  x1={122}
                  y1={60}
                  x2={120}
                  y2={112}
                  w1={22}
                  w2={19}
                  highlight={true}
                />
                <Limb
                  x1={120}
                  y1={112}
                  x2={122}
                  y2={178}
                  w1={17}
                  w2={11}
                  color="#d4d4d8"
                />

                {/* Ramię i linka wyciągu */}
                <g
                  style={{
                    animation: `animCablePull ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <line
                    x1="168"
                    y1="76"
                    x2="248"
                    y2="76"
                    stroke="#fb7185"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  <Limb
                    x1={124}
                    y1={66}
                    x2={168}
                    y2={76}
                    w1={12}
                    w2={9}
                    highlight={true}
                  />
                  <circle cx={168} cy={76} r="6" fill="#fff" />
                </g>
              </g>
            )}

            {/* 11. PLANK / COPENHAGEN ADDUCTION / BEAR CRAWL */}
            {type === 'plank_core' && (
              <g>
                <AthleteHead cx={82} cy={104} lookRight={false} />
                {/* Podparcie na przedramieniu */}
                <Limb
                  x1={102}
                  y1={112}
                  x2={98}
                  y2={176}
                  w1={12}
                  w2={9}
                  color="#e4e4e7"
                />
                <Limb
                  x1={98}
                  y1={176}
                  x2={74}
                  y2={178}
                  w1={9}
                  w2={8}
                  color="#e4e4e7"
                />
                {/* Świecący gorset Core i biodra */}
                <g filter="url(#muscleGlow)">
                  <Limb
                    x1={102}
                    y1={112}
                    x2={174}
                    y2={132}
                    w1={22}
                    w2={19}
                    highlight={true}
                  />
                </g>
                {/* Nogi w linii */}
                <Limb
                  x1={174}
                  y1={132}
                  x2={244}
                  y2={172}
                  w1={18}
                  w2={11}
                  highlight={true}
                />
                {/* Linia idealnej deski */}
                <line
                  x1="76"
                  y1="92"
                  x2="252"
                  y2="154"
                  stroke="#34d399"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
              </g>
            )}

            {/* 12. DEAD BUG (MARTWY ROBAK) / SIDE LYING HIP ADDUCTION */}
            {type === 'dead_bug' && (
              <g>
                {/* Mata treningowa */}
                <rect
                  x="65"
                  y="166"
                  width="190"
                  height="8"
                  rx="4"
                  fill="#8c3b52"
                />
                <AthleteHead cx={94} cy={152} lookRight={true} />
                {/* Tułów z odcinkiem lędźwiowym dociśniętym do maty */}
                <g filter="url(#muscleGlow)">
                  <Limb
                    x1={112}
                    y1={154}
                    x2={178}
                    y2={156}
                    w1={21}
                    w2={19}
                    highlight={true}
                  />
                </g>
                {/* Noga stacjonarna 90/90 */}
                <Limb
                  x1={178}
                  y1={154}
                  x2={180}
                  y2={114}
                  w1={16}
                  w2={12}
                  color="#a1a1aa"
                />
                <Limb
                  x1={180}
                  y1={114}
                  x2={216}
                  y2={114}
                  w1={12}
                  w2={9}
                  color="#a1a1aa"
                />

                {/* Ruchoma noga i przeciwna ręka */}
                <g
                  style={{
                    transformOrigin: '178px 154px',
                    animation: `animDeadBugLimb ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={178}
                    y1={154}
                    x2={192}
                    y2={110}
                    w1={16}
                    w2={11}
                    highlight={true}
                  />
                </g>
                <g
                  style={{
                    transformOrigin: '116px 152px',
                    animation: `animDeadBugLimb ${durationSec}s ease-in-out infinite reverse`,
                  }}
                >
                  <Limb
                    x1={116}
                    y1={152}
                    x2={116}
                    y2={100}
                    w1={11}
                    w2={8}
                    highlight={true}
                  />
                </g>
              </g>
            )}

            {/* 13. COSSACK SQUAT / WINDMILL */}
            {(type === 'cossack' || type === 'windmill') && (
              <g>
                <g
                  style={{
                    animation: `animCossackShift ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <AthleteHead cx={160} cy={42} lookRight={true} />
                  <path
                    d="M 142 58 L 178 58 L 172 108 L 148 108 Z"
                    fill="url(#torsoSuit)"
                  />
                  <g filter="url(#muscleGlow)">
                    <Limb
                      x1={150}
                      y1={108}
                      x2={122}
                      y2={176}
                      w1={19}
                      w2={11}
                      highlight={true}
                    />
                    <Limb
                      x1={170}
                      y1={108}
                      x2={218}
                      y2={176}
                      w1={17}
                      w2={10}
                      highlight={true}
                    />
                  </g>
                  {type === 'windmill' && (
                    <g>
                      <Limb
                        x1={176}
                        y1={60}
                        x2={176}
                        y2={18}
                        w1={10}
                        w2={8}
                        highlight={true}
                      />
                      <circle
                        cx={176}
                        cy={14}
                        r="8"
                        fill="#e11d48"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </g>
              </g>
            )}

            {/* 14. ERGOMETR WIOŚLARSKI / SKIERG */}
            {type === 'rower' && (
              <g>
                {/* Szyna ergometru i koło zamachowe */}
                <line
                  x1="70"
                  y1="168"
                  x2="250"
                  y2="168"
                  stroke="#71717a"
                  strokeWidth="5"
                />
                <circle
                  cx="242"
                  cy="130"
                  r="24"
                  fill="#27272a"
                  stroke="#f43f5e"
                  strokeWidth="3"
                />
                <g
                  style={{
                    animation: `animRowerSlide ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <AthleteHead cx={136} cy={78} lookRight={true} />
                  <Limb
                    x1={134}
                    y1={96}
                    x2={128}
                    y2={152}
                    w1={21}
                    w2={18}
                    highlight={true}
                  />
                  <Limb
                    x1={128}
                    y1={152}
                    x2={178}
                    y2={132}
                    w1={18}
                    w2={13}
                    highlight={true}
                  />
                  <Limb
                    x1={178}
                    y1={132}
                    x2={212}
                    y2={162}
                    w1={13}
                    w2={10}
                    color="#d4d4d8"
                  />
                  <Limb
                    x1={136}
                    y1={102}
                    x2={182}
                    y2={116}
                    w1={11}
                    w2={8}
                    color="#e4e4e7"
                  />
                  <line
                    x1="182"
                    y1="116"
                    x2="242"
                    y2="116"
                    stroke="#e4e4e7"
                    strokeWidth="2"
                  />
                </g>
              </g>
            )}

            {/* 15. FARMER'S WALK */}
            {type === 'farmers_walk' && (
              <g>
                <AthleteHead cx={160} cy={34} lookRight={true} />
                <Limb
                  x1={158}
                  y1={54}
                  x2={158}
                  y2={108}
                  w1={23}
                  w2={19}
                  highlight={true}
                />
                {/* Naprzemienny krok nóg */}
                <g
                  style={{
                    transformOrigin: '158px 108px',
                    animation: `animWalkStep1 ${
                      durationSec * 0.6
                    }s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={158}
                    y1={108}
                    x2={144}
                    y2={178}
                    w1={17}
                    w2={11}
                    color="#a1a1aa"
                  />
                </g>
                <g
                  style={{
                    transformOrigin: '158px 108px',
                    animation: `animWalkStep2 ${
                      durationSec * 0.6
                    }s ease-in-out infinite`,
                  }}
                >
                  <Limb
                    x1={158}
                    y1={108}
                    x2={174}
                    y2={178}
                    w1={17}
                    w2={11}
                    highlight={true}
                  />
                </g>
                {/* Ramię i ciężki Kettlebell Hyrox */}
                <Limb
                  x1={158}
                  y1={58}
                  x2={158}
                  y2={118}
                  w1={12}
                  w2={9}
                  highlight={true}
                />
                <rect
                  x="144"
                  y="118"
                  width="28"
                  height="24"
                  rx="6"
                  fill="#e11d48"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x="149"
                  y="133"
                  fill="#fff"
                  fontSize="7"
                  fontWeight="bold"
                >
                  24kg
                </text>
              </g>
            )}

            {/* 16. MOBILIZACJA W KLĘKU (KOCI GRZBIET / BIRD DOG / THREAD THE NEEDLE) */}
            {type === 'kneeling_mobility' && (
              <g>
                <rect
                  x="75"
                  y="172"
                  width="170"
                  height="6"
                  rx="3"
                  fill="#8c3b52"
                />
                {/* Podudzia i ręka podporowa */}
                <Limb
                  x1={184}
                  y1={128}
                  x2={186}
                  y2={172}
                  w1={16}
                  w2={12}
                  color="#d4d4d8"
                />
                <Limb
                  x1={116}
                  y1={124}
                  x2={114}
                  y2={172}
                  w1={11}
                  w2={9}
                  color="#d4d4d8"
                />
                <g
                  style={{
                    animation: `animHipBridge ${durationSec}s ease-in-out infinite`,
                  }}
                >
                  <AthleteHead cx={96} cy={114} lookRight={false} />
                  <g filter="url(#muscleGlow)">
                    <Limb
                      x1={114}
                      y1={120}
                      x2={184}
                      y2={124}
                      w1={21}
                      w2={18}
                      highlight={true}
                    />
                  </g>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Dolny pasek faz ruchu biomechanicznego */}
        <div className="relative z-10 bg-zinc-950/90 border-t border-zinc-800/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-zinc-200">
              {phaseLabels[phaseIndex]}
            </span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  phaseIndex === i ? 'w-5 bg-[#d4a5b0]' : 'w-1.5 bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// GŁÓWNA APLIKACJA
// ============================================================================

export default function App() {
  // Aktywny tydzień (1-8, plan na 2 miesiące)
  const [currentWeek, setCurrentWeek] = useState(1);
  // Aktywna zakładka ('w1', 'w2', 'w3', 'videos', 'progress')
  const [activeTab, setActiveTab] = useState('w1');
  // Czy pokazać wytyczne planu
  const [showRules, setShowRules] = useState(false);
  // Czy rozgrzewka zwinięta
  const [warmupCollapsed, setWarmupCollapsed] = useState(false);
  // Modal z animacją, wideo i techniką ćwiczenia
  const [selectedExerciseModal, setSelectedExerciseModal] = useState(null);
  // Zakładka wewnątrz modala ('anim' | 'my_video' | 'tutorial_url')
  const [modalViewTab, setModalViewTab] = useState('anim');
  // Powiadomienie o skopiowaniu raportu dla Pawła
  const [copiedToast, setCopiedToast] = useState(false);
  // Wybrane ćwiczenie na wykresie progresu
  const [progressExerciseId, setProgressExerciseId] = useState('w1_e1');

  // Stan wideo z IndexedDB: lista kluczy posiadających zapisany plik wideo + aktywny URL obiektowy
  const [storedVideoKeys, setStoredVideoKeys] = useState([]);
  const [activeVideoObjectUrl, setActiveVideoObjectUrl] = useState(null);
  const [activeVideoMeta, setActiveVideoMeta] = useState(null);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [videoNoteInput, setVideoNoteInput] = useState('');
  const videoPlayerRef = useRef(null);

  // Stan treningowy zapisywany w localStorage
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('asia_hyrox_plan_v2');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('asia_hyrox_plan_v1');
      return old ? JSON.parse(old) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('asia_hyrox_plan_v2', JSON.stringify(logs));
    } catch (e) {
      console.error('Błąd zapisu localStorage:', e);
    }
  }, [logs]);

  // Odświeżenie listy zapisanych wideo w IndexedDB
  const refreshStoredVideosList = async () => {
    try {
      const keys = await getAllVideoKeysFromDB();
      setStoredVideoKeys(keys);
    } catch (e) {
      console.error('IndexedDB error:', e);
    }
  };

  useEffect(() => {
    refreshStoredVideosList();
  }, []);

  // Ładowanie pliku wideo z IndexedDB gdy otwieramy modal dla wybranego ćwiczenia
  const weekKey = `week_${currentWeek}`;
  const prevWeekKey = currentWeek > 1 ? `week_${currentWeek - 1}` : null;

  useEffect(() => {
    let urlToRevoke = null;
    const loadModalVideo = async () => {
      if (!selectedExerciseModal) {
        setActiveVideoObjectUrl(null);
        setActiveVideoMeta(null);
        return;
      }
      const exId = selectedExerciseModal.id;
      const savedTutorialUrl = logs?.customTutorialUrls?.[exId] || '';
      setCustomUrlInput(savedTutorialUrl);

      const savedNote = logs?.[weekKey]?.videoNotes?.[exId] || '';
      setVideoNoteInput(savedNote);

      const dbKey = `${weekKey}_${exId}`;
      try {
        const record = await getVideoBlobFromDB(dbKey);
        if (record && record.blob) {
          const objUrl = URL.createObjectURL(record.blob);
          urlToRevoke = objUrl;
          setActiveVideoObjectUrl(objUrl);
          setActiveVideoMeta(record);
        } else {
          setActiveVideoObjectUrl(null);
          setActiveVideoMeta(null);
        }
      } catch {
        setActiveVideoObjectUrl(null);
        setActiveVideoMeta(null);
      }
    };

    loadModalVideo();
    return () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    };
  }, [selectedExerciseModal, currentWeek]);

  // Obsługa wgrania filmiku z telefonu / kamery dla ćwiczenia
  const handleVideoFileUpload = async (e, ex) => {
    const file = e.target.files?.[0];
    if (!file || !ex) return;
    const dbKey = `${weekKey}_${ex.id}`;
    try {
      await saveVideoBlobToDB(dbKey, file, {
        exerciseId: ex.id,
        exerciseName: ex.name,
        week: currentWeek,
      });
      await refreshStoredVideosList();

      // Automatycznie oznacz ćwiczenie jako "Nagrane dla Pawła"
      setLogs((prev) => ({
        ...prev,
        [weekKey]: {
          ...(prev[weekKey] || {}),
          recorded: {
            ...(prev[weekKey]?.recorded || {}),
            [ex.id]: true,
          },
        },
      }));

      // Jeśli modal jest otwarty na tym ćwiczeniu, odśwież podgląd
      if (selectedExerciseModal?.id === ex.id) {
        const objUrl = URL.createObjectURL(file);
        setActiveVideoObjectUrl(objUrl);
        setActiveVideoMeta({
          fileName: file.name,
          blob: file,
          updatedAt: new Date().toISOString(),
        });
        setModalViewTab('my_video');
      } else {
        setSelectedExerciseModal(ex);
        setModalViewTab('my_video');
      }
    } catch (err) {
      console.error('Nie udało się zapisać wideo:', err);
    }
  };

  const handleDeleteVideo = async (exId) => {
    const dbKey = `${weekKey}_${exId}`;
    await deleteVideoBlobFromDB(dbKey);
    await refreshStoredVideosList();
    setActiveVideoObjectUrl(null);
    setActiveVideoMeta(null);
  };

  const saveVideoNoteForPawel = (exId, noteText) => {
    setVideoNoteInput(noteText);
    setLogs((prev) => ({
      ...prev,
      [weekKey]: {
        ...(prev[weekKey] || {}),
        videoNotes: {
          ...(prev[weekKey]?.videoNotes || {}),
          [exId]: noteText,
        },
      },
    }));
  };

  const saveCustomTutorialUrl = (exId, urlText) => {
    setCustomUrlInput(urlText);
    setLogs((prev) => ({
      ...prev,
      customTutorialUrls: {
        ...(prev.customTutorialUrls || {}),
        [exId]: urlText,
      },
    }));
  };

  // Udostępnij nagrane wideo bezpośrednio Pawłowi (Web Share API na iPhone)
  const shareVideoWithPawel = async (ex) => {
    if (!activeVideoMeta?.blob) return;
    const note = logs?.[weekKey]?.videoNotes?.[ex.id] || '';
    const shareTitle = `${ex.name} - Tydzień ${currentWeek} (Do oceny techniki)`;
    const shareText = `Cześć Paweł! Przesyłam serię do oceny techniki: ${
      ex.name
    } (Tydzień ${currentWeek}). ${note ? `Uwaga: ${note}` : ''}`;

    try {
      const file = new File(
        [activeVideoMeta.blob],
        activeVideoMeta.fileName || `${ex.id}_tydz${currentWeek}.mp4`,
        { type: activeVideoMeta.mimeType || 'video/mp4' }
      );
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
        });
        return;
      }
    } catch {
      // Fallback do pobrania pliku jeśli anulowano lub brak wsparcia
    }

    if (activeVideoObjectUrl) {
      const a = document.createElement('a');
      a.href = activeVideoObjectUrl;
      a.download = activeVideoMeta.fileName || `${ex.name}.mp4`;
      a.click();
    }
  };

  // ============================================================================
  // GLOBALNY FLOATING TIMER PRZERW MIĘDZY SERIAMI
  // ============================================================================
  const [restTimer, setRestTimer] = useState({
    active: false,
    remaining: 0,
    total: 0,
    label: '',
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Ignoruj gdy brak interakcji audio
    }
  };

  useEffect(() => {
    if (!restTimer.active) return;
    if (restTimer.remaining <= 0) {
      playBeep();
      setRestTimer((prev) => ({ ...prev, active: false }));
      return;
    }
    const interval = setInterval(() => {
      setRestTimer((prev) => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - 1),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer.active, restTimer.remaining]);

  const startRestTimer = (seconds, label) => {
    if (!seconds || seconds <= 0) return;
    setRestTimer({
      active: true,
      remaining: seconds,
      total: seconds,
      label,
    });
  };

  // ============================================================================
  // DEDYKOWANE TIMERY DO ĆWICZEŃ CZASOWYCH (PLANK / COPENHAGEN) ORAZ FINISHERÓW
  // ============================================================================
  const [exerciseStopwatch, setExerciseStopwatch] = useState({
    exId: null,
    running: false,
    seconds: 0,
    target: 30,
  });

  useEffect(() => {
    if (!exerciseStopwatch.running) return;
    const t = setInterval(() => {
      setExerciseStopwatch((prev) => {
        const next = prev.seconds + 1;
        if (next === prev.target) playBeep();
        return { ...prev, seconds: next };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [exerciseStopwatch.running]);

  // Finisher EMOM / AMRAP state
  const [emomState, setEmomState] = useState({
    running: false,
    round: 1,
    secondsLeftInRound: 60,
    finished: false,
  });

  useEffect(() => {
    if (!emomState.running) return;
    const t = setInterval(() => {
      setEmomState((prev) => {
        if (prev.secondsLeftInRound > 1) {
          return { ...prev, secondsLeftInRound: prev.secondsLeftInRound - 1 };
        } else {
          playBeep();
          if (prev.round < 5) {
            return {
              ...prev,
              round: prev.round + 1,
              secondsLeftInRound: 60,
            };
          } else {
            return {
              running: false,
              round: 5,
              secondsLeftInRound: 0,
              finished: true,
            };
          }
        }
      });
    }, 1000);
    return () => clearInterval(t);
  }, [emomState.running]);

  const [amrapState, setAmrapState] = useState({
    running: false,
    secondsLeft: 360,
  });

  useEffect(() => {
    if (!amrapState.running) return;
    if (amrapState.secondsLeft <= 0) {
      playBeep();
      setAmrapState((prev) => ({ ...prev, running: false }));
      return;
    }
    const t = setInterval(() => {
      setAmrapState((prev) => ({
        ...prev,
        secondsLeft: Math.max(0, prev.secondsLeft - 1),
      }));
    }, 1000);
    return () => clearInterval(t);
  }, [amrapState.running, amrapState.secondsLeft]);

  // ============================================================================
  // POMOCNICZE FUNKCJE ODCZYTU I ZAPISU DANYCH TYGODNIA
  // ============================================================================
  const hasSavedVideoClip = (exId) => {
    return storedVideoKeys.includes(`${weekKey}_${exId}`);
  };

  const getSetData = (exId, setIdx, defaultReps) => {
    return (
      logs?.[weekKey]?.sets?.[`${exId}_s${setIdx}`] || {
        weight: '',
        reps: defaultReps.replace(/[^0-9-]/g, '').split('-')[0] || '',
        rir: '2',
        done: false,
      }
    );
  };

  const getPrevWeekSetData = (exId, setIdx) => {
    if (!prevWeekKey) return null;
    const data = logs?.[prevWeekKey]?.sets?.[`${exId}_s${setIdx}`];
    if (data && (data.weight || data.done)) return data;
    return null;
  };

  const updateSetData = (exId, setIdx, field, value, defaultReps) => {
    const current = getSetData(exId, setIdx, defaultReps);
    const updated = { ...current, [field]: value };
    setLogs((prev) => ({
      ...prev,
      [weekKey]: {
        ...(prev[weekKey] || {}),
        sets: {
          ...(prev[weekKey]?.sets || {}),
          [`${exId}_s${setIdx}`]: updated,
        },
      },
    }));
  };

  const toggleSetDone = (ex, setIdx) => {
    const current = getSetData(ex.id, setIdx, ex.reps);
    const nextDone = !current.done;
    updateSetData(ex.id, setIdx, 'done', nextDone, ex.reps);
    if (nextDone && ex.rest > 0) {
      startRestTimer(ex.rest, `${ex.name} • Seria ${setIdx + 1}`);
    }
  };

  const isWarmupSetDone = (exId, setIdx) => {
    return !!logs?.[weekKey]?.warmup?.[`${exId}_s${setIdx}`];
  };

  const toggleWarmupSet = (exId, setIdx) => {
    const current = isWarmupSetDone(exId, setIdx);
    setLogs((prev) => ({
      ...prev,
      [weekKey]: {
        ...(prev[weekKey] || {}),
        warmup: {
          ...(prev[weekKey]?.warmup || {}),
          [`${exId}_s${setIdx}`]: !current,
        },
      },
    }));
  };

  const isRecordedForPawel = (exId) => {
    return !!logs?.[weekKey]?.recorded?.[exId] || hasSavedVideoClip(exId);
  };

  const toggleRecordedForPawel = (exId) => {
    const current = !!logs?.[weekKey]?.recorded?.[exId];
    setLogs((prev) => ({
      ...prev,
      [weekKey]: {
        ...(prev[weekKey] || {}),
        recorded: {
          ...(prev[weekKey]?.recorded || {}),
          [exId]: !current,
        },
      },
    }));
  };

  const getFinisherData = (workoutId) => {
    return (
      logs?.[weekKey]?.finisher?.[workoutId] || {
        done: false,
        amrapRounds: 0,
        circuitChecks: {},
        emomRounds: [false, false, false, false, false],
        notes: '',
      }
    );
  };

  const updateFinisherData = (workoutId, patch) => {
    const current = getFinisherData(workoutId);
    setLogs((prev) => ({
      ...prev,
      [weekKey]: {
        ...(prev[weekKey] || {}),
        finisher: {
          ...(prev[weekKey]?.finisher || {}),
          [workoutId]: { ...current, ...patch },
        },
      },
    }));
  };

  // ============================================================================
  // OBLICZANIE PROGRESU TRENINGU I GENERATOR RAPORTU DLA PAWŁA
  // ============================================================================
  const currentWorkout = useMemo(
    () => WORKOUTS.find((w) => w.id === activeTab) || WORKOUTS[0],
    [activeTab]
  );

  const getWorkoutCompletion = (workout) => {
    let total = 0;
    let completed = 0;
    workout.warmup.forEach((m) => {
      for (let i = 0; i < m.sets; i++) {
        total++;
        if (isWarmupSetDone(m.id, i)) completed++;
      }
    });
    workout.main.forEach((e) => {
      for (let i = 0; i < e.sets; i++) {
        total++;
        if (getSetData(e.id, i, e.reps).done) completed++;
      }
    });
    total += 1; // Finisher
    if (getFinisherData(workout.id).done) completed += 1;
    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const generateReportForPawel = (workout) => {
    const lines = [];
    lines.push(`🏋️‍♀️ *${workout.name}* (Tydzień ${currentWeek})`);
    lines.push(`Trener: Oporski Paweł • Hyrox Miesiąc 1`);
    lines.push('');

    const warmupDoneCount = workout.warmup.reduce((acc, m) => {
      let c = 0;
      for (let i = 0; i < m.sets; i++) if (isWarmupSetDone(m.id, i)) c++;
      return acc + c;
    }, 0);
    lines.push(
      `✅ Mobilizacja: wykonano ${warmupDoneCount} serii rozgrzewkowych`
    );
    lines.push('');
    lines.push('💪 *Część główna:*');

    workout.main.forEach((ex, idx) => {
      const setStrings = [];
      for (let i = 0; i < ex.sets; i++) {
        const s = getSetData(ex.id, i, ex.reps);
        if (s.done || s.weight) {
          const wStr = s.weight ? `${s.weight}${ex.defaultUnit}` : 'BW';
          setStrings.push(`${wStr}×${s.reps || ex.reps}`);
        }
      }
      const hasClip = hasSavedVideoClip(ex.id);
      const rec = hasClip
        ? ' 🎬[Wideo w aplikacji]'
        : isRecordedForPawel(ex.id)
        ? ' 🎥[Nagrane]'
        : '';
      const note = logs?.[weekKey]?.videoNotes?.[ex.id]
        ? ` (Notatka: ${logs[weekKey].videoNotes[ex.id]})`
        : '';
      lines.push(
        `${idx + 1}. ${ex.name}: ${
          setStrings.length > 0 ? setStrings.join(' | ') : 'brak wpisu'
        }${rec}${note}`
      );
    });

    const fin = getFinisherData(workout.id);
    lines.push('');
    if (workout.finisher.type === 'amrap') {
      lines.push(
        `🔥 *Finisher AMRAP 6 min:* ${fin.amrapRounds || 0} pełnych obwodów ${
          fin.done ? '✅' : ''
        }`
      );
    } else if (workout.finisher.type === 'emom') {
      const rDone = (fin.emomRounds || []).filter(Boolean).length;
      lines.push(
        `🔥 *Finisher EMOM 5 min (SkiErg 4 kcal):* ${rDone}/5 rund ✅`
      );
    } else {
      lines.push(
        `🔥 *Finisher 2 Obwody:* ${
          fin.done ? 'Ukończone w 100% ✅' : 'W trakcie'
        }`
      );
    }

    const reportText = lines.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reportText);
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Lista wszystkich ćwiczeń głównych do wykresu progresu
  const allMainExercises = useMemo(() => {
    return WORKOUTS.flatMap((w) =>
      w.main.map((ex) => ({
        ...ex,
        workoutName: w.shortName,
      }))
    );
  }, []);

  // Lista wszystkich ćwiczeń (mobilizacja + główne) do Biblioteki Wideo
  const allExercisesWithMeta = useMemo(() => {
    return WORKOUTS.flatMap((w) => [
      ...w.warmup.map((m) => ({
        ...m,
        workoutName: w.shortName,
        section: 'Mobilizacja',
      })),
      ...w.main.map((e) => ({
        ...e,
        workoutName: w.shortName,
        section: 'Część główna',
      })),
    ]);
  }, []);

  // Pomocnicza konwersja linku YouTube na embed URL
  const getEmbedVideoUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const vId = url.split('v=')[1]?.split('&')[0];
        return vId ? `https://www.youtube.com/embed/${vId}` : null;
      }
      if (url.includes('youtu.be/')) {
        const vId = url.split('youtu.be/')[1]?.split('?')[0];
        return vId ? `https://www.youtube.com/embed/${vId}` : null;
      }
      if (url.includes('youtube.com/shorts/')) {
        const vId = url.split('shorts/')[1]?.split('?')[0];
        return vId ? `https://www.youtube.com/embed/${vId}` : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const currentWeekVideosCount = useMemo(() => {
    return allExercisesWithMeta.filter((ex) => hasSavedVideoClip(ex.id)).length;
  }, [storedVideoKeys, currentWeek, allExercisesWithMeta]);

  return (
    <div className="min-h-screen bg-[#121113] text-zinc-100 font-sans pb-32 selection:bg-rose-500 selection:text-white">
      {/* Górny dekoracyjny blask w kolorze brudnego różu z PDF-a */}
      <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-[#8c3b52]/25 via-[#d4a5b0]/5 to-transparent pointer-events-none z-0" />

      {/* ====================================================================
          NAGŁÓWEK PLANU + WYTYCZNE PAWŁA
      ==================================================================== */}
      <header className="relative z-10 max-w-xl mx-auto px-4 pt-5 pb-3">
        <div className="bg-zinc-900/90 backdrop-blur-md border border-[#d4a5b0]/25 rounded-3xl p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8c3b52]/30 border border-[#d4a5b0]/30 text-[#e8c5cd] text-[11px] font-medium tracking-wide mb-1.5">
                <Sparkles className="w-3 h-3 text-[#d4a5b0]" />
                Trener: Oporski Paweł
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Miesiąc 1 — Hyrox Prep
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Personalny dziennik Asi • Anatomiczne animacje & Nagrania wideo
              </p>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 transition"
              title="Dźwięk timera"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#d4a5b0]" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
            </button>
          </div>

          {/* Przycisk rozwijania wytycznych z PDF */}
          <button
            onClick={() => setShowRules(!showRules)}
            className="mt-4 w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#8c3b52]/15 hover:bg-[#8c3b52]/25 border border-[#d4a5b0]/25 text-left transition"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-[#eed3d9]">
              <Info className="w-4 h-4 text-[#d4a5b0] shrink-0" />
              <span>
                Wytyczne planu (RIR 2, Nagrania techniki, Węglowodany)
              </span>
            </div>
            {showRules ? (
              <ChevronUp className="w-4 h-4 text-[#d4a5b0]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#d4a5b0]" />
            )}
          </button>

          {showRules && (
            <div className="mt-3 space-y-2.5 pt-2 border-t border-zinc-800/80 text-xs">
              {PLAN_RULES.map((rule, idx) => {
                const IconComp = rule.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 flex gap-3 items-start"
                  >
                    <div className="p-2 rounded-xl bg-[#8c3b52]/25 text-[#d4a5b0] shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#e6b8c2]">
                        {rule.title}:{' '}
                      </span>
                      <span className="text-zinc-300 leading-relaxed">
                        {rule.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selektor Tygodnia 1 - 8 (2 miesiące) */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                Wybierz tydzień cyklu (2 miesiące)
              </span>
              {currentWeek >= 2 && (
                <span className="text-[11px] font-medium text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                  Cel: RIR 2 (70-80% max)
                </span>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => setCurrentWeek(w)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                    currentWeek === w
                      ? 'bg-[#8c3b52] text-white shadow-md shadow-[#8c3b52]/30 border border-[#d4a5b0]/50'
                      : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
                  }`}
                >
                  Tydz. {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================
            NAWIGACJA: TRENING 1, 2, 3, BIBLIOTEKA WIDEO, PROGRES
        ==================================================================== */}
        <div className="grid grid-cols-5 gap-1.5 mt-3 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
          {WORKOUTS.map((w) => {
            const stats = getWorkoutCompletion(w);
            const isActive = activeTab === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setActiveTab(w.id)}
                className={`relative py-2.5 px-1.5 rounded-xl text-center transition flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-gradient-to-b from-[#8c3b52] to-[#6e2c40] text-white shadow-lg'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <span className="text-xs font-bold tracking-tight">
                  {w.shortName}
                </span>
                <span
                  className={`text-[10px] mt-0.5 truncate max-w-full ${
                    isActive ? 'text-rose-100' : 'text-zinc-500'
                  }`}
                >
                  {w.id === 'w1'
                    ? 'Nogi & Core'
                    : w.id === 'w2'
                    ? 'Góra Ciała'
                    : 'Full Body'}
                </span>
                {stats.percent > 0 && (
                  <div className="w-full h-1 bg-black/30 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setActiveTab('videos')}
            className={`relative py-2.5 px-1.5 rounded-xl text-center transition flex flex-col items-center justify-center ${
              activeTab === 'videos'
                ? 'bg-gradient-to-b from-[#8c3b52] to-[#6e2c40] text-white shadow-lg'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Film className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-bold">Moje Wideo</span>
            {currentWeekVideosCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                {currentWeekVideosCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2.5 px-1.5 rounded-xl text-center transition flex flex-col items-center justify-center ${
              activeTab === 'progress'
                ? 'bg-gradient-to-b from-[#8c3b52] to-[#6e2c40] text-white shadow-lg'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-bold">Progres</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          WIDOK TRENINGU (TRENING 1, 2 LUB 3)
      ==================================================================== */}
      {(activeTab === 'w1' || activeTab === 'w2' || activeTab === 'w3') && (
        <main className="relative z-10 max-w-xl mx-auto px-4 space-y-5 mt-2">
          {/* Pasek statusu wybranego treningu + Przycisk Raportu dla Pawła */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#f0d5dc]">
                {currentWorkout.name}
              </h2>
              <p className="text-xs text-zinc-400">
                Tydzień {currentWeek} • Ukończono{' '}
                <span className="text-white font-semibold">
                  {getWorkoutCompletion(currentWorkout).percent}%
                </span>{' '}
                dzisiejszego planu
              </p>
            </div>
            <button
              onClick={() => generateReportForPawel(currentWorkout)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-[#d4a5b0]/30 text-xs font-semibold text-[#f0d5dc] transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-[#d4a5b0]" />
              Raport dla Pawła
            </button>
          </div>

          {copiedToast && (
            <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Skopiowano podsumowanie treningu! Możesz je wkleić Pawłowi w
              wiadomości.
            </div>
          )}

          {/* ================================================================
              SEKCJA 1: MOBILIZACJA (ROZGRZEWKA)
          ================================================================ */}
          <section className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl overflow-hidden shadow-lg">
            <div
              onClick={() => setWarmupCollapsed(!warmupCollapsed)}
              className="px-5 py-4 bg-gradient-to-r from-[#8c3b52]/25 to-transparent border-b border-zinc-800/80 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4a5b0]">
                  Etap 1 • Przygotowanie ruchu
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Mobilizacja (Rozgrzewka)
                  <span className="text-xs font-normal text-zinc-400">
                    ({currentWorkout.warmup.length} ćwiczeń)
                  </span>
                </h3>
              </div>
              <button className="p-1.5 rounded-xl bg-zinc-800/70 text-zinc-300">
                {warmupCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            </div>

            {!warmupCollapsed && (
              <div className="divide-y divide-zinc-800/70">
                {currentWorkout.warmup.map((item, idx) => {
                  const hasClip = hasSavedVideoClip(item.id);
                  const recorded = isRecordedForPawel(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-zinc-800/20 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[#d4a5b0]">
                              {idx + 1}.
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              {item.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] font-medium">
                              {item.sets} {item.sets === 1 ? 'seria' : 'serie'}{' '}
                              × {item.reps}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">
                            Uwagi:{' '}
                            <span className="text-zinc-300">{item.notes}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedExerciseModal(item);
                              setModalViewTab('anim');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-[#8c3b52]/25 hover:bg-[#8c3b52]/40 border border-[#d4a5b0]/30 text-[#f0d5dc] text-[11px] font-semibold flex items-center gap-1 transition"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Animacja
                          </button>

                          {/* Przycisk szybkiego dodania/odtworzenia filmiku */}
                          <label
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 border cursor-pointer transition ${
                              hasClip
                                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                            }`}
                            onClick={(e) => {
                              if (hasClip) {
                                e.preventDefault();
                                setSelectedExerciseModal(item);
                                setModalViewTab('my_video');
                              }
                            }}
                          >
                            <Camera className="w-3.5 h-3.5 text-[#d4a5b0]" />
                            <span>{hasClip ? 'Twój film ✓' : '+ Filmik'}</span>
                            {!hasClip && (
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => handleVideoFileUpload(e, item)}
                              />
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Przyciski odhaczania serii rozgrzewkowych + flaga nagrania wideo */}
                      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {Array.from({ length: item.sets }).map((_, sIdx) => {
                            const done = isWarmupSetDone(item.id, sIdx);
                            return (
                              <button
                                key={sIdx}
                                onClick={() => toggleWarmupSet(item.id, sIdx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                                  done
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                                }`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 ${
                                    done ? 'text-emerald-400' : 'opacity-40'
                                  }`}
                                />
                                Seria {sIdx + 1}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => toggleRecordedForPawel(item.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1 border transition ${
                            recorded
                              ? 'bg-rose-500/20 border-rose-400/50 text-rose-200'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          <Video className="w-3 h-3" />
                          {hasClip
                            ? 'Wideo zapisane w apce'
                            : recorded
                            ? 'Nagrane dla Pawła'
                            : 'Oznacz nagrane'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ================================================================
              SEKCJA 2: CZĘŚĆ GŁÓWNA
          ================================================================ */}
          <section className="space-y-4">
            <div className="px-1 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4a5b0]">
                  Etap 2 • Trening właściwy
                </span>
                <h3 className="text-lg font-bold text-white">Część Główna</h3>
              </div>
              <span className="text-xs text-zinc-400">
                Kliknięcie ✓ uruchamia przerwę
              </span>
            </div>

            {currentWorkout.main.map((ex, idx) => {
              const hasClip = hasSavedVideoClip(ex.id);
              const recorded = isRecordedForPawel(ex.id);
              const isSuperset = !!ex.superset;
              const isStopwatchActive = exerciseStopwatch.exId === ex.id;

              return (
                <div
                  key={ex.id}
                  className={`relative bg-zinc-900/95 rounded-3xl p-4 sm:p-5 shadow-lg border transition ${
                    isSuperset
                      ? 'border-l-4 border-l-[#d4a5b0] border-t-zinc-800 border-r-zinc-800 border-b-zinc-800'
                      : 'border-zinc-800/90'
                  }`}
                >
                  {/* Oznaczenie Superserii A1 / A2 */}
                  {isSuperset && (
                    <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8c3b52]/30 border border-[#d4a5b0]/40 text-[#f3d9df] text-[10px] font-bold uppercase tracking-wider">
                      Superseria {ex.supersetRole} •{' '}
                      {ex.rest === 0
                        ? 'Bez przerwy przejdź do A2'
                        : `Przerwa ${ex.rest}s po A2`}
                    </div>
                  )}

                  {/* Nagłówek karty ćwiczenia */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-lg bg-[#8c3b52]/30 border border-[#d4a5b0]/30 text-[#f0d5dc] text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-white">
                          {ex.name}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-lg bg-zinc-800 text-zinc-200 font-semibold">
                          {ex.sets} serie × {ex.reps}
                        </span>
                        <button
                          onClick={() =>
                            ex.rest > 0 &&
                            startRestTimer(ex.rest, `${ex.name} • Przerwa`)
                          }
                          className="px-2.5 py-0.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-[#d4a5b0] font-medium flex items-center gap-1 border border-zinc-700/60"
                        >
                          <Timer className="w-3 h-3" />
                          Przerwa: {ex.rest}s
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5">
                        Uwagi:{' '}
                        <span className="text-zinc-200 font-medium">
                          {ex.notes}
                        </span>
                      </p>
                    </div>

                    {/* Przyciski: Anatomiczna Animacja + Dodaj/Odtwórz własny filmik */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedExerciseModal(ex);
                          setModalViewTab('anim');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#8c3b52] hover:bg-[#9e445e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#8c3b52]/20 transition"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Animacja ruchu
                      </button>

                      <div className="flex items-center gap-1">
                        {hasClip ? (
                          <button
                            onClick={() => {
                              setSelectedExerciseModal(ex);
                              setModalViewTab('my_video');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-[11px] font-semibold flex items-center gap-1 transition"
                          >
                            <Film className="w-3 h-3 text-emerald-400" />
                            Odtwórz mój film
                          </button>
                        ) : (
                          <label className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-[#d4a5b0]/30 text-[#f0d5dc] text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition">
                            <Camera className="w-3 h-3 text-[#d4a5b0]" />
                            <span>+ Dodaj filmik</span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleVideoFileUpload(e, ex)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Wbudowany stoper do ćwiczeń na czas (Copenhagen adduction 20-30s / Plank 40-60s) */}
                  {ex.isTimed && (
                    <div className="mt-3 p-3 rounded-2xl bg-zinc-950/80 border border-[#d4a5b0]/25 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Timer className="w-4 h-4 text-[#d4a5b0]" />
                        <div>
                          <div className="text-xs font-semibold text-zinc-200">
                            Stoper ćwiczenia ({ex.reps})
                          </div>
                          <div className="text-lg font-mono font-bold text-[#f0d5dc]">
                            {isStopwatchActive
                              ? `${exerciseStopwatch.seconds}s`
                              : '0s'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isStopwatchActive) {
                              setExerciseStopwatch((prev) => ({
                                ...prev,
                                running: !prev.running,
                              }));
                            } else {
                              setExerciseStopwatch({
                                exId: ex.id,
                                running: true,
                                seconds: 0,
                                target: ex.targetSeconds || 30,
                              });
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#8c3b52] text-white text-xs font-semibold flex items-center gap-1"
                        >
                          {isStopwatchActive && exerciseStopwatch.running ? (
                            <>
                              <Pause className="w-3.5 h-3.5" /> Pauza
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" /> Start
                            </>
                          )}
                        </button>
                        {isStopwatchActive && (
                          <button
                            onClick={() =>
                              setExerciseStopwatch({
                                exId: ex.id,
                                running: false,
                                seconds: 0,
                                target: ex.targetSeconds || 30,
                              })
                            }
                            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tabela serii (Ciężar, Powtórzenia/Czas, Status) */}
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      <div className="col-span-2">Seria</div>
                      <div className="col-span-4">
                        {ex.defaultUnit === 's'
                          ? 'Czas (sek)'
                          : ex.defaultUnit === 'powt'
                          ? 'Obciążenie'
                          : 'Ciężar (kg)'}
                      </div>
                      <div className="col-span-3">Powt. / Cel</div>
                      <div className="col-span-3 text-right">Status</div>
                    </div>

                    {Array.from({ length: ex.sets }).map((_, sIdx) => {
                      const setData = getSetData(ex.id, sIdx, ex.reps);
                      const prevData = getPrevWeekSetData(ex.id, sIdx);

                      return (
                        <div
                          key={sIdx}
                          className={`grid grid-cols-12 gap-2 items-center p-2 rounded-2xl border transition ${
                            setData.done
                              ? 'bg-emerald-950/25 border-emerald-500/35'
                              : 'bg-zinc-950/60 border-zinc-800/80'
                          }`}
                        >
                          {/* Numer serii + podpowiedź z poprzedniego tygodnia */}
                          <div className="col-span-2 flex flex-col">
                            <span className="text-xs font-bold text-zinc-300">
                              #{sIdx + 1}
                            </span>
                            {prevData && prevData.weight && (
                              <span
                                className="text-[10px] text-[#d4a5b0] truncate"
                                title={`Tydzień ${currentWeek - 1}: ${
                                  prevData.weight
                                }kg × ${prevData.reps}`}
                              >
                                Poprz: {prevData.weight}
                              </span>
                            )}
                          </div>

                          {/* Pole Ciężar (kg) */}
                          <div className="col-span-4">
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                inputMode="decimal"
                                placeholder={
                                  prevData?.weight
                                    ? `${prevData.weight}`
                                    : ex.defaultUnit === 's'
                                    ? `${ex.targetSeconds || 30}`
                                    : '0'
                                }
                                value={setData.weight}
                                onChange={(e) =>
                                  updateSetData(
                                    ex.id,
                                    sIdx,
                                    'weight',
                                    e.target.value,
                                    ex.reps
                                  )
                                }
                                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-[#d4a5b0] rounded-xl px-2.5 py-1.5 text-sm font-bold text-white placeholder-zinc-600 focus:outline-none tabular-nums"
                              />
                              <span className="absolute right-2.5 text-[10px] text-zinc-500 pointer-events-none">
                                {ex.defaultUnit}
                              </span>
                            </div>
                          </div>

                          {/* Pole Powtórzenia */}
                          <div className="col-span-3">
                            <input
                              type="text"
                              placeholder={ex.reps}
                              value={setData.reps}
                              onChange={(e) =>
                                updateSetData(
                                  ex.id,
                                  sIdx,
                                  'reps',
                                  e.target.value,
                                  ex.reps
                                )
                              }
                              className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-[#d4a5b0] rounded-xl px-2.5 py-1.5 text-sm font-semibold text-center text-zinc-200 placeholder-zinc-600 focus:outline-none tabular-nums"
                            />
                          </div>

                          {/* Przycisk Odhaczenia Serii */}
                          <div className="col-span-3 flex justify-end">
                            <button
                              onClick={() => toggleSetDone(ex, sIdx)}
                              className={`w-full py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95 ${
                                setData.done
                                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>{setData.done ? 'Gotowe' : 'Zrób'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ================================================================
              SEKCJA 3: FINISHER (EMOM 5 MIN / 2 OBWODY / AMRAP 6 MIN)
          ================================================================ */}
          <section className="bg-gradient-to-br from-[#8c3b52]/25 via-zinc-900 to-zinc-950 border border-[#d4a5b0]/40 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-[10px] font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Etap 3 • Hyrox Conditioning
              </span>
              {getFinisherData(currentWorkout.id).done && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Ukończono
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white">
              {currentWorkout.finisher.title}
            </h3>

            {currentWorkout.finisher.description && (
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {currentWorkout.finisher.description}
              </p>
            )}

            {/* WARIANT 1: TRENING 1 -> EMOM 5 MINUT (4 kcal SkiErg) */}
            {currentWorkout.finisher.type === 'emom' && (
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                      Runda {emomState.round} z 5 • Pozostało w minucie:
                    </div>
                    <div className="text-4xl font-mono font-extrabold text-[#f0d5dc] mt-1">
                      00:
                      {emomState.secondsLeftInRound < 10
                        ? `0${emomState.secondsLeftInRound}`
                        : emomState.secondsLeftInRound}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setEmomState((prev) => ({
                          ...prev,
                          running: !prev.running,
                          finished: false,
                        }))
                      }
                      className="px-4 py-2.5 rounded-2xl bg-[#8c3b52] hover:bg-[#a1455f] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                    >
                      {emomState.running ? (
                        <>
                          <Pause className="w-4 h-4" /> Pauza EMOM
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> Start EMOM
                          5:00
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        setEmomState({
                          running: false,
                          round: 1,
                          secondsLeftInRound: 60,
                          finished: false,
                        })
                      }
                      className="p-2.5 rounded-2xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      title="Resetuj EMOM"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Odhaczanie 5 rund SkiErg */}
                <div>
                  <div className="text-xs font-semibold text-zinc-400 mb-2">
                    Odhaczaj wykonane rundy (4 kcal na SkiErg):
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((rIdx) => {
                      const fin = getFinisherData('w1');
                      const rDone = fin.emomRounds?.[rIdx];
                      return (
                        <button
                          key={rIdx}
                          onClick={() => {
                            const currentRounds = [
                              ...(fin.emomRounds || [
                                false,
                                false,
                                false,
                                false,
                                false,
                              ]),
                            ];
                            currentRounds[rIdx] = !currentRounds[rIdx];
                            const allDone = currentRounds.every(Boolean);
                            updateFinisherData('w1', {
                              emomRounds: currentRounds,
                              done: allDone,
                            });
                          }}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                            rDone
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          <span>Min {rIdx + 1}</span>
                          <Check
                            className={`w-3.5 h-3.5 ${
                              rDone ? 'text-emerald-400' : 'opacity-30'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* WARIANT 2: TRENING 2 -> 2 OBWODY (120s PRZERWY) */}
            {currentWorkout.finisher.type === 'circuits' && (
              <div className="mt-4 space-y-4">
                {[1, 2].map((circuitNum) => {
                  const fin = getFinisherData('w2');
                  return (
                    <div
                      key={circuitNum}
                      className="p-4 rounded-2xl bg-zinc-950/75 border border-zinc-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#d4a5b0]">
                          Obwód {circuitNum} z 2
                        </span>
                        {circuitNum === 1 && (
                          <button
                            onClick={() =>
                              startRestTimer(
                                120,
                                'Przerwa między Obwodem 1 a Obwodem 2'
                              )
                            }
                            className="px-2.5 py-1 rounded-xl bg-[#8c3b52]/30 border border-[#d4a5b0]/40 text-[#f0d5dc] text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Timer className="w-3 h-3" />
                            Uruchom 120s przerwy
                          </button>
                        )}
                      </div>

                      {currentWorkout.finisher.items.map(
                        (itemText, itemIdx) => {
                          const key = `c${circuitNum}_i${itemIdx}`;
                          const checked = !!fin.circuitChecks?.[key];
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                const nextChecks = {
                                  ...(fin.circuitChecks || {}),
                                  [key]: !checked,
                                };
                                const totalChecked =
                                  Object.values(nextChecks).filter(
                                    Boolean
                                  ).length;
                                updateFinisherData('w2', {
                                  circuitChecks: nextChecks,
                                  done: totalChecked >= 8,
                                });
                              }}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition ${
                                checked
                                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 line-through opacity-80'
                                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
                              }`}
                            >
                              <span>• {itemText}</span>
                              <div
                                className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                                  checked
                                    ? 'bg-emerald-500 text-zinc-950'
                                    : 'bg-zinc-800 text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* WARIANT 3: TRENING 3 -> AMRAP 6 MINUT */}
            {currentWorkout.finisher.type === 'amrap' && (
              <div className="mt-4 space-y-4">
                <ul className="space-y-1.5 text-xs text-zinc-200 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800/80">
                  {currentWorkout.finisher.items.map((it, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a5b0]" />
                      {it}
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                      Zegar AMRAP (6:00)
                    </div>
                    <div className="text-4xl font-mono font-extrabold text-[#f0d5dc] mt-0.5">
                      {formatTime(amrapState.secondsLeft)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setAmrapState((prev) => ({
                          ...prev,
                          running: !prev.running,
                        }))
                      }
                      className="px-4 py-2.5 rounded-2xl bg-[#8c3b52] hover:bg-[#a1455f] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                    >
                      {amrapState.running ? (
                        <>
                          <Pause className="w-4 h-4" /> Pauza
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" /> Start 6:00
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        setAmrapState({ running: false, secondsLeft: 360 })
                      }
                      className="p-2.5 rounded-2xl bg-zinc-800 text-zinc-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Licznik obwodów AMRAP */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">
                      Ukończone obwody w Tygodniu {currentWeek}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Kliknij +1 po każdym pełnym obwodzie
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const cur = getFinisherData('w3').amrapRounds || 0;
                        updateFinisherData('w3', {
                          amrapRounds: Math.max(0, cur - 1),
                        });
                      }}
                      className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-extrabold text-[#f0d5dc] tabular-nums w-8 text-center">
                      {getFinisherData('w3').amrapRounds || 0}
                    </span>
                    <button
                      onClick={() => {
                        const cur = getFinisherData('w3').amrapRounds || 0;
                        updateFinisherData('w3', {
                          amrapRounds: cur + 1,
                          done: true,
                        });
                      }}
                      className="px-3.5 h-9 rounded-xl bg-[#8c3b52] hover:bg-[#a1455f] text-white font-bold text-xs flex items-center gap-1 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> 1 Obwód
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Przycisk oznaczenia całego finishera jako wykonany */}
            <button
              onClick={() =>
                updateFinisherData(currentWorkout.id, {
                  done: !getFinisherData(currentWorkout.id).done,
                })
              }
              className={`mt-4 w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                getFinisherData(currentWorkout.id).done
                  ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {getFinisherData(currentWorkout.id).done
                ? 'Finisher zaliczony! Świetna robota Asia!'
                : 'Oznacz Finisher jako ukończony'}
            </button>
          </section>
        </main>
      )}

      {/* ====================================================================
          ZAKŁADKA: MOJE WIDEO (BIBLIOTEKA NAGRAŃ DO OCENY DLA PAWŁA)
      ==================================================================== */}
      {activeTab === 'videos' && (
        <main className="relative z-10 max-w-xl mx-auto px-4 space-y-4 mt-2">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4a5b0]">
                  Tydzień {currentWeek} • Kontrola Techniki
                </span>
                <h2 className="text-lg font-bold text-white">
                  Biblioteka Twoich Filmików z Ćwiczeń
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Wgrywaj serie rozgrzewkowe lub robocze bezpośrednio z
                  telefonu, porównuj je z anatomiczną animacją i wysyłaj Pawłowi
                  do oceny.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-2xl bg-[#8c3b52]/30 border border-[#d4a5b0]/30 text-center shrink-0">
                <div className="text-lg font-extrabold text-[#f0d5dc]">
                  {currentWeekVideosCount}
                </div>
                <div className="text-[10px] text-zinc-300">Nagrań</div>
              </div>
            </div>
          </div>

          {WORKOUTS.map((w) => (
            <div
              key={w.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 space-y-3"
            >
              <h3 className="text-sm font-bold text-[#f0d5dc] border-b border-zinc-800 pb-2">
                {w.name}
              </h3>
              <div className="space-y-2">
                {[...w.warmup, ...w.main].map((ex) => {
                  const hasClip = hasSavedVideoClip(ex.id);
                  const note = logs?.[weekKey]?.videoNotes?.[ex.id] || '';
                  const hasCustomUrl = !!logs?.customTutorialUrls?.[ex.id];
                  return (
                    <div
                      key={ex.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                        hasClip
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-zinc-950/60 border-zinc-800/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {ex.name}
                          </span>
                          {hasClip && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              Wideo wgrane ✓
                            </span>
                          )}
                          {hasCustomUrl && (
                            <span className="px-2 py-0.5 rounded-full bg-[#8c3b52]/30 text-[#f0d5dc] text-[10px]">
                              Link wideo
                            </span>
                          )}
                        </div>
                        {note && (
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                            Notatka: "{note}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasClip ? (
                          <button
                            onClick={() => {
                              setSelectedExerciseModal(ex);
                              setModalViewTab('my_video');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Odtwórz
                          </button>
                        ) : (
                          <label className="px-3 py-1.5 rounded-xl bg-[#8c3b52] hover:bg-[#a1455f] text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Dodaj film</span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleVideoFileUpload(e, ex)}
                            />
                          </label>
                        )}
                        <button
                          onClick={() => {
                            setSelectedExerciseModal(ex);
                            setModalViewTab('anim');
                          }}
                          className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                          title="Porównaj z animacją"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      )}

      {/* ====================================================================
          ZAKŁADKA: PROGRES CIĘŻARÓW & HISTORIA (TYGODNIE 1-8)
      ==================================================================== */}
      {activeTab === 'progress' && (
        <main className="relative z-10 max-w-xl mx-auto px-4 space-y-5 mt-2">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4a5b0]">
                  Analityka Siły • 8 Tygodni
                </span>
                <h2 className="text-lg font-bold text-white">
                  Progres Ciężarów Asi
                </h2>
              </div>
              <Trophy className="w-6 h-6 text-[#d4a5b0]" />
            </div>

            {/* Wybór ćwiczenia do podglądu progresu */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1.5">
                Wybierz ćwiczenie z planu:
              </label>
              <select
                value={progressExerciseId}
                onChange={(e) => setProgressExerciseId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-[#d4a5b0]"
              >
                {allMainExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    [{ex.workoutName}] {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wykres słupkowy progresu w tygodniach 1 - 8 */}
            {(() => {
              const selectedEx =
                allMainExercises.find((e) => e.id === progressExerciseId) ||
                allMainExercises[0];

              const weekPoints = [1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
                const wSets = logs?.[`week_${w}`]?.sets || {};
                let maxWeight = 0;
                let bestReps = '';
                for (let s = 0; s < selectedEx.sets; s++) {
                  const entry = wSets[`${selectedEx.id}_s${s}`];
                  const val = parseFloat(entry?.weight || 0);
                  if (val >= maxWeight && val > 0) {
                    maxWeight = val;
                    bestReps = entry?.reps || selectedEx.reps;
                  }
                }
                return { week: w, maxWeight, bestReps };
              });

              const highestOverall = Math.max(
                ...weekPoints.map((p) => p.maxWeight),
                10
              );

              return (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                    <span>
                      Najlepszy ciężar roboczy ({selectedEx.defaultUnit})
                    </span>
                    <span className="text-[#f0d5dc] font-semibold">
                      Rekord:{' '}
                      {Math.max(...weekPoints.map((p) => p.maxWeight), 0)}{' '}
                      {selectedEx.defaultUnit}
                    </span>
                  </div>

                  <div className="grid grid-cols-8 gap-2 items-end h-44 pt-6 px-2 bg-zinc-950/70 rounded-2xl border border-zinc-800/80">
                    {weekPoints.map((pt) => {
                      const heightPct =
                        pt.maxWeight > 0
                          ? Math.max(
                              15,
                              Math.round((pt.maxWeight / highestOverall) * 100)
                            )
                          : 6;
                      return (
                        <div
                          key={pt.week}
                          className="flex flex-col items-center h-full justify-end"
                        >
                          <span className="text-[10px] font-bold text-[#f0d5dc] mb-1 tabular-nums">
                            {pt.maxWeight > 0 ? `${pt.maxWeight}` : '—'}
                          </span>
                          <div
                            className={`w-full rounded-t-xl transition-all duration-500 ${
                              pt.maxWeight > 0
                                ? 'bg-gradient-to-t from-[#8c3b52] to-[#d4a5b0]'
                                : 'bg-zinc-800/60'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className="text-[10px] text-zinc-400 mt-1.5 pb-1 font-medium">
                            T{pt.week}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Podsumowanie wyników AMRAP 6 min z Treningu 3 */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Historia wyników Finisher AMRAP 6 min (Trening 3)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
                const rounds =
                  logs?.[`week_${w}`]?.finisher?.w3?.amrapRounds || 0;
                return (
                  <div
                    key={w}
                    className="p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-center"
                  >
                    <div className="text-[10px] text-zinc-500">Tydz. {w}</div>
                    <div className="text-sm font-extrabold text-[#f0d5dc] mt-0.5">
                      {rounds > 0 ? `${rounds} obw.` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* ====================================================================
          MODAL: ANATOMICZNA ANIMACJA + TWOJE WIDEO Z TELEFONU + LINK WIDEO
      ==================================================================== */}
      {selectedExerciseModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedExerciseModal(null)}
        >
          <div
            className="w-full max-w-lg bg-zinc-900 border-t sm:border border-[#d4a5b0]/30 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4a5b0]">
                  Przewodnik Techniczny & Wideo • Tydzień {currentWeek}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedExerciseModal.name}
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedExerciseModal.sets} serie ×{' '}
                  {selectedExerciseModal.reps} • Uwagi:{' '}
                  {selectedExerciseModal.notes}
                </p>
              </div>
              <button
                onClick={() => setSelectedExerciseModal(null)}
                className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Przełącznik zakładek w modalu: 1) Animacja Anatomiczna, 2) Twój Filmik z telefonu, 3) Wideo instruktażowe (Link) */}
            <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
              <button
                onClick={() => setModalViewTab('anim')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  modalViewTab === 'anim'
                    ? 'bg-[#8c3b52] text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Animacja
              </button>

              <button
                onClick={() => setModalViewTab('my_video')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  modalViewTab === 'my_video'
                    ? 'bg-[#8c3b52] text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Twój filmik
                {activeVideoObjectUrl && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setModalViewTab('tutorial_url')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  modalViewTab === 'tutorial_url'
                    ? 'bg-[#8c3b52] text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                Wideo / Link
              </button>
            </div>

            {/* WIDOK 1: ANATOMICZNA ANIMACJA RUCHU + WSKAZÓWKI */}
            {modalViewTab === 'anim' && (
              <>
                <HumanExerciseAnimator exercise={selectedExerciseModal} />

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6b8c2]">
                    Jak wykonać prawidłowo (Krok po kroku):
                  </h4>
                  <div className="space-y-2">
                    {(selectedExerciseModal.cues || []).map((cue, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex gap-2.5 items-start text-xs text-zinc-200 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#8c3b52]/40 text-[#f0d5dc] font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {i + 1}
                        </span>
                        <span>{cue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* WIDOK 2: TWÓJ WŁASNY FILMIK Z ĆWICZENIA (Z TELEFONU / KAMERY) */}
            {modalViewTab === 'my_video' && (
              <div className="space-y-4">
                {activeVideoObjectUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-3xl overflow-hidden bg-black border border-zinc-800 shadow-xl">
                      <video
                        ref={videoPlayerRef}
                        src={activeVideoObjectUrl}
                        controls
                        playsInline
                        className="w-full max-h-80 object-contain bg-black"
                      />
                    </div>

                    {/* Kontrolki prędkości odtwarzania Twojego nagrania + podmiana/usunięcie */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-400 mr-1">
                          Tempo analizy:
                        </span>
                        {[0.5, 1].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => {
                              setVideoPlaybackRate(rate);
                              if (videoPlayerRef.current) {
                                videoPlayerRef.current.playbackRate = rate;
                              }
                            }}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                              videoPlaybackRate === rate
                                ? 'bg-[#8c3b52] text-white'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Zmień wideo</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) =>
                              handleVideoFileUpload(e, selectedExerciseModal)
                            }
                          />
                        </label>
                        <button
                          onClick={() =>
                            handleDeleteVideo(selectedExerciseModal.id)
                          }
                          className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                          title="Usuń filmik"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notatka do filmiku dla Pawła */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#d4a5b0]" />
                        Notatka / pytanie do Pawła przy tym nagraniu:
                      </label>
                      <input
                        type="text"
                        placeholder="np. Seria 2, 16 kg - czy plecy są wystarczająco proste?"
                        value={videoNoteInput}
                        onChange={(e) =>
                          saveVideoNoteForPawel(
                            selectedExerciseModal.id,
                            e.target.value
                          )
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#d4a5b0] rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                      />
                    </div>

                    {/* Przycisk bezpośredniego wysłania filmiku Pawłowi */}
                    <button
                      onClick={() => shareVideoWithPawel(selectedExerciseModal)}
                      className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                    >
                      <Send className="w-4 h-4" />
                      Wyślij / Udostępnij to wideo Pawłowi
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-zinc-950/80 border-2 border-dashed border-[#d4a5b0]/35 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#8c3b52]/25 border border-[#d4a5b0]/30 flex items-center justify-center mx-auto text-[#f0d5dc]">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Dodaj swój filmik z ćwiczenia (
                        {selectedExerciseModal.name})
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Możesz nagrać serię bezpośrednio aparatem telefonu lub
                        wybrać gotowe wideo z galerii. Filmik zapisze się w
                        aplikacji dla Tygodnia {currentWeek}.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
                      <label className="px-4 py-3 rounded-2xl bg-[#8c3b52] hover:bg-[#a1455f] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition">
                        <Upload className="w-4 h-4" />
                        <span>Wybierz film z galerii / plików</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) =>
                            handleVideoFileUpload(e, selectedExerciseModal)
                          }
                        />
                      </label>

                      <label className="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition">
                        <Camera className="w-4 h-4 text-[#d4a5b0]" />
                        <span>Nagraj kamerą na żywo</span>
                        <input
                          type="file"
                          accept="video/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) =>
                            handleVideoFileUpload(e, selectedExerciseModal)
                          }
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WIDOK 3: PODPIĘTY LINK DO WIDEO INSTRUKTAŻOWEGO (NP. YOUTUBE / MP4) */}
            {modalViewTab === 'tutorial_url' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2.5">
                  <label className="text-xs font-bold text-zinc-200 block">
                    Wklej link do ulubionego filmiku instruktażowego (YouTube,
                    Shorts lub bezpośredni link MP4):
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={customUrlInput}
                    onChange={(e) =>
                      saveCustomTutorialUrl(
                        selectedExerciseModal.id,
                        e.target.value
                      )
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#d4a5b0] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-400">
                    Zapisany link zostanie zapamiętany na stałe przy ćwiczeniu{' '}
                    <span className="text-zinc-200 font-semibold">
                      {selectedExerciseModal.name}
                    </span>
                    .
                  </p>
                </div>

                {customUrlInput && getEmbedVideoUrl(customUrlInput) ? (
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 aspect-video bg-black">
                    <iframe
                      src={getEmbedVideoUrl(customUrlInput)}
                      title={selectedExerciseModal.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : customUrlInput ? (
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black p-3 text-center">
                    <video
                      src={customUrlInput}
                      controls
                      playsInline
                      className="w-full max-h-72 mx-auto"
                    />
                  </div>
                ) : null}
              </div>
            )}

            {/* Dolne przyciski akcji w modalu */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-zinc-800/80">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  selectedExerciseModal.name + ' proper form tutorial'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <ExternalLink className="w-4 h-4 text-[#d4a5b0]" />
                Szukaj tego ćwiczenia na YouTube
              </a>
              <button
                onClick={() => toggleRecordedForPawel(selectedExerciseModal.id)}
                className={`py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                  isRecordedForPawel(selectedExerciseModal.id)
                    ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                }`}
              >
                <Video className="w-4 h-4" />
                {isRecordedForPawel(selectedExerciseModal.id)
                  ? 'Nagrane dla Pawła ✓'
                  : 'Oznacz jako nagrane'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PŁYWAJĄCY PASEK TIMERA PRZERWY NA DOLE EKRANU
      ==================================================================== */}
      {restTimer.active && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 bg-zinc-900/95 backdrop-blur-md border-2 border-[#d4a5b0] rounded-3xl p-3.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#8c3b52] flex items-center justify-center text-white font-mono font-extrabold text-base tabular-nums shadow-inner">
              {restTimer.remaining}s
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#d4a5b0]">
                Czas przerwy
              </div>
              <div className="text-xs font-semibold text-white truncate max-w-[170px]">
                {restTimer.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setRestTimer((prev) => ({
                  ...prev,
                  remaining: Math.max(0, prev.remaining - 15),
                }))
              }
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
            >
              -15s
            </button>
            <button
              onClick={() =>
                setRestTimer((prev) => ({
                  ...prev,
                  remaining: prev.remaining + 15,
                }))
              }
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
            >
              +15s
            </button>
            <button
              onClick={() =>
                setRestTimer({
                  active: false,
                  remaining: 0,
                  total: 0,
                  label: '',
                })
              }
              className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
              title="Pomiń przerwę"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
