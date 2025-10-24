export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
