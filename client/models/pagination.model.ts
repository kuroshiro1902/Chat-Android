export interface IPagination {
  pageIndex?: number; // default 1
  perPage?: number; // default 20
  sortBy?: string; // default id
  order?: 'asc' | 'desc'; // default desc
}
