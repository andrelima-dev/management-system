const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUuid = (value: string): boolean => uuidPattern.test(value);

export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export const normalizePagination = ({ page = 1, pageSize = 10 }: PaginationInput) => ({
  page: Math.max(1, page),
  pageSize: Math.min(100, Math.max(1, pageSize))
});
