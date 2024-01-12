import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IfAdminDirective } from 'src/app/@core/directives/if-admin.directive';
import { IfAuthDirective } from 'src/app/@core/directives/if-auth.directive';
import { FoldersService } from 'src/app/@core/services/folders/folders.service';
import { UsersService } from 'src/app/@core/services/users/users.service';

enum StatusFolder {
  'in_progress' = 'En cours',
  'done' = 'Valider',
}
const STATUS: { [k: string]: string } = {
  in_progress: 'En cours',
  done: 'Complete',
};
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IfAuthDirective, IfAdminDirective, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  folders: any;
  private userId: any;

  constructor(
    private userService: UsersService,
    private folderService: FoldersService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getFolders(userId: string) {
    this.folderService.getfoldersByUserId(userId).then((folder) => {
      this.folders = folder?.data;
    });
  }

  getUser() {
    this.userService.getUser().then((user) => {
      this.userId = user?.data?.[0].id;
      this.getFolders(user?.data?.[0].id);
    });
  }

  getStatutOffolder(status: StatusFolder) {
    return STATUS[`${status}`];
  }
}
