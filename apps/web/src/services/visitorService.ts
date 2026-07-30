const getBrowser = () => {
  const ua = navigator.userAgent;

  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Chrome")) return "Google Chrome";
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";

  return "Unknown";
};

const getOS = () => {
  const ua = navigator.userAgent;

  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";

  return "Unknown";
};

const getDevice = () => {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    ? "Mobile"
    : "Desktop";
};

export const recordVisit = async () => {
  try {
    const data = {
      page: window.location.pathname,
      browser: getBrowser(),
      device: getDevice(),
      operatingSystem: getOS(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || "Direct",
    };

    await fetch("http://localhost:5000/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to record visit:", error);
  }
};