export interface ILocation {
  lat: number;
  lng: number;
}

export interface ITask {
  taskId?: string;
  type?: string;
  description: string;
  correct?: string;
  location: ILocation;
  mapHint?: JSX.Element | string;
  alternatives?: Array<string>;
  cover?: JSX.Element;
}

export interface IHunt {
  name: string;
  huntId: string;
  activeDate: Date;
  date: Date;
  tasks: Array<ITask>;
  finishTitle: string;
  finishText: string;
}
