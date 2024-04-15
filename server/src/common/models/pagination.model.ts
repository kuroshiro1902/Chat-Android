export interface IPagination {
  pageIndex?: number;
  perPage?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
