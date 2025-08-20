import { Routes } from '@angular/router';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BlogFormComponent } from './pages/blog-form/blog-form.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'blogs', pathMatch: 'full' },
  { path: 'blogs', component: BlogListComponent },
  { path: 'blogs/new', component: BlogFormComponent },
  { path: 'blogs/:id', component: BlogDetailComponent },
  { path: 'blogs/:id/edit', component: BlogFormComponent },
  { path: '**', redirectTo: 'blogs' }
];
