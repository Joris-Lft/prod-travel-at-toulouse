const baseUrl = "https://api.tisseo.fr/v2";
const API_TOKEN = "0340dac5-fee8-4523-97f5-3a55fe9f7c8e";

export const getLines = async () => {
  return await fetch(
    `${baseUrl}/lines.json?displayTerminus=1&key=${API_TOKEN}`,
  ).then(async (res) => {
    // todo: handle errors
    const data = await res.json();
    return data.lines.line;
  });
};

export const getStopPlacesForLine = async (id: string) => {
  return await fetch(
    `${baseUrl}/stop_points.json?lineId=${id}&displayDestinations=1&key=${API_TOKEN}`,
  ).then(async (res) => {
    // todo: handle errors
    const data = await res.json();
    return data.physicalStops.physicalStop;
  });
};

export const getNextStop = async (lineId: string, stopPointId: string) => {
  return await fetch(
    `${baseUrl}/stops_schedules.json?lineId=${lineId}&stopPointId=${stopPointId}&key=${API_TOKEN}`,
  ).then(async (res) => {
    // todo: handle errors
    const data = await res.json();
    return data.departures.departure;
  });
};

export const getLastOfTheDay = async (lineId: string, stopPointId: string) => {
  return await fetch(
    `${baseUrl}/stops_schedules.json?lineId=${lineId}&stopPointId=${stopPointId}&firstAndLastOfDay=1&key=${API_TOKEN}`,
  ).then(async (res) => {
    // todo: handle errors
    const data = await res.json();
    return data.departures.departure;
  });
};

export const getMessages = async () => {
  return await fetch(`${baseUrl}/messages.json?key=${API_TOKEN}`).then(
    async (res) => {
      // todo: handle errors
      const data = await res.json();
      return data.messages;
    },
  );
};
