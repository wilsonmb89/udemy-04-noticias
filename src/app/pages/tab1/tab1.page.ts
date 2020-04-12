import { Component, OnInit, ViewChild } from '@angular/core';
import { NoticiasService } from 'src/app/services/noticias.service';
import { map } from 'rxjs/operators';
import { IonInfiniteScroll } from '@ionic/angular';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('infiniteScrollNews', {static: false}) infiniteScrollNews: IonInfiniteScroll;

  noticias: Article[] = [];
  contPageNoticias: number;

  constructor(
    private _noticiasService: NoticiasService,
    private _dataLocal: DataLocalService
  ) {}

  ngOnInit(): void {
    this.contPageNoticias = 1;
    this.callNewsService();
  }

  ionViewWillEnter() {
    this.syncFavoritos();
  }

  callNewsService() {
    const page = this.contPageNoticias;
    this._noticiasService.getColTopHeadlines(page).subscribe(
      res => {
        if (res.articles.length > 1) {
          this.noticias.push(...res.articles);
          this.syncFavoritos();
        } else {
          this.infiniteScrollNews.disabled = true;
        }
      },
      error => {
        console.error('Error:', JSON.stringify(error));
      }
    );
  }

  loadNextPage(ev: any) {
    this.contPageNoticias++;
    setTimeout(() => {
      this.callNewsService();
      ev.target.complete();
    }, 1500);
  }

  async syncFavoritos() {
    if (!!this.noticias && this.noticias.length > 0) {
      const favoritos = await this._dataLocal.cargarNoticiasFavoritos();
      this.noticias.map(
        noticia => {
          const favTemp = favoritos.find((favNoticia: Article) => favNoticia.title.toLowerCase() === noticia.title.toLowerCase());
          noticia.isFavorite = !!favTemp;
          return noticia;
        }
      );
    }
  }

  doRefresh(ev: any) {
    setTimeout(() => {
      this.noticias = [];
      this.callNewsService();
      ev.target.complete();
    }, 1500);
  }
}
