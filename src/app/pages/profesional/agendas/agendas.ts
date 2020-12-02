import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from 'src/providers/agendas';
import { AuthProvider } from 'src/providers/auth/auth';
import { AgendaDetallePage } from '../../../pages/profesional/agendas/agenda-detalle/agenda-detalle';
import { Router } from '@angular/router';

@Component({
    selector: 'app-agendas',
    templateUrl: 'agendas.html'
})
export class AgendasPage implements OnDestroy {
    agendas: any[] = null;

    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private router: Router,
        public agendasProvider: AgendasProvider,
        public authProvider: AuthProvider,
        public platform: Platform) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.getAgendas();
        });

        this.getAgendas();
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    getAgendas() {
        const params = {
            estados: ['publicada', 'disponible'],
            idProfesional: this.authProvider.user.profesionalId,
            fechaDesde: moment(new Date()).startOf('day').toISOString()
        };

        this.agendasProvider.get(params).then((data: any[]) => {
            this.agendas = data;
        });
    }

    onCancelAgenda($event) {
        // console.log('onCancelAgenda');
    }

    verDetalle(agenda) {
        this.router.navigate(['/profesional/agenda-detalle'], {queryParams: {agenda: JSON.stringify(agenda)}});
    }

}