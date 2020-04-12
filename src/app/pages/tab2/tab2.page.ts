import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NEWS_CONSTANTS } from 'src/app/utils/constants/utilData.constant';
import { IonSegment, IonInfiniteScroll } from '@ionic/angular';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Subscription } from 'rxjs';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  @ViewChild('infiniteScrollNoticias', {static: false}) infiniteScrollNoticias: IonInfiniteScroll;
  @ViewChild('categoriasSegment', {static: true}) segmentCategorias: IonSegment;

  categorias = NEWS_CONSTANTS.GATEGORIES;
  noticias: Article[] = [];
  noticiasServiceSusc: Subscription;
  contPageNoticias: number;

  constructor(
    private _noticiasService: NoticiasService,
    private _dataLocal: DataLocalService
  ) {}

  ngOnInit() {
    this.segmentCategorias.value = this.categorias[0].key;
    this.contPageNoticias = 1;
    this.searchNews(this.segmentCategorias.value);
  }

  ngOnDestroy() {
    if (!!this.noticiasServiceSusc) {
      this.noticiasServiceSusc.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.syncFavoritos();
  }

  setTopic(ev: any) {
    this.noticias = [];
    this.contPageNoticias = 1;
    this.infiniteScrollNoticias.disabled = false;
    this.searchNews(ev.detail.value);
  }

  searchNews(category: string) {
    const page = this.contPageNoticias;
    this.noticiasServiceSusc = this._noticiasService.getColTopHeadlinesByCategory(category, page).subscribe(
      res => {
        if (res.articles.length > 0) {
          this.noticias.push(...res.articles);
          this.syncFavoritos();
        } else {
          this.infiniteScrollNoticias.disabled = true;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  loadNextPage(ev: any) {
    this.contPageNoticias++;
    setTimeout(() => {
      this.searchNews(this.segmentCategorias.value);
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
      this.contPageNoticias = 1;
      this.infiniteScrollNoticias.disabled = false;
      this.searchNews(this.segmentCategorias.value);
      ev.target.complete();
    }, 1500);
  }
}
