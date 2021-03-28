export interface ILocation {
  lat: number;
  lng: number;
}

export interface ITask {
  taskId: string;
  type: string;
  description: string;
  correct: string;
  location: ILocation | null;
  mapHint: string;
  alternatives?: Array<string>;
  image: string;
  date: string;
}

export interface IHunt {
  name: string;
  huntId: string;
  activeDate: string;
  date: string;
  tasks: Array<ITask>;
  finishTitle: string;
  finishText: string;
}
