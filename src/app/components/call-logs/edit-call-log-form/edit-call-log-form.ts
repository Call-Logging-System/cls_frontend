// edit-call-log-form.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CallLogService } from '../../../services/call-log/call-log.service';
import { NotificationService } from '../../../services/common/notification.service';

@Component({
  selector: 'app-edit-call-log-form',
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
  templateUrl: './edit-call-log-form.html',
  styleUrl: './edit-call-log-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCallLogForm implements OnInit, OnDestroy  {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly callLogSvc = inject(CallLogService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationService = inject(NotificationService);

  editId: number | null = null;
  isLoading = true;

  // ── Office fields ──────────────────────────────
  officeUserName = '';
  officeLevel: number | null = null;
  contactNumber = ''; 

  existingTimeTakenMinutes = 0; // loaded from DB
  currentSessionSeconds = 0; // seconds in active session
  timerInterval: any = null;
  isTimerRunning = false;

  get officeLevelLabel(): string {
    const map: Record<number, string> = { 2: 'Circle', 3: 'Division', 4: 'Range' };
    return this.officeLevel ? (map[this.officeLevel] ?? '') : '';
  }

  // ── Users dropdown ─────────────────────────────
  users: { key: number; value: string }[] = [];

  // ── Call log data ──────────────────────────────
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
    console.log('Full URL:', this.router.url);

    this.callLogSvc.getUsersDropdown().subscribe({
      next: (data) => (this.users = data),
      error: () => {},
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.loadCallLog(this.editId);
    } else {
      this.router.navigate(['/call-logs']);
    }
  }

  // ── Load existing record ────────────────────────
  private loadCallLog(id: number): void {
    this.isLoading = true;
    this.callLogSvc.getCallLogById(id).subscribe({
      next: (data: any) => {
        this.officeUserName = data.officeUserName ?? '';
        this.officeLevel = data.officeLevel ?? null;
        this.contactNumber = data.contactNumber ?? '';
        this.callLog = {
          callDate: data.callDate ?? '',
          callStartTime: data.callStartTime ?? '',
          callEndTime: data.callEndTime ?? '',
          issueType: data.issueType ?? '',
          priority: data.priority ?? '',
          status: data.status ?? 'O',
          issueReported: data.issueReported ?? '',
          description: data.description ?? '',
          reportedTo: data.reportedTo ?? null,
          solvedBy: data.solvedBy ?? null,
          releaseDate: data.releaseDate ?? null,
          isReleased: data.isReleased ?? false,
        };
        this.existingTimeTakenMinutes = data.timeTakenMinutes ?? 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.router.navigate(['/call-logs']);
      },
    });
  }

  // ── Update ─────────────────────────────────────
  saveCallLog(): void {
    const payload = {
      id: this.editId,
      officeUserName: this.officeUserName,
      officeLevel: this.officeLevel,
      contactNumber: this.contactNumber,
      timeTakenMinutes: this.existingTimeTakenMinutes,
      ...this.callLog,
    };

    this.callLogSvc.updateCallLog(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Call log updated successfully.');
        this.router.navigate(['/call-logs']);
      },
      error: () => {
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/call-logs']);
  }

  get currentSessionDisplay(): string {
    const m = Math.floor(this.currentSessionSeconds / 60);
    const s = this.currentSessionSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  get totalTimeTakenMinutes(): number {
    return this.existingTimeTakenMinutes + Math.ceil(this.currentSessionSeconds / 60);
  }

  startTimer(): void {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    this.currentSessionSeconds = 0; // reset session counter
    this.timerInterval = setInterval(() => {
      this.currentSessionSeconds++;
      this.cdr.detectChanges();
    }, 1000);
  }

  endCall(): void {
    if (!this.isTimerRunning) return;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.isTimerRunning = false;

    // Accumulate session into existing total
    this.existingTimeTakenMinutes += Math.ceil(this.currentSessionSeconds / 60);
    this.currentSessionSeconds = 0;

    // Update end time to now
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    this.callLog.callEndTime = `${hh}:${mm}`;

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
