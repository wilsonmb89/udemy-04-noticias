import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NEWS_PATH } from '../utils/constants/servicePath.constant';
import { NEWS_CONSTANTS } from '../utils/constants/utilData.constant';
import { environment } from '../../environments/environment';

const headers = new HttpHeaders({
  'X-Api-Key': environment.newsApiKey
});

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  private getHttp<T>(url: string) {
    return this._httpClient.get<T>(url, {headers});
  }

  private getTopHeadLinesUrl() {
    return `${NEWS_PATH.NEWS_API_URL}${NEWS_PATH.TOP_HEADLINES}`;
  }

  getColTopHeadlines(page?: number) {
    page = page || 1;
    return this.getHttp<ResponseNewsApi>(
      this.getTopHeadLinesUrl()
      .concat(`${NEWS_PATH.COUNTRY_PARAM}${NEWS_CONSTANTS.COUNTRIES.COL}`)
      .concat(`&${NEWS_PATH.PAGE_PARAM}${page}`)
    );
  }

  getColTopHeadlinesByCategory(category: string, page?: number) {
    page = page || 1;
    category = category || 'general';
    return this.getHttp<ResponseNewsApi>(
      this.getTopHeadLinesUrl()
      .concat(`${NEWS_PATH.COUNTRY_PARAM}${NEWS_CONSTANTS.COUNTRIES.COL}`)
      .concat(`&${NEWS_PATH.CATEGORY_PARAM}${category}`)
      .concat(`&${NEWS_PATH.PAGE_PARAM}${page}`)
    );
  }
}
