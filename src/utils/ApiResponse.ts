export class ApiResponse<T> {
  success: boolean = true;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(message: string, data: T, meta?: { page: number; limit: number; total: number; totalPages: number }) {
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}
