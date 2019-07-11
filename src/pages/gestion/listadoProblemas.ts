import { IPageGestion } from '../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'listadoProblemas',
    templateUrl: 'listadoProblemas.html',
    styles: ['listadoProblemas.scss']
})

export class ListadoProblemasComponent implements OnInit {
    @Input() titulo: String;
    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    @Input() id: any;
    public backPage: IPageGestion;
    public listaItems = [];
    public listado = [];
    public textoLibre;
    public listadoTemporal;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        this.traeDatos();
        // this.buscar();
    }


    public buscar($event) {
        this.listadoTemporal = this.listado.filter((item: any) =>
            ((item.usuario) ? (item.usuario.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '') ||
            ((item.nombreCompleto) ? (item.nombreCompleto.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '') ||
            ((item.profesion) ? (item.profesion.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '')
        );

    }

    async traeDatos() {
        this.listado = await this.datosGestion.obtenerListadoProblemas();
        this.listadoTemporal = this.listado;
    }

    verProblema(problema) {
        this.navCtrl.push(Principal, { page: 'VisualizarProblema', registroProblema: problema });
    }

}