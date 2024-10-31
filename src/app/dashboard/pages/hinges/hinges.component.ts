import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { HingesSectionComponent } from '../../components/hinges/hinges-section/hinges-section.component';
import { HingesComponentSection } from '../../components/hinges/hinges-component-section/hinges-component-section.component';
import { HingesService } from '../../services/hinges.service';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { PaginationService } from '../../../shared/pagination/pagination.service';
import { HingeTypeService } from '../../services/hingeType.service';

@Component({
  selector: 'app-hinges',
  standalone: true,
  imports: [HingesSectionComponent, PaginationComponent, CommonModule, HingesComponentSection],
  templateUrl: './hinges.component.html',
  styleUrl: './hinges.component.scss'
})
export default class HingesComponent {
  stm: boolean = false;
  public brands: any[] = []; 
  hingeName: string = ""; //utilizo para seleccionarlo
  brandSelected: string = "";
  hingeComponentName: string = "";
  public term: string = '';
  public orderByAsc: boolean = true;
  public HingeTypeId: number | string = '';
  public paginationService = inject(PaginationService);
  public HingeService = inject(HingesService);
  public Hinge: any[] = [];
  @ViewChild('inputTerm') inputTerm!: ElementRef;
  isHingesTabSelected: boolean = true;
  @ViewChild('hingesSection') hingesSection!: HingesSectionComponent;
  @ViewChild('hingesComponentSection') hingesComponentsSection!: HingesComponentSection;
  @ViewChild(HingesService) hingesService!: HingesService;
  public hingeType: any[] = [];
  private hingeTypeService = inject(HingeTypeService);
  public brandId: number | string = '';
  

  public paginateParameters: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'Hinges',
    params: {
      term: this.term,
      brandId: this.brandId,
      orderByAsc: this.orderByAsc,
      orderBy: this.orderByAsc,
    }
  };

  public paginateParametersType: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'hingeType',
  };

 

  constructor() { }

  ngOnInit(): void {
    // this.getHingesComponents();
    this.getHingeType();
    this.getBrands();
  }

  search(event: any) {
    // Obtener el término de búsqueda del evento
    let term = event.target.value;

    // Verificar si la pestaña actual es la de bisagras (hinges-tab)
    if (this.isHingesTabSelected) {
      // Si es la pestaña de bisagras, llamar a la función de búsqueda en la sección de bisagras
      this.hingesSection.search(term);
    } else {
      // Si es la pestaña de componentes, llamar a la función de búsqueda en la sección de componentes
      this.hingesComponentsSection.search(term);
    }
  }

  
  showHinges() { //cambiar a show
    this.stm = false;
    this.isHingesTabSelected = true; // Cuando se hace clic en hinges-tab, se muestra el form-select
    this.hingeComponentName = ''; // Reiniciar el valor de la variable de la pestaña de componentes
    this.hingeName = ''; // Reiniciar el valor de la variable de la pestaña de bisagras
  }
  showHingesComponents() {
    this.stm = true;
    this.isHingesTabSelected = false; // Cuando se hace clic en components-tab, se oculta el form-select
    this.hingeName = ''; // Reiniciar el valor de la variable de la pestaña de bisagras
    this.hingeComponentName = ''; // Reiniciar el valor de la variable de la pestaña de componentes
  }
  selectHinge(hingeName: string) {
    this.hingeName = hingeName; //utilizo para seleccionarlo
  }

  selectHingeComponents(hingeComponentName: string) {
    this.hingeName = hingeComponentName; //utilizo para seleccionarlo
  }

  getHinge() {
    this.HingeService.get(this.paginateParameters).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.paginationService.pagination$.next(pagination);
        this.Hinge = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  filterByBrand(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.hingesSection.filterBrand(value);
    

  }
  getBrands() {
    this.HingeService.getBrands().subscribe({
      next: (brands) => {
        console.log(brands);
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  filterByHingeType(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.hingesSection.filterType(value);

  }

  getHingeType() {
    this.hingeTypeService.get(this.paginateParametersType).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.hingeType = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}

