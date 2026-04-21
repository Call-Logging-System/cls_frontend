import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
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
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
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

  // ── Office fields ──────────────────────────────
  officeUserName = '';
  officeLevel: number | null = null;
  contactNumber = '';

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
    return h > 0 ? `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}` : `${this.pad(m)}:${this.pad(s)}`;
  }

  get activeTimeDisplay(): string {
    const active = this.timerSeconds - this.pausedSeconds;
    const m = Math.floor(active / 60);
    const s = active % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  private pad = (n: number) => n.toString().padStart(2, '0');

  // ── Labels ─────────────────────────────────────
  get typeLabel(): string {
    return (
      ({ B: 'Bug', S: 'Support', C: 'Change', K: 'Backend' } as any)[this.callLog.issueType] ?? '—'
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
      ({ O: 'Open', P: 'In Progress', D: 'Pending', C: 'Closed' } as any)[this.callLog.status] ??
      '—'
    );
  }
  get statusClass(): string {
    return (
      ({ O: 'open', P: 'progress', D: 'pending', C: 'closed' } as any)[this.callLog.status] ?? ''
    );
  }

  // ── Lifecycle ──────────────────────────────────
  ngOnInit(): void {
    this.callLogSvc.getUsersDropdown().subscribe({
      next: (data) => (this.users = data),
      error: () => {},
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
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
        this.contactNumber = '';
        next();
        this.cdr.detectChanges();
      },
    });
  }

  // ── Timer controls ─────────────────────────────
  startCall(): void {
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
    const payload = {
      officeUserName: this.officeUserName,
      officeLevel: this.officeLevel,
      contactNumber: this.contactNumber,
      ...this.callLog,
    };

    this.callLogSvc.saveCallLog(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Call log saved successfully.');
        this.router.navigate(['/call-logs']);
      },
      error: () => {
        ;
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
