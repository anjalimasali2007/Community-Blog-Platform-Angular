import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.services';
import { Blog } from '../../models/blog';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  filtered: Blog[] = [];
  q = '';
  loading = false;
  error = '';

  constructor(private api: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.error = '';
    this.api.list().subscribe({
      next: (data) => {
        this.blogs = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const q = this.q.trim().toLowerCase();
    if (!q) {
      this.filtered = this.blogs;
      return;
    }
    this.filtered = this.blogs.filter(b =>
      (b.title ?? '').toLowerCase().includes(q) ||
      (b.author ?? '').toLowerCase().includes(q) ||
      (b.content ?? '').toLowerCase().includes(q)
    );
  }

  clearSearch(): void {
    this.q = '';
    this.applyFilter();
  }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this blog?')) return;
    this.api.remove(id).subscribe({
      next: () => this.fetch(),
      error: (err) => {
        alert('Delete failed');
        console.error(err);
      }
    });
  }

  trackById = (_: number, b: Blog) => b.id;
}
