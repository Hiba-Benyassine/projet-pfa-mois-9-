import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LEAVE_TYPE_OPTIONS } from '../../../models/leave-request.model';
import { DemandeService } from '../../../services/demande.service';

// Fonction de validation personnalisée pour les dates
export const datesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDateControl = control.get('startDate');
  const endDateControl = control.get('endDate');
  
  if (!startDateControl || !endDateControl) {
    return null;
  }

  const startDate = new Date(startDateControl.value);
  const endDate = new Date(endDateControl.value);
  
  // Only validate if both dates are valid
  if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    if (startDate > endDate) {
      const startErrors = { ...(startDateControl.errors || {}), invalidDates: true };
      const endErrors = { ...(endDateControl.errors || {}), invalidDates: true };
      startDateControl.setErrors(startErrors);
      endDateControl.setErrors(endErrors);
      return { invalidDates: true };
    } else {
      // Clear only the invalidDates error without removing others
      if (startDateControl.errors && 'invalidDates' in startDateControl.errors) {
        const { invalidDates, ...rest } = startDateControl.errors as ValidationErrors;
        startDateControl.setErrors(Object.keys(rest).length ? rest : null);
      }
      if (endDateControl.errors && 'invalidDates' in endDateControl.errors) {
        const { invalidDates, ...rest } = endDateControl.errors as ValidationErrors;
        endDateControl.setErrors(Object.keys(rest).length ? rest : null);
      }
      return null;
    }
  }
  return null;
};

// Fonction de validation personnalisée pour le contact d'urgence (téléphone OU email)
export const emergencyContactValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const phoneControl = control.get('emergencyPhone');
  const emailControl = control.get('emergencyEmail');
  
  if (!phoneControl || !emailControl) {
    return null;
  }

  const hasContact = !!phoneControl.value || !!emailControl.value;
  return hasContact ? null : { oneRequired: true };
};

// Nouvelle fonction de validation pour la durée selon le type de congé
export const durationValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const leaveType = control.get('leaveType')?.value;
  const startDate = new Date(control.get('startDate')?.value);
  const endDate = new Date(control.get('endDate')?.value);

  if (!leaveType || !startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return null;
  }

  const duration = getDuration(startDate, endDate);

  switch (leaveType) {
    case 'ANNUAL_PAID':
      if (duration < 18 || duration > 30) {
        return { invalidDuration: 'La durée du congé annuel doit être entre 18 et 30 jours ouvrables.' };
      }
      break;
    case 'FAMILY_EVENT_MARRIAGE':
      if (duration !== 4) {
        return { invalidDuration: 'Le congé pour mariage est de 4 jours.' };
      }
      break;
    case 'FAMILY_EVENT_BIRTH':
      if (duration !== 3) {
        return { invalidDuration: 'Le congé de naissance est de 3 jours.' };
      }
      break;
    case 'FAMILY_EVENT_DEATH':
      if (duration !== 3) {
        return { invalidDuration: 'Le congé pour décès est de 3 jours.' };
      }
      break;
    case 'FAMILY_EVENT_CIRCUMCISION':
      if (duration !== 2) {
        return { invalidDuration: 'Le congé pour circoncision est de 2 jours.' };
      }
      break;
    case 'PATERNITY':
      if (duration !== 15) {
        return { invalidDuration: 'Le congé de paternité est de 15 jours ouvrables.' };
      }
      break;
    default:
      return null;
  }

  return null;
};

// Fonction utilitaire pour calculer la durée en jours ouvrables
const getDuration = (startDate: Date, endDate: Date): number => {
  let count = 0;
  let currentDate = new Date(startDate);
  const moroccanHolidays: string[] = [
    '2025-01-01', // Nouvel An
    '2025-01-11', // Manifeste de l’Indépendance
    '2025-03-03', // Fête du Trône
    '2025-05-01', // Fête du Travail
    '2025-07-30', // Fête du Trône
    '2025-08-14', // Allégeance Oued Eddahab
    '2025-08-20', // Révolution du Roi et du Peuple
    '2025-08-21', // Fête de la Jeunesse
    '2025-11-06', // Marche Verte
    '2025-11-18'  // Fête de l'Indépendance
  ];

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Samedi(6) et Dimanche(0)
    const isHoliday = moroccanHolidays.includes(currentDate.toISOString().slice(0, 10));

    if (!isWeekend && !isHoliday) {
      count++;
    }
    
    // advance by one day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
};

