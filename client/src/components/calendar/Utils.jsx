// CALENDAR DATE UTILS

export const changeView = (offset, currentWeek, timeFrame) => {
  if (timeFrame === "Week") {
    const newWeek = currentWeek[0];
    newWeek.setDate(newWeek.getUTCDate() + offset * 7);
    return getDaysOfWeek(newWeek);
  }
  if (timeFrame === "Month") {
    const newMonth = currentWeek[0];
    newMonth.setMonth(newMonth.getUTCMonth() + offset);
    return getDaysOfMonth(newMonth);
  }
  if (timeFrame === "Day") {
    const newDay = currentWeek[0];
    newDay.setDate(newDay.getDate() + offset);
    console.log(newDay);
    return [newDay];
  }
};

export const getStartOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay(); // Get the current day of the week (0 is Sunday)
  const diff = start.getUTCDate() - day; // Calculate the difference from the start of the week

  start.setDate(diff);
  start.setHours(0, 0, 0, 0); // Set the time to the start of the day for consistency

  return start;
};

export const getEndOfWeek = (date) => {
  const end = new Date(date);
  const day = end.getDay(); // Get the current day of the week (0 is Sunday)
  const diff = end.getUTCDate() - day; // Calculate the difference from the start of the week

  end.setDate(diff + 6);
  end.setHours(0, 0, 0, 0); // Set the time to the start of the day for consistency

  return end;
};

export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getDaysOfWeek = (currentDate) => {
  const startOfWeek = getStartOfWeek(currentDate);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getUTCDate() + index);
    return day; // Convert Date objects to string format to avoid React error
  });
};

export const getDaysOfMonth = (currentDate) => {
  const startOfMonth = new Date(currentDate);
  startOfMonth.setDate(1);
  const endOfMonth = new Date(currentDate);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  console.log("startOfMonth", startOfMonth, "endOfMonth", endOfMonth);
  console.log(endOfMonth.getDate());
  return Array.from(
    { length: endOfMonth.getDate() },
    (_, index) =>
      new Date(
        startOfMonth.getUTCFullYear(),
        startOfMonth.getUTCMonth(),
        index + 1
      )
  );
};

// CALENDAR SLOT UTILS

export const findConnectedGrouping = (slots, clickedDay, clickedHour) => {
  if (!slots) return null;

  const clickedSlotIndex = slots.findIndex((slot) => {
    return (
      slot.day === clickedDay &&
      clickedHour >= slot.start &&
      clickedHour < slot.end
    );
  });

  if (clickedSlotIndex === -1) return null;

  const clickedSlot = slots[clickedSlotIndex];
  let start = clickedSlot.start;
  let end = clickedSlot.end;
  const itemData = clickedSlot.item;

  // Traverse backward to find the earliest connected start time with the same item.name
  for (let i = clickedSlotIndex - 1; i >= 0; i--) {
    if (slots[i].end === start && slots[i].item === itemData) {
      start = slots[i].start;
    } else {
      break; // Break if slots are not connected or names don't match
    }
  }

  // Traverse forward to find the latest connected end time with the same item.name
  for (let i = clickedSlotIndex + 1; i < slots.length; i++) {
    if (slots[i].start === end && slots[i].item === itemData) {
      end = slots[i].end;
    } else {
      break; // Break if slots are not connected or names don't match
    }
  }
  return { start, end, itemData };
};

export const isSlotEdge = (day, hour, scheduledSlots) => {
  const connectedBookings = findConnectedGrouping(scheduledSlots, day, hour);
  if (!connectedBookings) return;

  if (connectedBookings.start === hour) return "start";
  if (connectedBookings.end - 1 === hour) return "end";
  return "middle";
};

export const groupSlotsByDay = (scheduledSlots) => {
  return scheduledSlots.reduce((acc, slot) => {
    if (!acc[slot.day]) {
      acc[slot.day] = [];
    }

    acc[slot.day].push(slot);
    acc[slot.day] = acc[slot.day].sort((a, b) => a.start - b.start);
    return acc;
  }, {});
};

export const deleteHelper = (day, hour, connectedGrouping, scheduledSlots) => {
  let updatedSlots = scheduledSlots.filter((slot) => {
    return (
      slot.day !== day ||
      slot.end <= connectedGrouping.start ||
      slot.start > connectedGrouping.end
    );
  });

  if (updatedSlots.length === 0) return [];
  return updatedSlots;
};
