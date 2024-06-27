import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  public id: number = 0;
  public codigo: string = '';
  public nombre: string = '';
  public stock: number = 0;
  public precio: number = 0;
  public activo: boolean = true;

  constructor(
    public servicio: ServiciosComunesService,
    public route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['productoId'];
  }

  ngOnInit() { }

  ionViewWillEnter() {
    if(this.id > 0) {
      this.servicio.readProducto(this.id).subscribe((data:any) => {
        if(data.info.item.id > 0) {
          this.codigo = data.info.item.codigo;
          this.nombre = data.info.item.nombre;
          this.stock = data.info.item.stock;
          this.precio = data.info.item.precio;
          this.activo = data.info.item.activo == 1;
        } else {
          this.servicio.mostrarMensaje('El producto buscado no existe', 'danger');
          this.servicio.irA('productos');
        }
      }, (error) => {
        this.servicio.mostrarMensaje(error, 'danger');
      });
    }
  }

  saveProducto() {
    if(this.id == 0) {
      this.servicio.createProducto({
        id: this.id,
        codigo: this.codigo,
        nombre: this.nombre,
        stock: this.stock,
        precio: this.precio,
        activo: this.activo ? 1 : 0
      }).subscribe((data: any) => {
        this.servicio.mostrarMensaje(data.mensaje, data.info.id > 0 ? 'success' : 'danger');
        if(data.info.id > 0) {
          this.servicio.irA('productos');
        }
      }, (error) => {
        this.servicio.mostrarMensaje('Algo fallo' + error, 'danger');
      });
    } else {
      this.servicio.updateProducto({
        id: this.id,
        codigo: this.codigo,
        nombre: this.nombre,
        stock: this.stock,
        precio: this.precio,
        activo: this.activo ? 1 : 0
      }).subscribe((data: any) => {
        this.servicio.mostrarMensaje(data.mensaje, data.info.id > 0 ? 'success' : 'danger');
        if(data.info.id > 0) {
          this.servicio.irA('productos');
        }
      }, (error) => {
        this.servicio.mostrarMensaje('Algo fallo' + error, 'danger');
      });
    }
  }
}
