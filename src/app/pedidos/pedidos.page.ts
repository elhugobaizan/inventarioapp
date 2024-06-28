import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  public pedidos: any[] = [];
  public total: number = 0;
  public texto: string = '';
  public n_productos = 0;

  constructor(
    public servicio: ServiciosComunesService,
    public loading: LoadingController,
    public alert: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.listPedidos();
  }

  ////////////////////////////

  async listPedidos() {
    let l = await this.loading.create();
    l.present();
    this.servicio.listPedidos(this.texto)
    .subscribe((data: any) => {
      this.pedidos = data.info.items;
      this.total = data.total;
      l.dismiss();
    }, (error: any) => {
      console.log(error);
      l.dismiss();
    });
    let lista: Array<number> = [];
    return lista;
  }

  async removePedido(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    let a = await this.alert.create({
      message:'seguro que queres eliminar?',
      buttons: [
        {
          text:'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: "Borrando..."
            });
            l.present();
            this.servicio.deletePedido(item.id)
            .subscribe((data: any) => {
              this.listPedidos();
              l.dismiss();
            }, (error: any) => {
              console.log(error);
              l.dismiss();
            });
          }
        },
        {
          text:'No',
          handler: () => {}
        }
      ]
    });
    a.present();
  }

  editPedido(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servicio.irA("pedido/" + item.id);
  }

}
