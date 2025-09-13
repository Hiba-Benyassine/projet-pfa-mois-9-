import { Component, OnInit } from '@angular/core';
import { Demande, DemandeService } from '../../../services/demande.service';

@Component({
  selector: 'app-leave-request-list',
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss']
})
export class LeaveRequestListComponent implements OnInit {
  demandes: Demande[] = [];
  isAdmin = false;
  currentUserEmail = '';
  successMessage: string | undefined;


  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAdmin = !!user.isAdmin;
    this.currentUserEmail = user.email || '';
    this.demandeService.getDemandes(this.currentUserEmail, this.isAdmin).subscribe((list: Demande[]) => {
      this.demandes = list;
    });
  }

  getEmployeName(demande: Demande): string {
    // Prefer structured names from the demande itself
    const fn = (demande as any).employeeFirstName || '';
    const ln = (demande as any).employeeLastName || '';
    const structured = `${fn} ${ln}`.trim();
    if (structured) return structured;
    // Fallback to combined stored name
    if ((demande as any).employeeName) return (demande as any).employeeName;
    // Last fallback: read from users by userId
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === demande.userId);
    return user ? user.fullName : demande.userId;
  }

  getType(demande: Demande): string {
    return demande.title.split(' - ')[0] || '';
  }

  getDebut(demande: Demande): string {
    const match = demande.description.match(/Du (\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
  }

  getFin(demande: Demande): string {
    const match = demande.description.match(/au (\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
  }

  getDuree(demande: Demande): number {
    const debut = this.getDebut(demande);
    const fin = this.getFin(demande);
    if (debut && fin) {
      const start = new Date(debut);
      const end = new Date(fin);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  }

  canEditOrDelete(demande: Demande): boolean {
    return this.isAdmin || demande.userId === this.currentUserEmail;
  }

  deleteRequest(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.demandeService.deleteDemande(id, this.currentUserEmail, this.isAdmin);
      this.demandeService.getDemandes(this.currentUserEmail, this.isAdmin).subscribe((list: Demande[]) => {
        this.demandes = list;
      });
    }
  }

  validateRequest(demande: Demande): void {
    if (confirm('Êtes-vous sûr de vouloir valider cette demande ?')) {
      this.demandeService.validateDemande(demande, this.currentUserEmail, this.isAdmin);
      this.successMessage = '✅ La demande a été validée avec succès !';
      this.demandeService.getDemandes(this.currentUserEmail, this.isAdmin).subscribe((list: Demande[]) => {
        this.demandes = list;
      });
      setTimeout(() => {
        this.successMessage = '';
      }, 3000); // Clear message after 3 seconds
    }
}
}
