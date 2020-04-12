import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  constructor(
    private _storage: Storage
  ) { }

  async guardarNoticia(noticia: Article) {
    const noticiasLoad = await this.cargarNoticiasFavoritos();
    const noticias = noticiasLoad.filter((noticiaSave: Article) => noticiaSave.title.toLowerCase() !== noticia.title.toLowerCase());
    noticias.push(noticia);
    this._storage.set('favoritos', noticias);
  }

  async cargarNoticiasFavoritos() {
    const noticias = await this._storage.get('favoritos');
    return noticias || [];
  }

  async eliminarNoticiasFavoritos(noticia: Article) {
    const noticiasLoad = await this.cargarNoticiasFavoritos();
    const noticias = noticiasLoad.filter((noticiaSave: Article) => noticiaSave.title.toLowerCase() !== noticia.title.toLowerCase());
    this._storage.set('favoritos', noticias);
  }
}
