
export interface App {
  searchParam: any;
  searchResults: any;

  category: any;
  
  filterParam: any;
  filterResults: any;

  stockDetails: any;
}

export interface AppState {
  readonly app: App;
}
