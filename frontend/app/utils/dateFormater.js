const FormatDate = (dateInput, locale = "en-US") => {
    if (!dateInput) return "Invalid date";
  
    const date = new Date(dateInput);
    if (isNaN(date)) return "Invalid date";
  
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  
  export default FormatDate;
  