import { EspecialidadesFTProvider } from 'src/providers/especialidadesFT';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { AuthProvider } from 'src/providers/auth/auth';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from 'src/providers/ftp';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-form-terapeutico',
    templateUrl: 'form-terapeutico.html',
})

export class FormTerapeuticoPage implements OnInit {
    disableArbol = false;
    mostrarMenu = false;
    capitulos: any[];
    filtrados: any[] = [];
    medicamentos: any[];
    padres: any[];
    indices: any[];
    titulo: '';

    especialidades: any[];
    nombre: string;
    os: string;
    especialidadSelected = '';
    carroSelected: boolean = null;
    nivelSelected = '';
    niveles = ['1', '2', '3', '4', '5', '6', '7', '8', '8 y Serv Rehab (HBR)', '8 (NEO)', '8 (UTI)'];

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public ftp: FtpProvider,
        public esp: EspecialidadesFTProvider,
        public authProvider: AuthProvider,
        public router: Router,
        public route: ActivatedRoute

    ) { }

    ngOnInit() {
        this.esp.get({}).then((dataEsp: any) => {
            this.especialidades = dataEsp;
        });

    }

    onSelectEspecialidad() {
        // console.log(this.especialidadSelected)
    }

    onSelectCarro() {
        // console.log(this.carroSelected);
    }

    onSelectComplejidad() {
        // console.log(this.nivelSelected);
    }

    onKeyPress($event, tag) {
    }

    limpiarNivel() {
        this.nivelSelected = '';
    }

    limpiarEspecialidad() {
        this.especialidadSelected = '';
    }

    buscarMedicamentos(params) {
        this.filtrados = [];
        this.ftp.get(params).then((data: any) => {
            this.filtrados = data;
        });
    }

    busquedaMedicamentos(event: any) {
        this.medicamentos = [];
        if (event.target.value) {
            const params = { nombreMedicamento: event.target.value };
            this.ftp.get(params).then((data: any) => {
                this.medicamentos = data;
            });
        }
    }

    onCancel() {
        this.filtrados = [];
        this.medicamentos = [];
    }

    itemSelected(filtrado) {
        const query = {
            padre: filtrado.idpadre
        };
        this.ftp.get(query).then(padres => {
            const medicamento = {
                item: filtrado,
                padres
            };
            this.storage.set('medicamento', medicamento);
            this.router.navigate(['/profesional/formulario-terapeutico/detalle']);
            // this.navCtrl.push(FormTerapeuticoDetallePage, params);
        });
    }

    buscar() {
        const params = {
            nombreMedicamento: this.nombre,
            especialidad: null,
            carro: null,
            nivel: null
        };
        if (this.especialidadSelected) {
            params.especialidad = (this.especialidadSelected as any).descripcion;
        }
        if (this.carroSelected) {
            params.carro = this.carroSelected;
        }
        if (this.nivelSelected) {
            params.nivel = this.nivelSelected;
        }
        this.buscarMedicamentos(params);
    }

    volver() {
        this.filtrados = [];
        this.medicamentos = [];
    }

    arbol() {
        this.router.navigate(['/profesional/formulario-terapeutico/arbol']);
    }





}






