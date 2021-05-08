import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../shared/services/search.service';
import { Entry } from 'src/app/shared/interfaces';
import { trigger, transition, useAnimation } from '@angular/animations';
import { inListAnimation } from 'src/app/shared/animations';
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  animations: [
    trigger('inOutList', [
      transition(':enter', [
        useAnimation(inListAnimation, { params: { time: '250ms' } }),
      ]),
    ]),
  ],
})
export class SearchPageComponent implements OnInit {
  search: string;
  date: Date;
  searchInput: string;
  selectedEntry: Entry;
  isLoading: boolean = true;
  isTagSearch: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.isLoading = true;
      if (params.q) {
        this.isTagSearch = false;
        this.search = params.q;
        this.searchInput = this.search;

        this.date = params.date ? new Date(+params.date) : new Date();
        this.fetchData();
      } else if (params.tag) {
        this.isTagSearch = true;

        this.search = params.tag;
        this.date = params.date ? new Date(+params.date) : new Date();
        this.fetchData();
      } else {
        this.router.navigate(['/app']);
      }
      document.title =
        '"' + this.search + '"' + ' search query - Chronicle Book';
      this.isLoading = false;
    });
  }

  async fetchData(): Promise<void> {
    await this.searchService.findByYear(
      this.date,
      this.search,
      this.isTagSearch
    );
  }

  updateSearchPage(): void {
    if (this.searchInput)
      this.router.navigate([
        '/app',
        'search',
        { q: this.searchInput, date: this.date.getTime() },
      ]);
  }

  async prevYear() {
    this.isLoading = true;
    this.date = new Date(this.date.getFullYear() - 1, this.date.getMonth(), 1);
    await this.searchService.findByYear(
      this.date,
      this.search,
      this.isTagSearch
    );
    this.isLoading = false;
  }

  async nextYear() {
    this.isLoading = true;
    this.date = new Date(this.date.getFullYear() + 1, this.date.getMonth(), 1);
    await this.searchService.findByYear(
      this.date,
      this.search,
      this.isTagSearch
    );
    this.isLoading = false;
  }

  closeEntry() {
    if (event.currentTarget === event.target) {
      this.selectedEntry = null;
    }
  }
}
