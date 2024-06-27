import { Component, OnInit } from '@angular/core';
import { ServiciosComunesService } from '../servicios-comunes.service';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  public usuarios:any[] = [];
  public total:number = 0;
  public texto: string = '';

  constructor(
    public servicio: ServiciosComunesService,
    public loading: LoadingController,
    public alert: AlertController    
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.listUsuarios();
  }

  async listUsuarios() {
    let l= await this.loading.create();
    l.present();
    this.servicio.listUsuarios(this.texto).subscribe(
      (data:any) => {
        this.usuarios = data.info.items;
        this.total = data.total;
        l.dismiss();
      },(error) => {
        this.servicio.mostrarMensaje(error, 'danger');
        l.dismiss();
      });
  }

  async removeUsuario(item:any, ionItemSliding: IonItemSliding){
    ionItemSliding.close();
    let a = await this.alert.create({
      message: 'seguro que quieres eliminar?',
      buttons: [{
        text: 'Si',
        handler: async () => {
          let l = await this.loading.create();
          l.present();
          this.servicio.deleteUsuario(item.id).subscribe(
            (data:any) => {
              l.dismiss();
              this.listUsuarios();
              this.servicio.mostrarMensaje('Usuario eliminado', 'success');
            },
            (error) => {
              l.dismiss();
              this.servicio.mostrarMensaje(error, 'danger');
            }
          );
        }
      },{
        text: 'No',
        handler: () => {}
      }]
    });
    a.present();
  }

  editUsuario(item:any, ionItemSliding: IonItemSliding){
    ionItemSliding.close();
    this.servicio.irA("usuario/" + item.id);
  }
}
