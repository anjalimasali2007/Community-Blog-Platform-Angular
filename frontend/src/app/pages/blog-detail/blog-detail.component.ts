import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.services';
import { Blog } from '../../models/blog';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog?: Blog;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private api: BlogService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'Invalid blog id'; return; }
    this.loading = true;
    this.api.get(id).subscribe({
      next: (b) => { this.blog = b; this.loading = false; },
      error: (err) => { this.error = 'Failed to load blog.'; console.error(err); this.loading = false; }
    });
  }
}
