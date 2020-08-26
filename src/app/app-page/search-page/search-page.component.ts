import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../shared/services/search.service';
import { Entry } from 'src/app/shared/interfaces';
import { Subject } from 'rxjs';

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
  searchInput: string;
  selectedEntry: Entry;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      if (params.q) {
        this.isLoading = true;
        this.search = params.q;
        this.searchInput = this.search;

        const isSearchMode = params.mode === 'month' || params.mode === 'year';
        this.mode = isSearchMode ? params.mode : 'month';

        this.date = params.date ? new Date(+params.date) : new Date();
        if (this.mode === 'month') {
          await this.searchService.findByMonth(this.date, this.search);
        } else if (this.mode === 'year') {
          await this.searchService.findByYear(this.date, this.search);
        }
        this.isLoading = false;
      } else {
        this.router.navigate(['/app']);
      }
    });
  }

  updateSearchPage():void {
    if (this.searchInput)
      this.router.navigate(['/app', 'search', {q: this.searchInput, mode: this.mode, date: this.date.getTime()}])
  }

  async prevYear() {
    this.isLoading = true;
    this.date = new Date(this.date.getFullYear() - 1, this.date.getMonth(), 1);
    await this.searchService.findByYear(this.date, this.search);
    this.isLoading = false;
  }

  async nextYear() {
    this.isLoading = true;
    this.date = new Date(this.date.getFullYear() + 1, this.date.getMonth(), 1);
    await this.searchService.findByYear(this.date, this.search);
    this.isLoading = false;
  }

  async prevMonth() {
    this.isLoading = true;
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    await this.searchService.findByMonth(this.date, this.search);
    this.isLoading = false;
  }

  async nextMonth() {
    this.isLoading = true;
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    await this.searchService.findByMonth(this.date, this.search);
    this.isLoading = false;
  }

  closeEntry() {
    if (event.currentTarget === event.target) {
      this.selectedEntry = null;
    }
  }
}
