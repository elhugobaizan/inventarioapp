import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  public productos: any[] = [];
  public total: number = 0;
  public texto: string = '';

  constructor(
    public servicio: ServiciosComunesService,
    public loading: LoadingController,
    public alert: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.listProductos();
  }

  ////////////////////////////

  async listProductos() {
    let l = await this.loading.create();
    l.present();
    this.servicio.listProductos(this.texto)
    .subscribe((data: any) => {
      this.productos = data.info.items;
      this.total = data.total;
      l.dismiss();
    }, (error: any) => {
      console.log(error);
      l.dismiss();
    });
    let lista: Array<number> = [];
    return lista;
  }

  async removeProducto(item: any, ionItemSliding: IonItemSliding) {
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
            this.servicio.deleteProducto(item.id)
            .subscribe((data: any) => {
              this.listProductos();
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

  editProducto(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servicio.irA("producto/" + item.id);
  }

}
