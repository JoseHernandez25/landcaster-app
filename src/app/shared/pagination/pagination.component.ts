import { Component, Input, inject } from '@angular/core';
import { PaginationService } from './pagination.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { PaginateParameters, Pagination, StatusPage } from '../../interfaces/pagination.interface';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  private paginationService = inject(PaginationService);
  public totalPages!: number;
  public totalRecords!: number;
  private pageSize!: number;
  public pageNumber!: number;
  public prev!: StatusPage;
  public next!: StatusPage;
  public pages: number[] = [];
  @Input() paginateParameters!: PaginateParameters;
  @Input() paginationData!: Pagination | null;

  constructor(protected sanitizer: DomSanitizer, paginationService: PaginationService) {
  }

  ngOnInit(): void {
    this.paginationService.pagination$.subscribe(pagination => {
      this.totalPages = pagination.totalPages;
      this.pageSize = pagination.pageSize;
      this.pageNumber = pagination.pageNumber
      this.prev = pagination.prev;
      this.next = pagination.next;
      this.totalRecords = pagination.totalCount;
      this.getPages();
    });
  }



  onPage(pageNumber: number) {
    this.paginateParameters.page = pageNumber;    
    this.paginationService.getData(this.paginateParameters);
  }


  getPages() {
    const totalPages = this.totalPages;
    const thisPage = this.pageNumber;
    const pagesToShow = 10;
    const pages: number[] = [];
    pages.push(thisPage);
    for (let i = 0; i < pagesToShow - 1; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
          // console.log('pushing', Math.min.apply(null, pages) - 1, 'onto array');
        }
      }

      if (pages.length < pagesToShow) {
        if (Math.max.apply(null, pages) < totalPages) {
          pages.push(Math.max.apply(null, pages) + 1);
          // console.log('pushing', Math.max.apply(null, pages) + 1, 'onto array');
        }
      }
    }
    pages.sort((a, b) => a - b);
    this.pages = pages;
  }

  prevPage() {
    this.pageNumber--;
    this.paginateParameters.page =  this.pageNumber;
    this.paginationService.getData(this.paginateParameters);

  }
  nextPage() {
    this.pageNumber++;
    this.paginateParameters.page =  this.pageNumber;
    this.paginationService.getData(this.paginateParameters);
  }

  getMin(): number {
    return ((this.pageSize * this.pageNumber) - this.pageSize) + 1;
  }

  getMax(): number {
    let max = this.pageSize * this.pageNumber;
    if (max > this.totalPages) {
      max = this.totalPages;
    }
    return max;
  }
}
