export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPaginationParams = (query: any): PaginationParams => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  let limit = Math.max(1, parseInt(query.limit as string) || 10);
  if (limit > 100) limit = 100;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getPaginationMeta = (total: number, page: number, limit: number): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return { total, page, limit, totalPages };
};
