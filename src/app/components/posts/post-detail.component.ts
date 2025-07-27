import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post: any | undefined;

  constructor(private route: ActivatedRoute, private data: DataService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.post = this.data.getPostById(id);
  }
}
