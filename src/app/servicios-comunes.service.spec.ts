import { TestBed } from '@angular/core/testing';

import { ServiciosComunesService } from './servicios-comunes.service';

describe('ServiciosComunesService', () => {
  let service: ServiciosComunesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosComunesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
