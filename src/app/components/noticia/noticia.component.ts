import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, ToastController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() idx: number;
  @Output() refreshEventEmitter = new EventEmitter<Article>();

  constructor(
    private _iab: InAppBrowser,
    private _actionSheetController: ActionSheetController,
    private _socialSharing: SocialSharing,
    private _dataLocalService: DataLocalService,
    private _toastController: ToastController,
    private _platform: Platform
  ) { }

  ngOnInit() {}

  abrirNoticia() {
    this._iab.create(`${this.noticia.url}`, '_system');
  }

  async openActionSheet() {
    const actionSheet = await this._actionSheetController.create({
      buttons: [
        {
          text: 'Compartir',
          icon: 'share',
          cssClass: 'action-dark',
          handler: () => {
            this.shareNews();
          }
        }, {
          text: (!!this.noticia.isFavorite ? 'Quitar Favorito' : 'Guardar Favorito'),
          icon: (!!this.noticia.isFavorite ? 'star' : 'star-outline'),
          cssClass: 'action-dark',
          handler: async () => {
            if (!!this.noticia.isFavorite) {
              this.noticia.isFavorite = false;
              await this._dataLocalService.eliminarNoticiasFavoritos(this.noticia);
              this.refreshEventEmitter.emit(this.noticia);
            } else {
              this.noticia.isFavorite = true;
              await this._dataLocalService.guardarNoticia(this.noticia);
            }
            this.showToast(!!this.noticia.isFavorite ? 'Favorito Agregado' : 'Favorito Eliminado');
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          cssClass: 'action-dark',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async showToast(mensaje: string, duracion?: number) {
    duracion = duracion || 1500;
    const toast = await this._toastController.create({
      message: mensaje,
      duration: duracion,
      cssClass: 'favorito-toast',
      mode: 'ios',
      animated: true
    });
    toast.present();
  }

  shareNews() {
    if (this._platform.is('cordova')) {
      this._socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        null,
        this.noticia.url
      );
    } else {
      if (navigator['share']) {
        navigator['share']({
          title: this.noticia.title,
          text: this.noticia.description,
          url: this.noticia.url,
        }).then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        this.showToast('Función no soportada por el navegador', 2000);
      }
    }
  }
}
