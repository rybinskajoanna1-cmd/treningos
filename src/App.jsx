// --- KOMPONENT INTEGRACJI ZE STRAVA API (Z AUTOMATYCZNYM ODŚWIEŻANIEM TOKENU) ---
function StravaGarminSection({ selectedWeek, selectedWorkout, logs, setLogs }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [clientId, setClientId] = useState(() => localStorage.getItem('strava_client_id') || '');
  const [clientSecret, setClientSecret] = useState(() => localStorage.getItem('strava_client_secret') || '');
  const [authCodeOrRefresh, setAuthCodeOrRefresh] = useState(() => localStorage.getItem('strava_refresh_token') || '');

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

  // Funkcja wymieniająca kod lub Refresh Token na świeży Access Token i zapisująca go na stałe
  const getValidAccessToken = async () => {
    const cid = clientId.trim();
    const secret = clientSecret.trim();
    const tokenOrCode = authCodeOrRefresh.trim();

    if (!cid || !secret || !tokenOrCode) {
      throw new Error('Uzupełnij Client ID, Client Secret oraz Kod/Refresh Token w ustawieniach (ikonka suwaków).');
    }

    const savedRefresh = localStorage.getItem('strava_saved_refresh_token');
    const isUsingRefreshToken = savedRefresh && savedRefresh === tokenOrCode;

    const bodyParams = new URLSearchParams({
      client_id: cid,
      client_secret: secret,
      grant_type: isUsingRefreshToken ? 'refresh_token' : 'authorization_code',
      ...(isUsingRefreshToken ? { refresh_token: tokenOrCode } : { code: tokenOrCode })
    });

    let res = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams
    });

    // Jeśli wpisano bezpośrednio Refresh Token z panelu Stravy za pierwszym razem
    if (!res.ok && !isUsingRefreshToken) {
      const retryParams = new URLSearchParams({
        client_id: cid,
        client_secret: secret,
        grant_type: 'refresh_token',
        refresh_token: tokenOrCode
      });
      res = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: retryParams
      });
    }

    if (!res.ok) {
      throw new Error('Nie udało się połączyć ze Stravą. Sprawdź czy kod z paska adresu (code=...) nie wygasł.');
    }

    const data = await res.json();
    if (data.refresh_token) {
      localStorage.setItem('strava_refresh_token', data.refresh_token);
      localStorage.setItem('strava_saved_refresh_token', data.refresh_token);
      setAuthCodeOrRefresh(data.refresh_token);
    }
    localStorage.setItem('strava_client_id', cid);
    localStorage.setItem('strava_client_secret', secret);

    return data.access_token;
  };

  const fetchLatestStravaActivity = async () => {
    if (!clientId.trim() || !clientSecret.trim() || !authCodeOrRefresh.trim()) {
      setIsConfigOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const accessToken = await getValidAccessToken();

      const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=1', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!res.ok) {
        throw new Error('Brak uprawnień do odczytu treningów (upewnij się, że użyłaś linku z activity:read_all).');
      }

      const activities = await res.json();
      if (!activities || activities.length === 0) {
        alert('Nie znaleziono żadnych treningów na Twojej Stravie.');
        setIsLoading(false);
        return;
      }

      // Pobierz szczegóły konkretnej aktywności (żeby wyciągnąć dokładne kalorie z Garmina)
      const latestId = activities[0].id;
      const detailRes = await fetch(`https://www.strava.com/api/v3/activities/${latestId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const act = detailRes.ok ? await detailRes.json() : activities[0];

      const durationMin = Math.round((act.elapsed_time || act.moving_time || 0) / 60);
      const calories = act.calories
        ? Math.round(act.calories)
        : act.kilojoules
        ? Math.round(act.kilojoules * 0.239)
        : '';
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
      setIsConfigOpen(false);
    } catch (err) {
      alert(err.message || 'Błąd pobierania ze Stravy.');
      setIsConfigOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F9E5E0] rounded-[30px] p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-[#141414] text-white flex items-center justify-center">
            <Watch className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#141414]">
              Zegarek (Garmin • Strava)
            </h3>
            <p className="text-[11px] font-semibold text-[#7A625D]">
              {currentGarminData.syncedAt
                ? `Pobrano o ${currentGarminData.syncedAt} (${currentGarminData.activityName})`
                : 'Pobierz ze Stravy lub wpisz z tarczy'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            title="Konfiguracja Stravy"
            className="w-8 h-8 rounded-full bg-white text-[#141414] flex items-center justify-center shadow-sm"
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

      {isConfigOpen && (
        <div className="p-4 rounded-[22px] bg-[#FFF6F3] space-y-2.5 text-xs text-[#141414] border border-[#F3D5CE]">
          <p className="font-extrabold">Jednorazowe połączenie ze Stravą:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="1. Client ID (np. 123456)"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="px-3.5 py-2 rounded-full bg-white text-xs font-mono outline-none border border-[#F3D5CE]"
            />
            <input
              type="password"
              placeholder="2. Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="px-3.5 py-2 rounded-full bg-white text-xs font-mono outline-none border border-[#F3D5CE]"
            />
          </div>
          {clientId.trim() && (
            <a
              href={`https://www.strava.com/oauth/authorize?client_id=${clientId.trim()}&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all`}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[11px] font-bold text-[#E0533C] underline"
            >
              👉 Kliknij tutaj, autoryzuj Stravę i skopiuj kod z paska adresu (po code=...)
            </a>
          )}
          <input
            type="text"
            placeholder="3. Wklej kod z paska adresu (code=...) lub Refresh Token"
            value={authCodeOrRefresh}
            onChange={(e) => setAuthCodeOrRefresh(e.target.value)}
            className="w-full px-3.5 py-2 rounded-full bg-white text-xs font-mono outline-none border border-[#F3D5CE]"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="px-3 py-1.5 rounded-full bg-[#F9E5E0] font-bold text-xs"
            >
              Zamknij
            </button>
            <button
              onClick={fetchLatestStravaActivity}
              className="px-4 py-1.5 rounded-full bg-[#141414] text-white font-bold text-xs"
            >
              Połącz i pobierz trening
            </button>
          </div>
        </div>
      )}

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
              className="w-full text-lg font-extrabold text-[#141414] bg-transparent outline-none"
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
              className="w-full text-lg font-extrabold text-[#141414] bg-transparent outline-none"
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
              className="w-full text-lg font-extrabold text-[#141414] bg-transparent outline-none"
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
              className="w-full text-lg font-extrabold text-[#141414] bg-transparent outline-none"
            />
            <span className="text-xs font-bold text-[#7A625D]">bpm</span>
          </div>
        </div>
      </div>
    </div>
  );
}