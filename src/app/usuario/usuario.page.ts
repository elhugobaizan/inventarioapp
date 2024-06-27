import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiciosComunesService } from '../servicios-comunes.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  id: number = 0;
  usuario: string = '';
  clave: string = '';
  nombre: string = '';
  telefono: number = 0;
  correo: string = '';
  activo: boolean = true;

  constructor(
    public servicio: ServiciosComunesService,
    public route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['usuarioId'];    
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.id > 0) {
      this.servicio.readUsuario(this.id).subscribe((data:any) => {
        if(data.info.item.id > 0) {
          this.usuario = data.info.item.usuario;
          this.nombre = data.info.item.nombre;
          this.clave = data.info.item.clave;
          this.correo = data.info.item.correo;
          this.telefono = data.info.item.telefono;
          this.activo = data.info.item.usuario == 1;
        } else {
          this.servicio.mostrarMensaje('El usuario buscado no existe', 'danger');
          this.servicio.irA('usuarios');
        }
      }, (error) =>{
        this.servicio.mostrarMensaje(error, 'danger');
      });
    }
  }

  saveUsuario() {
    let saveItem = {
      id: this.id,
      usuario: this.usuario,
      nombre: this.nombre,
      clave: this.clave,
      correo: this.correo,
      telefono: this.telefono,
      activo: this.activo ? 1 : 0
    };

    if(this.id == 0) {  //add
      this.servicio.createUsuario(saveItem).subscribe((data:any) => {
        this.servicio.mostrarMensaje(data.mensaje, data.info.id > 0 ? 'success' : 'danger');
        if(data.info.id > 0) {
          this.servicio.irA('usuarios');
        }
      }, (error) => {
        this.servicio.mostrarMensaje('Algo fallo:' + error, 'danger');
      });
    } else {  //edit
      this.servicio.updateUsuario(saveItem).subscribe((data:any) => {
        if(data.info.id > 0) {
          this.servicio.irA('usuarios');
        } else {
          this.servicio.mostrarMensaje(data.mensaje, 'danger');
        }
      }, (error) => {
        this.servicio.mostrarMensaje('Algo fallo: ' + error, 'danger');
      });
    }
  }

}
