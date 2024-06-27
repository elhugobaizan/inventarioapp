import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';
import { LoadingController } from '@ionic/angular';
import { IonItemSliding } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  public clientes:any[] = [];
  public total:number = 0;
  public texto: string = '';

  constructor(
    public servicio: ServiciosComunesService,
    public loading: LoadingController,
    public alert: AlertController
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.listClientes();
  }



  async listClientes() {
    let l = await this.loading.create();
    l.present();
    this.servicio.listClientes().subscribe(
      (data:any) => {
        this.clientes = data.info.items;
        this.total = data.total;
        l.dismiss();
      }, (error) => {
        console.log(error);
        l.dismiss();
      });
      let lista: Array<number> = [];
      return lista;
  }

  async removeCliente(item: any, ionItemSliding: IonItemSliding) {
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
            this.servicio.deleteCliente(item.id)
            .subscribe((data: any) => {
              this.listClientes();
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

}
