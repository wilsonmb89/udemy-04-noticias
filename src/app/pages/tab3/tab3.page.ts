import { Component, OnInit } from '@angular/core';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  noticias: Article[] = [];

  constructor(
    public _dataLocalService: DataLocalService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarNoticiasFavoritos();
  }

  async cargarNoticiasFavoritos() {
    this.noticias = await this._dataLocalService.cargarNoticiasFavoritos();
  }

  actualizarFavoritos(ev: Article) {
    this.cargarNoticiasFavoritos();
  }
}
