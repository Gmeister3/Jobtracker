
export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface JobApplication {
  id: number;
  company: string;
  position: string;
  status: ApplicationStatus;
  salary: number | null;
  dateApplied: string;
  jobUrl: string | null;
  notes: string | null;
}
