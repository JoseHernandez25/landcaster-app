import { Component, ViewChild } from '@angular/core';
import { JoinerySectionComponent } from '../../components/joinery-section/joinery-section.component';
import { PaginateParameters } from '../../../interfaces/pagination.interface';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { JoineryService } from '../../services/joinery.service';
import { JoineryTypeComponent } from '../../components/joinery-type/joinery-type.component';

@Component({
  selector: 'app-joinery',
  standalone: true,
  imports: [JoinerySectionComponent, PaginationComponent, CommonModule,JoineryTypeComponent],
  templateUrl: './joinery.component.html',
  styleUrl: './joinery.component.scss',
})
export default class JoineryComponent {
  booljoinery: boolean = false;
  public term: string = '';
   joineryeTypeName: string = "";
   joineryeName: string ="";


  isJoineryTabSelected: boolean = true;
  @ViewChild('joinerySection') joinerySection!: JoinerySectionComponent;
  @ViewChild('joineryType') joineryType!: JoineryTypeComponent;

  constructor() {}

  ngOnInit(): void {}

  search(event: any) {
    // Obtener el término de búsqueda del evento
    let term = event.target.value;

    
    if (this.isJoineryTabSelected) {
      
      this.joinerySection.search(term);
    } else {
      
      this.joineryType.search(term);
    }
  }

  getJoinery() {
    this.booljoinery = false;
    this.isJoineryTabSelected = true; 
    this.joineryeTypeName = '';
    this.joineryeName = '';
  }

  getJoineryType() {
    this.booljoinery = true;
    this.isJoineryTabSelected = false; 
    this.joineryeTypeName = '';
    this.joineryeName = '';
  }

  selectJoineryType(joineryeTypeName: string) {
    this.joineryeTypeName = joineryeTypeName; //utilizo para seleccionarlo
  }
  selectJoinery(joineryeName: string) {
    this.joineryeName = joineryeName; //utilizo para seleccionarlo
  }
}
