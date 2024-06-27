import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  public id:number = 0;
  public identificacion:string = '';
  public nombre:string = '';
  public telefono:string = '';
  public correo:string = '';
  public direccion:string = '';
  public pais:string = '';
  public ciudad:string = '';

  constructor(
    public servicio: ServiciosComunesService,
    public route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['clienteId'];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.id > 0) {
      this.servicio.readCliente(this.id).subscribe((data:any) => {
        if(data.info.item.id > 0) {
          this.identificacion = data.info.item.identificacion;
          this.nombre = data.info.item.nombre;
          this.telefono = data.info.item.telefono;
          this.correo = data.info.item.correo;
          this.direccion = data.info.item.direccion;
          this.pais = data.info.item.pais;
          this.ciudad = data.info.item.ciudad;
        } else {
          this.servicio.mostrarMensaje('El cliente buscado no existe', 'danger');
          this.servicio.irA('clientes');
        }
      }, (error) => {
        this.servicio.mostrarMensaje(error, 'danger');
      });
    }
  }
  
  saveCliente() {
    if(this.id == 0) {
      this.servicio.createCliente({
        id: this.id,
        identificacion: this.identificacion,
        nombre: this.nombre,
        ciudad: this.ciudad,
        correo: this.correo,
        telefono: this.telefono,
        direccion: this.direccion,
        pais: this.pais,
      }).subscribe((data: any) => {
        this.servicio.mostrarMensaje(data.mensaje, data.info.id > 0 ? 'success' : 'danger');
        if(data.info.id > 0) {
          this.servicio.irA('clientes');
        }
      }, (error) => {
        this.servicio.mostrarMensaje('Algo fallo' + error, 'danger');
      });
    } else {
      this.servicio.updateCliente({
        id: this.id,
        identificacion: this.identificacion,
        nombre: this.nombre,
        ciudad: this.ciudad,
        correo: this.correo,
        telefono: this.telefono,
        direccion: this.direccion,
        pais: this.pais,
      }).subscribe((data: any) => {
        if(data.info.id > 0) {
          this.servicio.irA('clientes');
        } else {
          this.servicio.mostrarMensaje(data.mensaje, data.info.id > 0 ? 'success' : 'danger');
        }
      }, (error) => {
        this.servicio.mostrarMensaje('Algo fallo' + error, 'danger');
      });
    }
  }
}
