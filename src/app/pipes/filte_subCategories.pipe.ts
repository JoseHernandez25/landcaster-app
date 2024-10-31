import { Pipe, PipeTransform } from '@angular/core';
import { SubCategoriesComponent } from '../dashboard/components/sub-categories/sub-categories.component';
@Pipe({
  name: 'filterSubCategory',
  standalone: true,
})
export class FilterSubCategoryPipe implements PipeTransform {
  transform(subCategoryComponents: SubCategoriesComponent[], args?: any): any {
    if (!subCategoryComponents) return null;
    if (!args) return subCategoryComponents;

    args = args.toLowerCase();
    return subCategoryComponents.filter((subCategoryComponents) => {
      return JSON.stringify(subCategoryComponents).toLowerCase().includes(args);
    });
  }
}
