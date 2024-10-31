import { Component, inject, ViewChild } from '@angular/core';
import { DrawerSlideService } from '../../services/drawerSlide.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { DrawerSlidesSectionComponent } from '../../components/drawerSlides/drawer-slides-section/drawer-slides-section/drawer-slides-section.component';
import { DrawerSlideComponentsSectionComponent } from '../../components/drawerSlides/drawer-slide-components-section/drawer-slide-components-section/drawer-slide-components-section.component';
import { DrawerSlideTypeService } from '../../services/drawerSlideType.service';
import { PaginateParameters } from '../../../interfaces/pagination.interface';


@Component({
  selector: 'app-drawer-slides',
  standalone: true,
  imports: [PaginationComponent, CommonModule, DrawerSlidesSectionComponent, DrawerSlideComponentsSectionComponent],
  templateUrl: './drawer-slides.component.html',
  styleUrl: './drawer-slides.component.scss'
})
export default class DrawerSlidesComponent {
  stm: boolean = false;
  isDrawerSlideTabSelected: boolean = true;
  @ViewChild('drawerSlidesSection') drawerSlidesSection!: DrawerSlidesSectionComponent;
  @ViewChild('drawerSlideComponentsSection') drawerSlideComponentsSection!: DrawerSlideComponentsSectionComponent;
  drawerSlideName: string = ""; //utilizo para seleccionarlo
  drawerSlideComponentName: string = "";
  public drawerSlideType: any[] = [];
  public brands: any[] = []; 
  public drawerSlideService = inject(DrawerSlideService);
  private drawerSlideTypeService = inject(DrawerSlideTypeService);

  






  constructor() { }


  ngOnInit(): void {
    // this.getHingesComponents();
    this.getBrands();
    this.getDrawerSlideType();
  }

  search(event: any) {
    // Obtener el término de búsqueda del evento
    let term = event.target.value;

    // Verificar si la pestaña actual es la de bisagras (hinges-tab)
    if (this.isDrawerSlideTabSelected) {
      // Si es la pestaña de bisagras, llamar a la función de búsqueda en la sección de bisagras
      this.drawerSlidesSection.search(term);
    } else {
      // Si es la pestaña de componentes, llamar a la función de búsqueda en la sección de componentes
      this.drawerSlideComponentsSection.search(term);
      
    }
  }
  public paginateParametersType: PaginateParameters = {
    page_size: 20,
    page: 1,
    urlPrefix: 'hingeType',
  };

 

  selectDrawerSlide(drawerSlideName: string) {
    this.drawerSlideName = drawerSlideName; //utilizo para seleccionarlo
  }

  selectDrawerSlideComponents(drawerSlideComponentName: string) {
    this.drawerSlideComponentName = drawerSlideComponentName; //utilizo para seleccionarlo
  }


  getDrawerSlide() {
    this.stm = false;
    this.isDrawerSlideTabSelected = true;
    this.drawerSlideComponentName = ''; // Reiniciar el valor de la variable de la pestaña de componentes
    this.drawerSlideName = ''; // Reiniciar el valor de la variable de la pestaña de bisagras

  }

  getDrawerSlideComponents() {
    this.stm = true;
    this.isDrawerSlideTabSelected = false;
    this.drawerSlideName = ''; // Reiniciar el valor de la variable de la pestaña de bisagras
    this.drawerSlideComponentName = ''; // Reiniciar el valor de la variable de la pestaña de componentes
  }

  filterByDrawerSlideType(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.drawerSlidesSection.filterType(value);

  }

  filterByBrand(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.drawerSlidesSection.filterBrand(value);
    

  }
  getBrands() {
    this.drawerSlideService.getBrands().subscribe({
      next: (brands) => {
        console.log(brands);
        this.brands = brands;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  
  getDrawerSlideType() {
    this.drawerSlideTypeService.get(this.paginateParametersType).subscribe({
      next: (pagination) => {
        console.log(pagination);
        this.drawerSlideType = pagination.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

