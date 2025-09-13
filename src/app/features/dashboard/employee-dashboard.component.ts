import { Component, OnInit } from '@angular/core';
import { DemandeService, Demande } from '../../services/demande.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  demandes: Demande[] = [];
  currentUser: any;

  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.demandeService.getDemandes(this.currentUser.email, false).subscribe(list => {
      this.demandes = list;
    });
  }

  deleteDemande(id: number) {
    this.demandes = this.demandeService.deleteDemande(id, this.currentUser.email, false);
  }
}
