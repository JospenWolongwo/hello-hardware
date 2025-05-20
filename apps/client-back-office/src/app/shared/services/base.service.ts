// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { BaseEntity } from '../interfaces/base-entity';

export class BaseService {
  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  public baseurl = environment.apiBaseUrl;

  public formatEntityDate(entity: BaseEntity) {
    entity.createdAt = new Date(entity.createdAt).toLocaleString('en-GB');
    entity.updatedAt = new Date(entity.updatedAt).toLocaleString('en-GB');

    return entity;
  }
}
