export const formateRelativeTime = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const now = new Date();

  const difflnSeconds = Math.round((date - now) / 1000);

  const timeUnits = [
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of timeUnits) {
    if (Math.abs(difflnSeconds) >= seconds || unit === "second") {
      const value = Math.round(difflnSeconds / seconds);
      const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
      return formatter.format(value, unit);
    }
  }
};
