import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupabaseService } from './services/supabase/supabase.service';
import { UsersService } from './services/users/users.service';
import { QuestionsService } from './services/questions/questions.service';
import { FoldersService } from './services/folders/folders.service';
import { AnwserService } from './services/anwser/anwser.service';
import { CategoriesService } from './services/categories/categories.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    SupabaseService,
    UsersService,
    QuestionsService,
    FoldersService,
    AnwserService,
    CategoriesService,
  ],
})
export class CoreModule {}
