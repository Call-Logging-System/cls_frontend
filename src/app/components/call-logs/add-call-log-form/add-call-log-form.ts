import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CallLogService } from '../../../services/call-log/call-log.service';

type Screen = 'incoming' | 'active' | 'review';
type TimerState = 'idle' | 'running' | 'paused' | 'stopped';

@Component({
  selector: 'app-add-call-log-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './add-call-log-form.html',
  styleUrl: './add-call-log-form.css',
})
export class AddCallLogForm implements OnInit, OnDestroy {

  // ── Navigation ──
  screen: Screen = 'incoming';
  logMode: 'live' | 'manual' = 'live';

  // ── Office ──
  officeUserName = '';
  officeLevel: number = 0;

  get officeLevelLabel(): string {
    const map: Record<number, string> = { 2: 'Circle', 3: 'Division', 4: 'Range' };
    return map[this.officeLevel] ?? '';
  }

  // ── Form data ──
  callLog = {
    officeUserName: '',
    officeLevel: 0,
    callDate: new Date().toISOString().split('T')[0],
    callStartTime: '',
    callEndTime: '',
    description: '',
    isReleased: false,
    issueReported: '',
    issueType: '',
    priority: '',
    releaseDate: null as string | null,
    reportedTo: null as number | null,
    solvedBy: null as number | null,
    status: '',
  };

  users: { key: number; value: string }[] = [];

  // ── Timer ──
  timerState: TimerState = 'idle';
  timerDisplay = '00:00:00';
  activeTimeDisplay = '';

  private elapsed = 0;
  private pausedMs = 0;
  private lastTick = 0;
  private pauseStart = 0;
  private startDate: Date | null = null;
  private intervalId: any = null;

  private pad = (n: number) => String(n).padStart(2, '0');

  private formatMs(ms: number): string {
    const s = Math.floor(ms / 1000);
    return `${this.pad(Math.floor(s / 3600))}:${this.pad(Math.floor((s % 3600) / 60))}:${this.pad(s % 60)}`;
  }

  private toTimeStr(date: Date): string {
    return `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`;
  }

  // ── Call flow actions ──

  private startTimer() {
    clearInterval(this.intervalId);
    this.lastTick = Date.now();
    this.intervalId = setInterval(() => {
      this.elapsed += Date.now() - this.lastTick;
      this.lastTick = Date.now();
      this.timerDisplay = this.formatMs(this.elapsed - this.pausedMs);
      this.cdr.markForCheck();
    }, 1000);
  }

  /** Screen 1 → Start timer → go to Screen 2 */
  startCall() {
    this.startDate = new Date();
    this.elapsed = 0;
    this.pausedMs = 0;
    this.callLog.callStartTime = this.toTimeStr(this.startDate);
    this.timerState = 'running';
    this.startTimer();
    this.screen = 'active';
  }

  /** Manual mode — skip timer, go straight to form */
  startManual() {
    this.timerState = 'stopped';
    if (this.callLog.callStartTime && this.callLog.callEndTime) {
      const toSeconds = (t: string) => {
        const parts = t.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + (parts[2] ?? 0);
      };
      const diffMs = (toSeconds(this.callLog.callEndTime) - toSeconds(this.callLog.callStartTime)) * 1000;
      this.activeTimeDisplay = diffMs > 0 ? this.formatMs(diffMs) : '—';
    }
    this.screen = 'active';
  }

  timerPause() {
    clearInterval(this.intervalId);
    this.pauseStart = Date.now();
    this.timerState = 'paused';
  }

  timerResume() {
    this.pausedMs += Date.now() - this.pauseStart;
    this.timerState = 'running';
    this.startTimer();
  }

  /** End call → stop timer → go to Screen 3 */
  endCall() {
    clearInterval(this.intervalId);
    const endDate = new Date();
    this.callLog.callEndTime = this.toTimeStr(endDate);
    this.timerState = 'stopped';
    this.activeTimeDisplay = this.formatMs(this.elapsed - this.pausedMs);
    this.screen = 'review';
  }

  // ── Summary labels for review screen ──
  get typeLabel(): string {
    return { B: '🐛 Bug', S: '🎧 Support', C: '🔄 Change', K: '⚙️ Backend' }[this.callLog.issueType] ?? '—';
  }
  get typeClass(): string {
    return { B: 'bug', S: 'support', C: 'change', K: 'backend' }[this.callLog.issueType] ?? '';
  }
  get priorityLabel(): string {
    return { H: '🔴 High', M: '🟡 Medium', L: '🟢 Low' }[this.callLog.priority] ?? '—';
  }
  get priorityClass(): string {
    return { H: 'high', M: 'medium', L: 'low' }[this.callLog.priority] ?? '';
  }
  get statusLabel(): string {
    return { O: 'Open', P: 'In Progress', D: 'Pending', C: 'Closed' }[this.callLog.status] ?? '—';
  }
  get statusClass(): string {
    return { O: 'open', P: 'progress', D: 'pending', C: 'closed' }[this.callLog.status] ?? '';
  }

  // ── Save ──
  saveCallLog() {
    const payload = {
      ...this.callLog,
      officeUserName: this.officeUserName,
      officeLevel: this.officeLevel,
    };
    this.callLogService.saveCallLog(payload).subscribe({
      next: () => this.router.navigate(['/call-logs']),
      error: (err) => console.error('Error saving call log', err),
    });
  }

  goBack() {
    this.router.navigate(['/call-logs']);
  }

  // ── Lifecycle ──
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly callLogService = inject(CallLogService);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['officeUserName']) this.officeUserName = params['officeUserName'];
      if (params['officeLevel'])    this.officeLevel = +params['officeLevel'];
    });
    this.callLogService.getUsersDropdown().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Error loading users', err),
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}