// path: src/services/dateUtils.ts


export function formatDate(dateString: string | null): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Anchorage",
    weekday: "short",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const timePart = formattedDate.split(", ")[2];

  if (timePart === "12:00 AM") {
    return formattedDate.split(", ").slice(0, 2).join(", ");
  } else {
    return formattedDate.replace(" ", "").replace("AM", "am").replace("PM", "pm");
  }
}
