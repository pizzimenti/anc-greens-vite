export function formatDate(dateString: string | null): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Anchorage",
    weekday: "short",
    month: "numeric",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const time = formattedDate.split(" ")[2];

  if (time === "00:00") {
    return formattedDate.split(" ").slice(0, 2).join(" ");
  } else {
    return formattedDate;
  }
}
