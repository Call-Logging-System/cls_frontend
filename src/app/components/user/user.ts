import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserModel } from '../../models/user/user.model';
import { NotificationService } from '../../services/common/notification.service';
import { UserService } from '../../services/user/user.service';
import { ConfirmDialog } from '../call-logs/confirm-dialog/confirm-dialog';
import { AddUserDialog } from './add-user-dialog/add-user-dialog';
import { EditUserDialog } from './edit-user-dialog/edit-user-dialog';

@Component({
  selector: 'app-user',
  imports: [MatPaginatorModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  displayedColumns = ['index', 'userName', 'email', 'edit', 'delete'];

  dataSource = new MatTableDataSource<UserModel>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
      },
      error: (err) => {
        console.error('Error loading users', err);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialog, {
      panelClass: 'cls-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return; // Dialog was cancelled

      this.notificationService.showSuccess('User added successfully!');
      this.loadUsers(); // Refresh the user list
    });
  }

  openEditDialog(element: UserModel): void {
    const dialogRef = this.dialog.open(EditUserDialog, {
      panelClass: 'cls-dialog',
      disableClose: true,
      data: { user: element },
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return; // Dialog was cancelled

      this.notificationService.showSuccess('User updated successfully!');
      this.loadUsers(); // Refresh the user list
    });
  }

  openDeleteDialog(element: UserModel) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'cls-dialog', // for global dialog styling
      disableClose: true, // must click a button, not backdrop
      data: { issue: element.userName },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.userService.deleteUser(element.userId).subscribe({
        next: () => {
          this.loadUsers();
          this.notificationService.showSuccess('User deleted successfully.');
        },
        error: () => {},
      });
    });
  }

}
