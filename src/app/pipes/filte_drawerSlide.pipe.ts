import { Pipe, PipeTransform } from '@angular/core';
import { DrawerSlideComponent } from '../interfaces/models/drawerSlideComponents.interface';
import { SubCategoriesComponent } from '../dashboard/components/sub-categories/sub-categories.component';
@Pipe({
  name: 'filterDrawerSlideComponent',
  standalone: true,
})
export class FilterDrawerSlideComponentPipe implements PipeTransform {
  transform(drawerSlideComponents: DrawerSlideComponent[], args?: any): any {
    if (!drawerSlideComponents) return null;
    if (!args) return drawerSlideComponents;

    args = args.toLowerCase();
    return drawerSlideComponents.filter((drawerSlideComponents) => {
      return JSON.stringify(drawerSlideComponents).toLowerCase().includes(args);
    });
  }
}
