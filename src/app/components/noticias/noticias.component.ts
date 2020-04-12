import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
})
export class NoticiasComponent implements OnInit {

  @Input() noticias: Article[];
  @Output() refreshEventEmitter = new EventEmitter<Article>();

  constructor() { }

  ngOnInit() {}

  emmitRefresh(ev: Article) {
    this.refreshEventEmitter.emit(ev);
  }

}
