export type Line = {
  bgXmlColor: string;
  color: string;
  fgXmlColor: string;
  id: string;
  name: string;
  network: string;
  reservationMandatory?: string;
  shortName: string;
  terminus?: Terminus[];
  transportMode?: TransportMode;
};

type Terminus = { cityName: string; id: string; name: string };
type TransportMode = { article: string; id: string; name: string };

export type StopPlace = {
  destinations: Terminus[];
  handicappedCompliance: string;
  id: string;
  lines: [{ short_name: "T1" }];
  name: string;
  operatorCodes: [{ operatorCode: [object] }];
  stopArea: StopArea;
};

type StopArea = {
  cityName: string;
  id: string;
  name: string;
};

export type StopTime = {
  dateTime: string;
  destination: Terminus[];
  line: Line;
  realTime: string;
};

export type Favorite = {
  selectedLine: Line;
  selectedStopPlace: StopPlace;
};

export type Message = {
  lines: Line[];
  message: {
    content: string;
    id: string;
    importanceLevel: string;
    scope: string;
    title: string;
    type: string;
    url: string;
  };
};

export type FormatedMessage = {
  content: string;
  id: string;
  importanceLevel: string;
  scope: string;
  title: string;
  type: string;
  url: string;
};
