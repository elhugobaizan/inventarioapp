import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServiciosComunesService {

  private URL_API: string = 'http://localhost/inventarioback/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toast: ToastController
  ) { }

  irA(url: string) {
    this.router.navigateByUrl(url);
  }

  objectToFormdata(obj: any, form?: any, namespace?: any) {
    let fd: any = form || new FormData();
    let formKey: any;
    for(let property in obj) {
      if(obj.hasOwnProperty(property) && obj[property]) {
        if(namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }
        if(obj[property] instanceof Date) {
          fd.append(formKey, obj[property].toISOString());
        }
        if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          this.objectToFormdata(obj[property], fd, formKey);
        } else {
          fd.append(formKey, obj[property]);
        }
      }
    }
    return fd;
  };

  async mostrarMensaje(texto:string, tipo:string = 'success') {
    let t = await this.toast.create({
      message: texto,
      color: tipo,
      duration: 3000
    });
    t.present();
  }

  /* CRUD de Productos */

  listProductos(buscar: string = '') {
    return this.http.post(this.URL_API + 'productos', this.objectToFormdata({texto: buscar}));
  }

  createProducto(item: any) {
    return this.http.post(this.URL_API + 'productos/add', this.objectToFormdata({
      id: item.id,
      nombre: item.nombre,
      codigo: item.codigo,
      stock: item.stock,
      precio: item.precio,
      activo: item.activo
    }));
  }

  readProducto(_id: number) {
    return this.http.get(this.URL_API + 'productos/' + _id);
  }

  updateProducto(item: any) {
    return this.http.post(this.URL_API + 'productos/upd/' + item.id, this.objectToFormdata({
      nombre: item.nombre,
      codigo: item.codigo,
      stock: item.stock,
      precio: item.precio,
      activo: item.activo
    }));
  }

  deleteProducto(_id: number) {
    return this.http.get(this.URL_API + 'productos/del/' + _id);
  }

  /* CRUD de clientes */

  listClientes(buscar: string = '') {
    return this.http.post(this.URL_API + 'clientes', this.objectToFormdata({texto: buscar}));
  }

  createCliente(item: any) {
    return this.http.post(this.URL_API + 'clientes/add', this.objectToFormdata({
      id: item.id,
      identificacion: item.identificacion,
      nombre: item.nombre,
      ciudad: item.ciudad,
      correo: item.correo,
      telefono: item.telefono,
      direccion: item.direccion,
      pais: item.pais
    }));
  }

  readCliente(_id: number) {
    return this.http.get(this.URL_API + 'clientes/' + _id);
  }

  updateCliente(item: any) {
    return this.http.post(this.URL_API + 'clientes/upd/' + item.id, this.objectToFormdata({
      identificacion: item.identificacion,
      nombre: item.nombre,
      ciudad: item.ciudad,
      correo: item.correo,
      telefono: item.telefono,
      direccion: item.direccion,
      pais: item.pais
    }));
  }

  deleteCliente(_id: number) {
    return this.http.get(this.URL_API + 'clientes/del/' + _id);
  }
 
}
