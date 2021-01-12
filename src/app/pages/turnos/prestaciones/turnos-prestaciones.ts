import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
// providers
import { ToastProvider } from 'src/providers/toast';
import { GeoProvider } from 'src/providers/geo-provider';
import { AgendasProvider } from 'src/providers/agendas';
import { Router } from '@angular/router';
import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { Storage } from '@ionic/storage';
import { TurnosProvider } from 'src/providers/turnos';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';

@Component({
    selector: 'app-turnos-prestaciones',
    templateUrl: 'turnos-prestaciones.html'
})

export class TurnosPrestacionesPage implements OnInit, OnDestroy {
    private onResumeSubscription: Subscription;
    private turnosActuales: any = [];
    public prestacionesTurneables: any = [];
    public loader = true;
    public familiar = false;
    public organizacionAgendas;

    constructor(
        public gMaps: GeoProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toast: ToastProvider,
        public reporter: ErrorReporterProvider,
        public agendasService: AgendasProvider,
        public storage: Storage,
        public turnosProvider: TurnosProvider,
        private router: Router,
        public platform: Platform,
        private checker: CheckerGpsProvider) {
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = true;
            }
        });
        this.onResumeSubscription = this.platform.resume.subscribe(() => {
            this.checker.checkGPS();
        });
        this.turnosProvider.storage.get('turnos').then((turnos) => {
            this.turnosActuales = turnos.turnos;
            this.loader = true;
            if (this.gMaps.actualPosition) {
                const userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude };
                this.getAgendasDisponibles(userLocation);
            } else {
                this.gMaps.getGeolocation().then(position => {
                    const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                    this.getAgendasDisponibles(userLocation);
                }).catch(error => {
                    console.log('error ', error);
                });
            }
        });
    }

    private getAgendasDisponibles(userLocation) {
        this.agendasService.getAgendasDisponibles(userLocation).subscribe((data) => {
            if (data) {
                this.organizacionAgendas = data;
                this.buscarPrestaciones(data);
            } else {
                this.loader = false;
            }
        });
    }

    // Busca los tipos de prestación turneables y verifica que ya el paciente no haya sacado un turno para ese tipo de prestación.
    buscarPrestaciones(organizacionAgendas) {
        this.prestacionesTurneables = [];
        this.loader = false;
        organizacionAgendas.forEach(org => {
            org.agendas.forEach(agenda => {
                agenda.bloques.forEach(bloque => {
                    if (bloque.restantesMobile > 0) {
                        bloque.tipoPrestaciones.forEach(prestacion => {
                            const exists = this.prestacionesTurneables.some(elem => elem.conceptId === prestacion.conceptId);
                            const conTurno = this.turnosActuales.some(turno => turno.tipoPrestacion.conceptId === prestacion.conceptId);
                            if (!exists && !conTurno) {
                                this.prestacionesTurneables.push(prestacion);
                            }
                        });
                    }
                });
            });
        });
    }

    buscarTurnoPrestacion(prestacion) {
        this.turnosProvider.storage.set('prestacion', prestacion);
        this.router.navigate(['/turnos/buscar-turnos']);
    }
}
