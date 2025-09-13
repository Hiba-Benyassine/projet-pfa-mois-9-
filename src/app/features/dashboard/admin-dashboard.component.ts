import { Component, OnInit } from '@angular/core';
import { DemandeService, Demande } from '../../services/demande.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  demandes: Demande[] = [];
  currentUser: any;

  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.demandeService.getDemandes(this.currentUser.email, true).subscribe(list => {
      this.demandes = list;
    });
  }

  deleteDemande(id: number) {
    this.demandes = this.demandeService.deleteDemande(id, this.currentUser.email, true);
  }
}
