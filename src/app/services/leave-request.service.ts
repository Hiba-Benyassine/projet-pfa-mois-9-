import { Injectable } from '@angular/core';  
import { LeaveRequest, LeaveStatus } from '../models/leave-request.model';  
import { BehaviorSubject, Observable } from 'rxjs';  

@Injectable({  
  providedIn: 'root'  
})  
export class LeaveRequestService {  
  private leaveRequests: LeaveRequest[] = [];  
  private leaveRequestsSubject = new BehaviorSubject<LeaveRequest[]>([]);  

  constructor() {  
    // Initialize with some sample data  
    this.leaveRequests = [  
      {  
        id: 1,  
        employeeId: 1,  
        employeeName: 'Ahmed El Amrani',  
        leaveType: 'ANNUAL_PAID' as any,  
        startDate: new Date('2024-07-20'),  
        endDate: new Date('2024-07-25'),  
        reason: 'Vacances à la plage',  
        emergencyContact: 'a.elamrani@exemple.com',  
        status: LeaveStatus.PENDING,  
        createdAt: new Date(),  
        updatedAt: new Date()  
      },  
      {  
        id: 2,  
        employeeId: 2,  
        employeeName: 'Fatima Zohra',  
        leaveType: 'FAMILY_EVENT_BIRTH' as any,  
        startDate: new Date('2024-08-10'),  
        endDate: new Date('2024-08-12'),  
        reason: 'Naissance de mon enfant',  
        emergencyContact: '+212612345678',  
        status: LeaveStatus.APPROVED,  
        createdAt: new Date(),  
        updatedAt: new Date()  
      }  
    ];  
    this.leaveRequestsSubject.next(this.leaveRequests);  
  }  

  getAllLeaveRequests(): Observable<LeaveRequest[]> {  
    return this.leaveRequestsSubject.asObservable();  
  }  

  getLeaveRequestById(id: number): LeaveRequest | undefined {  
    return this.leaveRequests.find(req => req.id === id);  
  }  

  createLeaveRequest(leaveRequest: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'> & { employeeId: number; employeeName: string }): void {  
    const newLeaveRequest: LeaveRequest = {  
      ...leaveRequest,  
      id: this.generateId(),  
      createdAt: new Date(),  
      updatedAt: new Date()  
    };  

    this.leaveRequests.push(newLeaveRequest);  
    this.leaveRequestsSubject.next([...this.leaveRequests]);  
  }  

  updateLeaveRequest(id: number, leaveRequest: Partial<LeaveRequest>): void {  
    const index = this.leaveRequests.findIndex(req => req.id === id);  
    if (index !== -1) {  
      this.leaveRequests[index] = {  
        ...this.leaveRequests[index],  
        ...leaveRequest,  
        updatedAt: new Date()  
      };  
      this.leaveRequestsSubject.next([...this.leaveRequests]);  
    }  
  }  

  deleteLeaveRequest(id: number): void {  
    this.leaveRequests = this.leaveRequests.filter(req => req.id !== id);  
    this.leaveRequestsSubject.next([...this.leaveRequests]);  
  }  

  private generateId(): number {  
    return Math.max(0, ...this.leaveRequests.map(req => req.id || 0)) + 1;  
  }  
}