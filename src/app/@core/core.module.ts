import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupabaseService } from './services/supabase/supabase.service';
import { UsersService } from './services/users/users.service';
import { QuestionsService } from './services/questions/questions.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [SupabaseService, UsersService, QuestionsService],
})
export class CoreModule {}
