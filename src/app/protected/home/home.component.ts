import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IfAdminDirective } from 'src/app/@core/directives/if-admin.directive';
import { IfAuthDirective } from 'src/app/@core/directives/if-auth.directive';
import { FoldersService } from 'src/app/@core/services/folders/folders.service';
import { UsersService } from 'src/app/@core/services/users/users.service';
import { STATUS, STATUS_ENUM } from 'src/app/@core/models/status';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IfAuthDirective, IfAdminDirective, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  folders: any;
  userId: string = '';

  constructor(
    private userService: UsersService,
    private folderService: FoldersService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getFolders(currentUserId: string) {
    this.folderService.getfoldersByUserId(currentUserId).then((folder) => {
      this.folders = folder?.data;
    });
  }
  getUser() {
    this.userService.getUser().then((user) => {
      this.userId = user?.data?.[0].id;
      this.getFolders(user?.data?.[0].id);
    });
  }
  getStatutOffolder(status: STATUS_ENUM) {
    return STATUS[`${status}`];
  }
}
