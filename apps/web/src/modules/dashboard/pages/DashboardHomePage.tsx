import { useEffect, useState } from 'react';
import { useAuth } from '@core/auth';
import type { ParcelAssistanceRequest } from '../../parcelAssistance/types';
import { useNavigate } from "react-router-dom";
import {
  subscribeToMyRequests,
  subscribeToHelpingRequests,
} from '../../parcelAssistance/services/parcelAssistanceService';
/**
 * Dummy/generic placeholder content, worded around the platform's generic
 * "request" concept (matching the approved Firestore design) rather than
 * any specific service. Replaced by real, role-aware, Firestore-backed
 * dashboards starting in roadmap Phase 6 — no Parcel Pickup logic here yet.
 */




export function DashboardHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [weather, setWeather] = useState<{
  temperature: number;
  windspeed: number;
  weathercode: number;
} | null>(null);
const [myParcels, setMyParcels] = useState<ParcelAssistanceRequest[]>([]);
const [helpingParcels, setHelpingParcels] = useState<ParcelAssistanceRequest[]>([]);

  

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
useEffect(() => {
  if (!user) return;

  const unsubscribeMy = subscribeToMyRequests(
    user.uid,
    (requests) => setMyParcels(requests)
  );

  const unsubscribeHelping = subscribeToHelpingRequests(
    user.uid,
    (requests) => {
      console.log("Helping requests:", requests);
      setHelpingParcels(requests);
    },
    (error) => {
      console.error("Helping subscription error:", error);
    }
  );

  return () => {
    unsubscribeMy();
    unsubscribeHelping();
  };
}, [user]);
const dashboardStats = [
  {
    label: "My Active Requests",
    value: myParcels.filter(
      (parcel) => parcel.status !== "completed"
    ).length,
  },
  {
    label: "Completed Requests",
    value: myParcels.filter(
      (parcel) => parcel.status === "completed"
    ).length,
  },
  {
    label: "Helping Others",
    value: helpingParcels.length,
  },
];
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
  <div
    className="min-h-screen bg-cover bg-center bg-fixed"
    style={{
      backgroundImage: "url('/images/dashboard-bg.jpg')",
    }}
  >
    <div className="min-h-screen bg-black/40 p-6">
      <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold "text-white>Good to see you, {firstName}</h1>
        <p className="mt-1 text-sm text-white/80">
          Here&apos;s a quick look at your account. (Here's a live overview of your parcel requests and activity.)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {dashboardStats.map((stat) => (
<div
  key={stat.label}
  className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6"
>
  <p className="text-sm text-white/70">
    {stat.label}
  </p>

  <p className="mt-2 text-5xl font-bold text-white">
    {stat.value}
  </p>
</div>
        ))}
      </div>

      <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl p-4">
        <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {myParcels.length === 0 ? (
  <li className="text-sm text-white/80">
    No recent parcel activity.
  </li>
) : (
  myParcels.slice(0, 5).map((parcel) => (
    <li
      key={parcel.id}
      className="flex items-center justify-between text-sm"
    >
      <span className="text-white/80">
        {parcel.metadata.title}
      </span>

      <span className="text-xs text-orange-300">
        {parcel.status.toUpperCase()}
      </span>
    </li>
  ))
)}
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* My Parcels */}
  <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl p-4">
    <h2 className="text-lg font-semibold mb-3">
      📦 My Parcels
    </h2>

    {myParcels.length === 0 ? (
      <p className="text-white/80 text-sm">
        You haven't created any parcel requests.
      </p>
    ) : (
      <div className="space-y-3">
        {myParcels.map((parcel) => (
          <div
            key={parcel.id}
            className="rounded-lg border border-surface-border p-3"
          >
      <p className="font-semibold">
        {parcel.metadata.title}
      </p>

      <p className="text-sm text-white/80 mt-1">
        {parcel.metadata.pickupLocation}
      </p>

      <p className="text-sm text-white/80 mt-1">
        {parcel.metadata.description}
      </p>

      <span
  className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${
    parcel.status === "open"
      ? "bg-blue-600"
      : parcel.status === "accepted"
      ? "bg-yellow-600"
      : parcel.status === "completed"
      ? "bg-emerald-600"
      : "bg-gray-500"
  }`}
>
  {parcel.status.toUpperCase()}
    </span>
    {parcel.status === "accepted" && (
<button
  onClick={() => navigate(`/chat/${parcel.id}`)}
  className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
>
  💬 Chat
</button>
)}

    </div>
  ))}
      </div>
    )}
  </div>

  {/* I'm Helping */}
  <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl p-4">
    <h2 className="text-lg font-semibold mb-3">
      🤝 I'm Helping
    </h2>

    {helpingParcels.length === 0 ? (
      <p className="text-white/80 text-sm">
        You haven't accepted any requests.
      </p>
    ) : (
      <div className="space-y-3">
        {helpingParcels.map((parcel) => (
          <div
  key={parcel.id}
  className="rounded-lg border border-surface-border p-3"
>
  <p className="font-semibold">
    {parcel.metadata.title}
  </p>

  <p className="text-sm text-white/80 mt-1">
    Requested by {parcel.requesterNameSnapshot}
  </p>

  <p className="text-sm text-white/80">
    📍 {parcel.metadata.pickupLocation}
  </p>

  <p className="text-sm text-white/80">
    {parcel.metadata.description}
  </p>

  <span className="inline-block mt-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
    {parcel.status.toUpperCase()}
  </span>
  {parcel.status === "accepted" && (
  <button
    onClick={() => navigate(`/chat/${parcel.id}`)}
    className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
  >
    💬 Chat
  </button>
)}
</div>
        ))}
      </div>
    )}
  </div>

</div>
            {/* Productivity Widgets */}
      <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Productivity Widgets
        </h2>

        <div className="rounded-card border border-surface-border p-4 md:col-span-2">

          {/* Clock */}
          <div className="rounded-card border border-surface-border p-4">
            <h3 className="font-medium mb-3">🕒 Live Clock</h3>

            <div className="h-48 flex flex-col items-center justify-center">
              <p className="text-5xl font-bold tracking-wide text-white">
                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>

              <p className="mt-4 text-lg font-medium text-white/80">
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

  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-white/80 mb-2">
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
              : "text-white"
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
                  <div className="text-5xl font-bold text-white">
                    {weather.temperature}°C
                  </div>

                  <div className="mt-3 text-lg text-white/80">
                    Wind: {weather.windspeed} km/h
                  </div>

                  <div className="mt-2 text-lg font-medium text-white/80">
                    {getWeatherDescription(weather.weathercode)}
                  </div>
                </>
              ) : (
                <p className="text-white/80">Loading weather...</p>
              )}
            </div>
          </div>

          {/* Stopwatch */}
          <div className="rounded-card border border-surface-border p-4">
            <h3 className="font-medium mb-3">⏱ Stopwatch</h3>

            <div className="h-48 flex flex-col items-center justify-center">
  <div className="text-4xl font-bold text-white mb-6">
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
    </div>
  </div>
);
}