export interface LeaveRequest {  
  id?: number;  
  employeeId: number;  
  employeeName: string;  
  leaveType: LeaveType;  
  startDate: Date;  
  endDate: Date;  
  reason: string;  
  status: LeaveStatus;  
  emergencyContact: string;  
  createdAt?: Date;  
  updatedAt?: Date;  
}  

export enum LeaveType {  
  ANNUAL_PAID = 'ANNUAL_PAID', // Congé annuel payé
  FAMILY_EVENT_MARRIAGE = 'FAMILY_EVENT_MARRIAGE', // Mariage
  FAMILY_EVENT_BIRTH = 'FAMILY_EVENT_BIRTH', // Naissance
  FAMILY_EVENT_DEATH = 'FAMILY_EVENT_DEATH', // Décès
  FAMILY_EVENT_CIRCUMCISION = 'FAMILY_EVENT_CIRCUMCISION', // Circoncision
  MATERNITY = 'MATERNITY', // Maternité
  PATERNITY = 'PATERNITY', // Paternité
  SICK_LEAVE = 'SICK_LEAVE', // Maladie
  WORK_ACCIDENT_ILLNESS = 'WORK_ACCIDENT_ILLNESS', // Accident de travail/maladie professionnelle
  PUBLIC_HOLIDAY = 'PUBLIC_HOLIDAY', // Jours fériés légaux
  SYNDICAL = 'SYNDICAL', // Congé syndical
  WITHOUT_PAY = 'WITHOUT_PAY', // Sans solde
  TRAINING = 'TRAINING', // Formation
  OTHER = 'OTHER'
}  

export enum LeaveStatus {  
  PENDING = 'PENDING',  
  APPROVED = 'APPROVED',  
  REJECTED = 'REJECTED',  
  CANCELLED = 'CANCELLED'  
}  

export interface LeaveTypeOption {  
  value: LeaveType;  
  label: string;  
}  

export const LEAVE_TYPE_OPTIONS: LeaveTypeOption[] = [  
  { value: LeaveType.ANNUAL_PAID, label: 'Congé annuel payé' },
  { value: LeaveType.FAMILY_EVENT_MARRIAGE, label: 'Congé mariage' },
  { value: LeaveType.FAMILY_EVENT_BIRTH, label: 'Congé naissance' },
  { value: LeaveType.FAMILY_EVENT_DEATH, label: 'Congé décès' },
  { value: LeaveType.FAMILY_EVENT_CIRCUMCISION, label: 'Congé circoncision' },
  { value: LeaveType.MATERNITY, label: 'Congé maternité' },
  { value: LeaveType.PATERNITY, label: 'Congé paternité' },
  { value: LeaveType.SICK_LEAVE, label: 'Congé maladie' },
  { value: LeaveType.WORK_ACCIDENT_ILLNESS, label: 'Congé accident de travail/maladie pro' },
  { value: LeaveType.SYNDICAL, label: 'Congé syndical' },
  { value: LeaveType.WITHOUT_PAY, label: 'Congé sans solde' },
  { value: LeaveType.TRAINING, label: 'Congé de formation' },
  { value: LeaveType.OTHER, label: 'Autre' }
];

export const LEAVE_STATUS_OPTIONS = [  
  { value: LeaveStatus.PENDING, label: 'En attente' },  
  { value: LeaveStatus.APPROVED, label: 'Approuvé' },  
  { value: LeaveStatus.REJECTED, label: 'Rejeté' },  
  { value: LeaveStatus.CANCELLED, label: 'Annulé' }  
];