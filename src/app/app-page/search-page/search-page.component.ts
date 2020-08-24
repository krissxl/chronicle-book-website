import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../shared/services/search.service';

type searchMode = 'month' | 'year';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  search: string;
  mode: searchMode;
  date: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      if (params.q) {
        this.search = params.q;
        const isSearchMode = params.mode === 'month' || params.mode === 'year';
        this.mode = isSearchMode ? params.mode : 'month';

        this.date = params.date ? new Date(+params.date) : new Date();
        if (this.mode === 'month') {
          await this.searchService.findByMonth(this.date, this.search);
        } else if (this.mode === 'year') {
          await this.searchService.findByYear(this.date, this.search);
        }
      } else {
        this.router.navigate(['/app']);
      }
    });
  }

  async prevYear() {
    this.date = new Date(this.date.getFullYear() - 1, this.date.getMonth(), 1);
    await this.searchService.findByYear(this.date, this.search);
  }

  async nextYear() {
    this.date = new Date(this.date.getFullYear() + 1, this.date.getMonth(), 1);
    await this.searchService.findByYear(this.date, this.search);
  }

  async prevMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    await this.searchService.findByMonth(this.date, this.search);
  }

  async nextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    await this.searchService.findByMonth(this.date, this.search);
  }
}
