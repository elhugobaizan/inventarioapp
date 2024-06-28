import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public productos: number = 0;
  public pedidos: number = 0;
  public clientes: number = 0;
  public usuarios: number = 0;

  constructor(public servicio: ServiciosComunesService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.servicio.getTotales().subscribe((data:any) => {
      this.pedidos = data.info.pedidos;
      this.productos = data.info.productos;
      this.clientes = data.info.clientes;
      this.usuarios = data.info.usuarios;
    }, (error) => {
      this.servicio.mostrarMensaje(error, 'danger');
    });
  }
}
