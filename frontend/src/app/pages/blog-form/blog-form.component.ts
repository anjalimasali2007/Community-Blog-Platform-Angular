import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.services';
import { Blog } from '../../models/blog';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {
  id?: number;
  loading = false;
  saving = false;
  error = '';

  form!: FormGroup;   // declare form, but initialize later

  constructor(
    private fb: FormBuilder,
    private api: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ initialize form here (after fb is injected)
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });

    // ✅ handle edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : undefined;
    if (this.id) {
      this.loading = true;
      this.api.get(this.id).subscribe({
        next: (b: Blog) => {
          this.form.patchValue({
            title: b.title,
            author: b.author ?? '',
            content: b.content
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load blog.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload: Blog = this.form.value as Blog;

    const req$ = this.id
      ? this.api.update(this.id, payload)
      : this.api.create(payload);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/blogs']);
      },
      error: (err) => {
        this.saving = false;
        alert('Save failed');
        console.error(err);
      }
    });
  }
}
