export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  lastchangetime: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastcheckoktime: string;
  lastlocalchecktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
}

export interface FavoriteRadio {
  stationuuid: string;
  name: string;
  url_resolved: string;
  tags: string;
  bitrate: number;
  codec: string;
  addedAt: string;
}

export interface PlaybackHistory {
  stationuuid: string;
  name: string;
  playedAt: string;
}