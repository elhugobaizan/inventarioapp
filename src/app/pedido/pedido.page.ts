import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  public id: number = 0;
  public clienteId: number = 0;
  public usuarioId: number = 0;
  public fecha: any = null;
  public estado: number = 0;
  public _producto: any = null;

  public clientes: any[] = [];
  public usuarios: any[] = [];
  public productos: any[] = [];
  public productos_listado: any[] = [];

  public estados: any[] = [
    {
      id: 0,
      texto: 'Creado'
    },
    {
      id: 1,
      texto: 'Procesado'
    },
    {
      id: 2,
      texto: 'Finalizado'
    }
  ];

  constructor(
    public servicio: ServiciosComunesService,
    public route: ActivatedRoute,
    public alert: AlertController,
    public loading: LoadingController
  ) { 
    this.id = this.route.snapshot.params['pedidoId'];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.servicio.listClientes().subscribe((data:any) => {
      this.clientes = data.info.items;
    }, (error) => {
      this.servicio.mostrarMensaje(error, 'danger');
    });
    this.servicio.listUsuarios().subscribe((data:any) => {
      this.usuarios = data.info.items;
    }, (error) => {
      this.servicio.mostrarMensaje(error, 'danger');
    });

    if(this.id > 0) {
      this.loadInfo();
    }

    this.servicio.listProductos().subscribe((data:any) => {
      this.productos = data.info.items;
    }, (error) => {
      this.servicio.mostrarMensaje(error, 'danger');
    });
  }

  private async loadInfo() {
    let l = await this.loading.create();
    l.present();
    this.servicio.readPedido(this.id).subscribe((data: any) => {
      if (data.info.item.id > 0) {
        this.clienteId = data.info.item.cliente_id;
        this.usuarioId = data.info.item.usuario_id;
        this.fecha = (new Date(data.info.item.fecha)).toISOString();
        this.estado = data.info.item.estado;
        this.productos_listado = data.info.item.items;
      } else {
        this.servicio.mostrarMensaje('El pedido buscado no existe', 'danger');
        this.servicio.irA('pedidos');
      }
      l.dismiss();
    }, (error) => {
      this.servicio.mostrarMensaje(error, 'danger');
      l.dismiss();
    });
  }

  savePedido() {
    let saveItem = {
    id: this.id,
    clienteId: this.clienteId,
    usuarioId: this.usuarioId,
    fecha: this.fecha,
    estado: this.estado
    }

    this.servicio.createPedido(saveItem).subscribe((data:any) => {
      this.servicio.mostrarMensaje(data.mensaje, data.info.id > 0 ? 'success' : 'danger');
      this.servicio.irA('pedido/' + data.info.id);
    }, (error) => {
      this.servicio.mostrarMensaje(error, 'danger');
    });
  }

  productoSeleccionado() {
    this._producto.cantidad = 1;
    this._producto.producto_id = this._producto.id
    this.updateProducto(this._producto);
  }

  updateProducto(producto:any) {
    this.servicio.createPedidoProducto({
      pedidoId: this.id,
      productoId: producto.producto_id,
      cantidad: producto.cantidad,
      precio: producto.precio
    }).subscribe((data:any) => {
      this.loadInfo();
    }, (error) => {
      this.servicio.mostrarMensaje(error, 'danger');
    });
    this._producto = null;  
  }

  async removeProducto(prod: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    let a = await this.alert.create({
      message: 'Esta seguro que quiere borrar el producto?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create();
            l.present();
            this.servicio.deletePedidoProducto({
              pedidoId: this.id,
              productoId: prod.producto_id
            }).subscribe((data:any) => {
              this.loadInfo();
              l.dismiss();              
            }, (error) => {
              this.servicio.mostrarMensaje(error, 'danger');
              l.dismiss();
            });        
          }
        },
        {
          text: 'No',
          handler: () => {}
        }
      ]});
    a.present();  
  }

  calcularTotal() {
    let total: number = 0;
    for(let prod of this.productos_listado) {
      total += (prod.cantidad * prod.precio);
    }

    return total
  }
}
