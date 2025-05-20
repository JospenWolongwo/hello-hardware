import { MatTableDataSource } from '@angular/material/table';
import type { BaseEntity } from '../shared/interfaces/base-entity';

export class EntityComponent {
  displayedColumns: string[] = [];

  data: BaseEntity[] = [];

  dataSource = new MatTableDataSource(this.data);
}
