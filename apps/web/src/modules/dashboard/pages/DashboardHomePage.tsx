import { useEffect, useState } from 'react';
import { useAuth } from '@core/auth';
/**
 * Dummy/generic placeholder content, worded around the platform's generic
 * "request" concept (matching the approved Firestore design) rather than
 * any specific service. Replaced by real, role-aware, Firestore-backed
 * dashboards starting in roadmap Phase 6 — no Parcel Pickup logic here yet.
 */
const DUMMY_STATS = [
  { label: 'Active Requests', value: 2 },
  { label: 'Completed This Month', value: 12 },
  { label: 'Pending Actions', value: 1 },
] as const;

const DUMMY_ACTIVITY = [
  { id: '1', text: 'Request #A182 marked ready for pickup', timeAgo: '2h ago' },
  { id: '2', text: 'Request #A175 completed', timeAgo: '2d ago' },
  { id: '3', text: 'Request #A170 logged', timeAgo: '4d ago' },
] as const;

export function DashboardHomePage() {
  const { user } = useAuth();
  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0];
  const [currentTime, setCurrentTime] = useState(new Date());
useEffect
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [weather, setWeather] = useState<{
  temperature: number;
  windspeed: number;
  weathercode: number;
} | null>(null);
  

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);
useEffect(() => {
  let timer: ReturnType<typeof setInterval> | undefined;

  if (isRunning) {
    timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  return () => {
    if (timer) {
      clearInterval(timer);
    }
  };
}, [isRunning]);
useEffect(() => {
  async function fetchWeather() {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current_weather=true"
      );

      const data = await response.json();
      console.log(data);

      setWeather(data.current_weather);
    } catch (error) {
      console.error("Weather fetch failed:", error);
    }
  }

  fetchWeather();
}, []);
const today = new Date();

const currentMonth = today.toLocaleString([], {
  month: "long",
});

const currentYear = today.getFullYear();

const firstDay = new Date(currentYear, today.getMonth(), 1).getDay();
const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();

const calendarDays = [];
function getWeatherDescription(code: number) {
  if (code === 0) return "☀️ Clear Sky";
  if (code >= 1 && code <= 3) return "⛅ Partly Cloudy";
  if (code === 45 || code === 48) return "🌫️ Fog";
  if (code >= 51 && code <= 67) return "🌦️ Drizzle";
  if (code >= 71 && code <= 77) return "❄️ Snow";
  if (code >= 80 && code <= 82) return "🌧️ Rain";
  if (code === 95) return "⛈️ Thunderstorm";

  return "🌤️ Unknown";
}

for (let i = 0; i < firstDay; i++) {
  calendarDays.push(null);
}

for (let i = 1; i <= daysInMonth; i++) {
  calendarDays.push(i);
}


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Good to see you, {firstName}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Here&apos;s a quick look at your account. (Placeholder data — live data arrives in a
          later phase.)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DUMMY_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-surface-border bg-surface-raised p-4"
          >
            <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-surface-border bg-surface-raised p-4">
        <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {DUMMY_ACTIVITY.map((activity) => (
            <li key={activity.id} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{activity.text}</span>
              <span className="text-xs text-text-muted">{activity.timeAgo}</span>
            </li>
          ))}
        </ul>
      </div>
            {/* Productivity Widgets */}
      <div className="rounded-card border border-surface-border bg-surface-raised p-5">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Productivity Widgets
        </h2>

        <div className="rounded-card border border-surface-border p-4 md:col-span-2">

          {/* Clock */}
          <div className="rounded-card border border-surface-border p-4">
            <h3 className="font-medium mb-3">🕒 Live Clock</h3>

            <div className="h-48 flex flex-col items-center justify-center">
              <p className="text-5xl font-bold tracking-wide text-text-primary">
                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>

              <p className="mt-4 text-lg font-medium text-text-secondary">
                {currentTime.toLocaleDateString([], {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          {/* Calendar */}
          <div className="rounded-card border border-surface-border p-4">
            <h3 className="font-medium mb-3">📅 Calendar</h3>

            <div className="py-2">
  <div className="mb-3 text-center">
    <h4 className="text-lg font-semibold">
      {currentMonth} {currentYear}
    </h4>
  </div>

  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-secondary mb-2">
    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
      <div key={day}>{day}</div>
    ))}
  </div>

  <div className="grid grid-cols-7 gap-1 text-center">
    {calendarDays.map((day, index) => (
      <div
        key={index}
        className={`h-8 flex items-center justify-center rounded-md text-sm
          ${
            day === today.getDate()
              ? "bg-blue-600 text-white font-bold"
              : "text-text-primary"
          }`}
      >
        {day}
      </div>
    ))}
  </div>
</div>
          </div>

          {/* Weather */}
          <div className="rounded-card border border-surface-border p-4">
            <h3 className="font-medium mb-3">🌤 Weather</h3>

            <div className="h-48 flex flex-col items-center justify-center">
              {weather ? (
                <>
                  <div className="text-5xl font-bold text-text-primary">
                    {weather.temperature}°C
                  </div>

                  <div className="mt-3 text-lg text-text-secondary">
                    Wind: {weather.windspeed} km/h
                  </div>

                  <div className="mt-2 text-lg font-medium text-text-secondary">
                    {getWeatherDescription(weather.weathercode)}
                  </div>
                </>
              ) : (
                <p className="text-text-secondary">Loading weather...</p>
              )}
            </div>
          </div>

          {/* Stopwatch */}
          <div className="rounded-card border border-surface-border p-4">
            <h3 className="font-medium mb-3">⏱ Stopwatch</h3>

            <div className="h-48 flex flex-col items-center justify-center">
  <div className="text-4xl font-bold text-text-primary mb-6">
    {new Date(seconds * 1000).toISOString().slice(11, 19)}
  </div>

  <div className="flex gap-3">
    <button
      onClick={() => setIsRunning(true)}
      className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
    >
      Start
    </button>

    <button
      onClick={() => setIsRunning(false)}
      className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
    >
      Pause
    </button>

    <button
      onClick={() => {
        setIsRunning(false);
        setSeconds(0);
      }}
      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Reset
    </button>
  </div>
</div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
