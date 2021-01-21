import { Component } from '@angular/core';
import { PacienteMPIService } from 'src/providers/paciente-mpi';
import * as moment from 'moment';
import { ToastProvider } from 'src/providers/toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-registro-paciente',
    templateUrl: 'registro-paciente.html',
})
export class RegistroPacientePage {
    estado: string;
    loading: any;
    paciente: any = {};
    public textoLibre: string = null;
    inProgress = true;
    saving = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastCtrl: ToastProvider,
        private mpiService: PacienteMPIService) {
    }


    save() {
        this.saving = true;
        const paciente = this.paciente;
        this.mpiService.save({ paciente }).then(status => {
            this.saving = false;
            this.toastCtrl.success('PACIENTE REGISTRADO CON EXITO');
            this.router.navigate(['/home']);
        }).catch(() => {
            this.toastCtrl.danger('ERROR AL GUARDAR');
            this.saving = false;
        });
    }

    ionViewWillEnter() {
        this.inProgress = true;
        let datos;
        let scan;
        this.route.queryParams.subscribe(params => {
            datos = JSON.parse(params.datos);
            scan = params.scan;
        });
        const search = {
            type: 'simplequery',
            apellido: datos.apellido.toString(),
            nombre: datos.nombre.toString(),
            documento: datos.documento.toString(),
            sexo: datos.sexo.toString(),
            escaneado: true
        };

        this.mpiService.get(search).then((resultado: any[]) => {
            if (resultado.length) {
                this.paciente = resultado[0];

                this.mpiService.getById(this.paciente.id).then((pacUpdate: any) => {
                    if (pacUpdate) {
                        this.paciente = pacUpdate;
                        this.estado = this.paciente.estado;
                        if (this.paciente.estado === 'temporal') {
                            this.paciente.estado = 'validado';
                            this.paciente.scan = scan;
                            this.paciente.nombre = datos.nombre.toUpperCase();
                            this.paciente.apellido = datos.apellido.toUpperCase();
                            this.paciente.fechaNacimiento = moment(datos.fechaNacimiento, 'DD/MM/YYYY');
                            this.paciente.sexo = datos.sexo.toLowerCase();
                            this.paciente.documento = datos.documento;
                        }
                    } else {
                        this.estado = 'nuevo';
                        this.paciente = {
                            estado: 'validado',
                            scan,
                            nombre: datos.nombre.toUpperCase(),
                            apellido: datos.apellido.toUpperCase(),
                            fechaNacimiento: moment(datos.fechaNacimiento, 'DD/MM/YYYY'),
                            sexo: datos.sexo.toLowerCase(),
                            documento: datos.documento
                        };
                    }
                    this.inProgress = false;
                });
            } else {
                // No existe el paciente
                this.estado = 'nuevo';
                this.paciente = {
                    estado: 'validado',
                    scan,
                    nombre: datos.nombre.toUpperCase(),
                    apellido: datos.apellido.toUpperCase(),
                    fechaNacimiento: moment(datos.fechaNacimiento, 'DD/MM/YYYY'),
                    sexo: datos.sexo.toLowerCase(),
                    genero: datos.sexo.toLowerCase(),
                    documento: datos.documento
                };
                this.inProgress = false;
            }
        });
    }

}
