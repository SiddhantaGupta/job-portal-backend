export interface IJobSearchModel {
  search: string;
  page: number;
  perPage: number;
  userId: number;
  isActive: boolean;
  candidateId: number;
}
