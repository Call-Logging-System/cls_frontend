import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { OfficeModel } from '../../../models/office/office.model';
import { CallLogService } from '../../../services/call-log/call-log.service';
import { LoadingService } from '../../../services/common/loading.service';
import { NotificationService } from '../../../services/common/notification.service';
import { PhoneBookService } from '../../../services/phone-book/phone-book.service';

@Component({
  selector: 'app-add-call-log-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatAutocompleteModule,
  ],
  templateUrl: './add-call-log-form.html',
  styleUrl: './add-call-log-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCallLogForm implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly callLogSvc = inject(CallLogService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly phoneBookSvc = inject(PhoneBookService);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);

  // ── Screen & mode ──────────────────────────────
  screen: 'incoming' | 'active' | 'review' = 'incoming';
  logMode: 'live' | 'manual' = 'live';

  // ── Saving state ───────────────────────────────
  isSaving = false;

  // ── Office fields ──────────────────────────────
  officeUserName = '';
  officeLevel: number | null = null;
  contactNumber = '';

  // ── Autocomplete fields ────────────────────────
  officeUserControl = new FormControl('');
  filteredOffices: OfficeModel[] = [];
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  issueReportedControl = new FormControl('');
  filteredIssueReported: any[] = [];
  private issueReportedSearchSubject = new Subject<string>();

  get officeLevelLabel(): string {
    const map: Record<number, string> = { 2: 'Circle', 3: 'Division', 4: 'Range' };
    return this.officeLevel ? (map[this.officeLevel] ?? '') : '';
  }

  // ── Users dropdown ─────────────────────────────
  users: { key: number; value: string }[] = [];

  // ── Call log data object ───────────────────────
  callLog: any = {
    callDate: '',
    callStartTime: '',
    callEndTime: '',
    issueType: '',
    priority: '',
    status: 'O',
    issueReported: '',
    description: '',
    reportedTo: null,
    solvedBy: null,
    releaseDate: null,
    isReleased: false,
  };

  // ── Timer ──────────────────────────────────────
  timerState: 'idle' | 'running' | 'paused' = 'idle';
  timerSeconds = 0;
  timerInterval: any = null;
  pausedSeconds = 0;
  finalDuration = '';

  get timerDisplay(): string {
    const h = Math.floor(this.timerSeconds / 3600);
    const m = Math.floor((this.timerSeconds % 3600) / 60);
    const s = this.timerSeconds % 60;
    return h > 0
      ? `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}`
      : `${this.pad(m)}:${this.pad(s)}`;
  }

  get activeTimeDisplay(): string {
    const active = this.timerSeconds - this.pausedSeconds;
    const m = Math.floor(active / 60);
    const s = active % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  get isFormValid(): boolean {
    return !!(
      this.officeUserName?.trim() &&
      this.officeLevel &&
      this.callLog.issueType &&
      this.callLog.priority &&
      this.callLog.status &&
      this.callLog.issueReported?.trim() &&
      this.callLog.reportedTo
    );
  }

  private pad = (n: number) => n.toString().padStart(2, '0');

  // ── Labels ─────────────────────────────────────
  get typeLabel(): string {
    return (
      ({ B: 'Bug', S: 'Support', C: 'Change', K: 'Backend' } as any)[
        this.callLog.issueType
      ] ?? '—'
    );
  }
  get priorityLabel(): string {
    return ({ H: 'High', M: 'Medium', L: 'Low' } as any)[this.callLog.priority] ?? '—';
  }
  get priorityClass(): string {
    return ({ H: 'high', M: 'medium', L: 'low' } as any)[this.callLog.priority] ?? '';
  }
  get statusLabel(): string {
    return (
      ({ O: 'Open', P: 'In Progress', D: 'Pending', C: 'Closed' } as any)[
        this.callLog.status
      ] ?? '—'
    );
  }
  get statusClass(): string {
    return (
      ({ O: 'open', P: 'progress', D: 'pending', C: 'closed' } as any)[
        this.callLog.status
      ] ?? ''
    );
  }

  // ── Lifecycle ──────────────────────────────────
  ngOnInit(): void {
    this.callLogSvc.getUsersDropdown().subscribe({
      next: (data) => (this.users = data),
      error: () => {
        this.notificationService.showError(
          'Failed to load users. Please refresh the page.'
        );
      },
    });

    // Setup autocomplete search with debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((query) => {
        if (query.length >= 3) {
          this.phoneBookSvc.searchOffices(query).subscribe({
            next: (offices) => {
              this.filteredOffices = offices;
              this.cdr.detectChanges();
            },
            error: () => {
              this.filteredOffices = [];
              this.cdr.detectChanges();
            },
          });
        } else {
          this.filteredOffices = [];
          this.cdr.detectChanges();
        }
      });

    // Subscribe to input changes
    this.officeUserControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.officeUserName = value;
        this.searchSubject.next(value);
      }
    });

    // Setup issue reported autocomplete search with debounce
    this.issueReportedSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((query) => {
        if (query.length >= 3) {
          this.callLogSvc.searchIssueReported(query).subscribe({
            next: (issues) => {
              this.filteredIssueReported = issues;
              this.cdr.detectChanges();
            },
            error: () => {
              this.filteredIssueReported = [];
              this.cdr.detectChanges();
            },
          });
        } else {
          this.filteredIssueReported = [];
          this.cdr.detectChanges();
        }
      });

    // Subscribe to issue reported input changes
    this.issueReportedControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.callLog.issueReported = value;
        this.issueReportedSearchSubject.next(value);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectOffice(office: OfficeModel): void {
    this.officeUserName = office.officeUserName;
    this.officeLevel = office.officeLevel;
    this.contactNumber = office.contactNumber ?? '';
    this.officeUserControl.setValue(office.officeUserName, { emitEvent: false });
    this.filteredOffices = [];
    this.cdr.detectChanges();
  }

  selectIssueReported(issue: any): void {
    this.callLog.issueReported = typeof issue === 'string' ? issue : issue.name;
    this.issueReportedControl.setValue(this.callLog.issueReported, { emitEvent: false });
    this.filteredIssueReported = [];
    this.cdr.detectChanges();
  }

  // ── Phone book lookup ──────────────────────────
  private lookupAndProceed(next: () => void): void {
    this.phoneBookSvc.getOfficeByUserName(this.officeUserName.trim()).subscribe({
      next: (office) => {
        this.contactNumber = office?.contactNumber ?? '';
        next();
        this.cdr.detectChanges();
      },
      error: () => {
        // Not a blocking error — office may just not exist in phone book yet
        this.contactNumber = '';
        next();
        this.cdr.detectChanges();
      },
    });
  }

  // ── Timer controls ─────────────────────────────
  startCall(): void {
    if (!this.officeUserName?.trim() || !this.officeLevel) {
      this.notificationService.showError(
        'Office Username and Office Level are required.'
      );
      return;
    }

    this.lookupAndProceed(() => {
      const now = new Date();
      this.callLog.callDate = now.toISOString().split('T')[0];
      this.callLog.callStartTime = now.toTimeString().slice(0, 8);
      this.timerSeconds = 0;
      this.pausedSeconds = 0;
      this.timerState = 'running';
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.cdr.detectChanges();
      }, 1000);
      this.screen = 'active';
    });
  }

  startManual(): void {
    if (!this.officeUserName?.trim() || !this.officeLevel) {
      this.notificationService.showError(
        'Office Username and Office Level are required.'
      );
      return;
    }

    if (
      !this.callLog.callDate ||
      !this.callLog.callStartTime ||
      !this.callLog.callEndTime
    ) {
      this.notificationService.showError('All timing fields are required.');
      return;
    }

    this.lookupAndProceed(() => {
      this.screen = 'active';
    });
  }

  timerPause(): void {
    clearInterval(this.timerInterval);
    this.timerState = 'paused';
  }

  timerResume(): void {
    this.timerState = 'running';
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.cdr.detectChanges();
    }, 1000);
  }

  endCall(): void {
    if (!this.isFormValid) {
      this.notificationService.showError('Please fill all required fields.');
      return;
    }

    if (this.logMode === 'live') {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.timerState = 'idle';
      this.callLog.callEndTime = new Date().toTimeString().slice(0, 8);
      this.finalDuration = this.activeTimeDisplay;
    }
    this.screen = 'review';
  }

  private clearTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  // ── Save ───────────────────────────────────────
  saveCallLog(): void {
    if (!this.isFormValid) {
      this.notificationService.showError('Please fill all required fields.');
      return;
    }

    this.isSaving = true;

    const payload = {
      officeUserName: this.officeUserName,
      officeLevel: this.officeLevel,
      contactNumber: this.contactNumber,
      ...this.callLog,
    };

    this.callLogSvc.saveCallLog(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.notificationService.showSuccess('Call log saved successfully.');
        this.router.navigate(['/call-logs']);
      },
      error: () => {
        // AuthInterceptor handles 401/403/500 globally.
        // This keeps the user on the review screen so they don't lose their data.
        this.isSaving = false;
        this.notificationService.showError(
          'Failed to save call log. Please try again.'
        );
        this.cdr.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/call-logs']);
  }

  backToEdit(): void {
    if (this.logMode === 'live') {
      this.timerState = 'running';
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.cdr.detectChanges();
      }, 1000);
    }
    this.screen = 'active';
  }
}