@Component({
  selector: 'app-leave-request-form',
  templateUrl: './leave-request-form.component.html',
  styleUrls: ['./leave-request-form.component.scss']
})
export class LeaveRequestFormComponent implements OnInit {
  leaveForm: FormGroup;
  isEditMode = false;
  leaveId?: number;
  leaveTypeOptions = LEAVE_TYPE_OPTIONS;
  isAdmin = false;
  currentUserFirstName = '';
  currentUserLastName = '';
  originalUserId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private demandeService: DemandeService
  ) {
    this.leaveForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: [''],
      emergencyPhone: [''],
      emergencyEmail: ['']
    }, { validators: [datesValidator, emergencyContactValidator, durationValidator] });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAdmin = !!user.isAdmin;
    // Always store current user name for later use (for non-admins)
    if (!this.isAdmin) {
      const nameParts = (user.fullName || '').split(' ');
      this.currentUserFirstName = nameParts[0] || '';
      this.currentUserLastName = nameParts.slice(1).join(' ') || '';
    }
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.leaveId = +params['id'];
        this.leaveForm.reset();
        this.loadLeaveRequest(this.leaveId);
      } else {
        this.isEditMode = false;
        this.leaveId = undefined;
        this.leaveForm.reset();
        // Only pre-fill name for non-admins in create mode
        if (!this.isAdmin) {
          this.leaveForm.setValue({
            firstName: this.currentUserFirstName,
            lastName: this.currentUserLastName,
            leaveType: '',
            startDate: '',
            endDate: '',
            reason: '',
            emergencyPhone: '',
            emergencyEmail: ''
          });
        }
      }
    });

    // Force la re-validation du formulaire entier à chaque changement de valeur
    this.leaveForm.valueChanges.subscribe(() => {
      this.leaveForm.updateValueAndValidity({ emitEvent: false });
    });
  }

  loadLeaveRequest(id: number): void {
    // Charger la demande à modifier via DemandeService
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const allDemandes = JSON.parse(localStorage.getItem('demandes') || '[]');
    const demande = this.isAdmin ? allDemandes.find((d: any) => d.id === id) : allDemandes.find((d: any) => d.id === id && d.userId === user.email);
    if (demande) {
      this.originalUserId = demande.userId;
      const [leaveType, reason] = (demande.title || '').split(' - ');
      const dateMatch = (demande.description || '').match(/Du (\d{4}-\d{2}-\d{2}) au (\d{4}-\d{2}-\d{2})/);
      const startDate = dateMatch ? dateMatch[1] : '';
      const endDate = dateMatch ? dateMatch[2] : '';
      const contactMatch = (demande.description || '').match(/Contact: (.+)$/);
      const contact = contactMatch ? contactMatch[1] : '';
      // Préférer les champs structurés s'ils existent, sinon tomber sur l'utilisateur puis le champ combiné
      let firstName = (demande as any).employeeFirstName || '';
      let lastName = (demande as any).employeeLastName || '';
      if (!firstName && !lastName) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const demandeUser = users.find((u: any) => u.email === demande.userId);
        const fullNameSource = (demandeUser && demandeUser.fullName) ? demandeUser.fullName : (demande as any).employeeName || '';
        if (fullNameSource) {
          const nameParts = String(fullNameSource).trim().split(/\s+/);
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
      }
      this.leaveForm.setValue({
        firstName: firstName,
        lastName: lastName,
        leaveType: leaveType || '',
        startDate: startDate,
        endDate: endDate,
        reason: reason || '',
        emergencyPhone: contact.includes('@') ? '' : contact,
        emergencyEmail: contact.includes('@') ? contact : ''
      });
    }
  }

  onSubmit(): void {
    this.leaveForm.markAllAsTouched();
    if (this.leaveForm.valid) {
      // Always use the form's firstName and lastName for admin, and for employee use currentUserFirstName/LastName
      let firstName = this.leaveForm.get('firstName')?.value;
      let lastName = this.leaveForm.get('lastName')?.value;
      if (!this.isAdmin) {
        firstName = this.currentUserFirstName;
        lastName = this.currentUserLastName;
      }
      const employeeName = `${firstName} ${lastName}`.trim();
      const formValue = this.leaveForm.getRawValue();
      const emergencyContact = formValue.emergencyPhone || formValue.emergencyEmail;

      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      // Déterminer l'utilisateur cible (pour admin, basé sur le nom saisi)
      let targetUserId = this.isEditMode ? this.originalUserId : user.email;
      if (this.isAdmin) {
        const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
        const matched = users.find(u => String(u.fullName).trim().toLowerCase() === employeeName.toLowerCase());
        if (matched) {
          targetUserId = matched.email; // réassignation de la demande à cet employé
        } else if (this.isEditMode && this.originalUserId) {
          // sinon, mettre à jour le nom de l'utilisateur original avec le nom saisi
          const currentUserRecord = users.find(u => u.email === this.originalUserId);
          if (currentUserRecord) {
            const updatedUser = { ...currentUserRecord, fullName: employeeName };
            this.demandeService.updateUser(currentUserRecord.email, updatedUser);
            // conserver targetUserId sur originalUserId
            targetUserId = this.originalUserId;
          }
        } else if (!this.isEditMode) {
          // création sans correspondance: laisser l'admin comme propriétaire par défaut
          targetUserId = user.email;
        }
      }

      const demandeData = {
        userId: targetUserId,
        // Store structured names for consistency
        employeeFirstName: firstName,
        employeeLastName: lastName,
        // Keep combined as fallback for older code
        employeeName: employeeName,
        title: `${formValue.leaveType} - ${formValue.reason}`,
        description: `Du ${formValue.startDate} au ${formValue.endDate}. Contact: ${formValue.emergencyPhone || formValue.emergencyEmail}`,
        status: 'pending' as 'pending'
      };
      if (this.isEditMode && this.leaveId) {
        // Modifier la demande existante
        const allDemandes = JSON.parse(localStorage.getItem('demandes') || '[]');
        const demandeExistante = this.isAdmin ? allDemandes.find((d: any) => d.id === this.leaveId) : allDemandes.find((d: any) => d.id === this.leaveId && d.userId === user.email);
        if (demandeExistante) {
          const updatedDemande = {
            ...demandeExistante,
            ...demandeData,
            id: this.leaveId // Ensure id is preserved
          };
          this.demandeService.updateDemande(updatedDemande, user.email, user.isAdmin);
        }
      } else {
        // Créer une nouvelle demande
        this.demandeService.createDemande(demandeData, user.email, user.isAdmin);
      }
      this.router.navigate([this.isAdmin ? '/admin-dashboard' : '/employee-dashboard']);
    }
  }

  private generateEmployeeId(): number {
    return Date.now();
  }

  onCancel(): void {
    this.router.navigate([this.isAdmin ? '/admin-dashboard' : '/employee-dashboard']);
  }

  deleteCurrentDemande(): void {
    if (this.isEditMode && typeof this.leaveId === 'number') {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.demandeService.deleteDemande(this.leaveId as number, user.email, user.isAdmin);
      this.router.navigate([this.isAdmin ? '/admin-dashboard' : '/employee-dashboard']);
    }
  }

  get duration(): number {
    const start = new Date(this.leaveForm.get('startDate')?.value);
    const end = new Date(this.leaveForm.get('endDate')?.value);
    
    if (start && end && start <= end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return getDuration(start, end);
    }
    return 0;
  }
}