<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Carteras</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-if="verNuevo==0" class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-btn v-if="verNuevo==0" @click="listar()" color="primary" dark class="mb-2">Buscar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-if="verNuevo==0" @click="mostrarNuevo" color="primary" dark class="mb-2">Nuevo</v-btn>
                    <v-dialog v-model="verGastos" max-width="1000px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">Seleccione un gasto</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md12 lg12 xl12>
                                            <v-text-field append-icon="search" 
                                            class="text-xs-center" v-model="texto"
                                            label="Ingrese artículo a buscar" @keyup.enter="listarGastos()">

                                            </v-text-field>
                                            <template>
                                               <v-data-table
                                                    :headers="cabeceraGastos"
                                                    :items="gastos"
                                                    class="elevation-1"
                                                >
                                                    <template slot="items" slot-scope="props">
                                                        <td class="justify-center layout px-0">
                                                            <v-icon
                                                            small
                                                            class="mr-2"
                                                            @click="agregarDetalle(props.item)"
                                                            >
                                                            add
                                                            </v-icon>
                                                        </td>
                                                        <td>{{props.item.nombre}}</td>
                                                        <td>{{props.item.descripcion}}</td>
                                                    </template>
                                                    <template slot="no-data">
                                                        <h3>No hay gastos para mostrar.</h3>
                                                    </template>
                                                </v-data-table> 
                                            </template>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="ocultarGasto()" color="blue darken" flat>
                                    Cancelar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="adModal" max-width="290">
                        <v-card>
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Item?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">¿Anular Ingreso?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Anular </span>
                                el ítem {{ adNombre }}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">
                                    Cancelar
                                </v-btn>
                                <v-btn v-if="adAccion==1" color="orange darken-4" flat="flat" @click="activar">
                                    Activar
                                </v-btn>
                                <v-btn v-if="adAccion==2" color="orange darken-4" flat="flat" @click="desactivar">
                                    Anular
                                </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-dialog>
                </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="carteras"
                :search="search"
                class="elevation-1"
                v-if="verNuevo==0"
            >
                <template slot="items" slot-scope="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="verDetalles(props.item)"
                        >
                        tab
                        </v-icon>
                        <template v-if="props.item.estado=='Aceptado'">
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(2,props.item)"
                            >
                            block
                            </v-icon>
                        </template>
                    </td>
                    <td>{{ props.item.usuario }}</td>
                    <td>{{ props.item.cliente }}</td>
                    <td>{{ props.item.serie_comprobante }}</td>
                    <td>{{ props.item.num_comprobante }}</td>
                    <td>{{ props.item.fecha_emision }}</td>
                    <td>{{ props.item.fecha_pago }}</td>
                    <td>{{ props.item.fecha_descuento }}</td>
                    <td>{{ props.item.moneda }}</td>
                    <td>{{ props.item.tipo_tasa }}</td>
                    <td>{{ props.item.tasa }}</td>
                    <td>{{ props.item.capaitalizacion }}</td>
                    <td>{{ props.item.valor_entregado }}</td>
                    <td>{{ props.item.valor_entregado }}</td>
                    <td>{{ props.item.valor_nominal }}</td>
                    <td>{{ props.item.valor_neto }}</td>
                    <td>{{ props.item.TCEA }}</td>
                    <td>
                        <div v-if="props.item.estado=='Aceptado'">
                            <span class="blue--text">Aceptado</span>
                        </div>
                        <div v-else>
                            <span class="red--text">{{props.item.estado}}</span>
                        </div>
                    </td>
                </template>
                <template slot="no-data">
                <v-btn color="primary" @click="listar">Resetear</v-btn>
                </template>
            </v-data-table>
            <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
                <v-layout row wrap>                    
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="serie_comprobante" label="Serie Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="num_comprobante" label="Número Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="date" class="text-xs-center" v-model="fecha_emision" label="Fecha Emision"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="date" class="text-xs-center" v-model="fecha_pago" label="Fecha Pago"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="date" class="text-xs-center" v-model="fecha_descuento" label="Fecha Descuento"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="moneda" 
                        :items="monedas" label="Moneda">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="tipo_tasa" 
                        :items="tipoTasas" label="Tipo Tasas">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="tasa" label="Tasa en decimales">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="capaitalizacion" 
                        :items="capitalizaciones" label="Tipo Capitalizaciones">
                        </v-select>
                    </v-flex>                    
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="valor_nominal" label="Valor Nominal">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-select v-model="idcliente"
                        :items="clientes" label="Clientes">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-text-field @keyup.enter="buscarCodigo()" v-model="codigo" label="Código">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn @click="mostrarGastos()" small fab dark color="teal">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2 v-if="errorGasto">
                        <div class="red--text" v-text="errorGasto">
                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-data-table
                            :headers="cabeceraDetalles"
                            :items="detalles"
                            hide-actions
                            class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td class="justify-center layout px-0">
                                    <v-icon
                                    small
                                    class="mr-2"
                                    @click="eliminarDetalle(detalles,props.item)"
                                    >
                                    delete
                                    </v-icon>
                                </td>
                                <td>{{ props.item.nombre }}</td>
                                <td><v-text-field type="number" v-model="props.item.valor"></v-text-field></td>
                                <td><v-select v-model="props.item.tipo_valor" :items="tipoValores" label="Tipo Valores"></v-select></td>
                                <td><v-select v-model="props.item.tipo_gasto" :items="tipoGastos" label="Tipo Gastos"></v-select></td>
                            </template>
                            <template slot="no-data">
                                <h3>No hay artículos agregados al detalle.</h3>
                            </template>
                        </v-data-table>                        
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" readonly v-model="valor_entregado" label="Valor Entregado">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" readonly v-model="valor_recibido" label="Valor Recibido">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" readonly v-model="valor_neto" label="Valor Neto">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" readonly v-model="TCEA" label="TCEA">
                        </v-text-field>
                    </v-flex>
                    
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-btn @click="ocultarNuevo()" color="blue darken-1" flat>Cancelar</v-btn>
                        <v-btn v-if="verDet==0" @click="guardar()" color="success">Guardar</v-btn>
                        <v-btn color="primary" @click="calcularValores">Calcular</v-btn>
                    </v-flex>
		        </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>
 <script>
     import axios from 'axios'
     import moment from 'moment';

     export default{
         data(){
             return {
                 fromDateVal: null,

                 minDate: "2019-07-04",
                 maxDate: "2019-08-30",
                 carteras:[],
                 dialog: false,
                 headers: [
                     { text: 'Opciones', value: 'opciones', sortable: false },
                     { text: 'Usuario', value: 'usuario', sortable: true },
                     { text: 'Cliente', value: 'cliente', sortable: true },
                     { text: 'Serie Comprobante', value: 'serie_comprobante', sortable: false  },
                     { text: 'Número Comprobante', value: 'num_comprobante', sortable: false  },
                     { text: 'Fecha Emision', value: 'fecha_emision', sortable: false  },
                     { text: 'Fecha Pago', value: 'fecha_pago', sortable: false  },
                     { text: 'Fecha Descuento', value: 'fecha_descuento', sortable: false  },
                     { text: 'Moneda', value: 'moneda', sortable: false  },
                     { text: 'Tipo Tasa', value: 'tipo_tasa', sortable: false  },
                     { text: 'Tasa', value: 'tasa', sortable: false  },
                     { text: 'Capitalizacion', value: 'capaitalizacion', sortable: false  },
                     { text: 'Valor Entregado', value: 'valor_entregado', sortable: false  },
                     { text: 'Valor Recibido', value: 'valor_recibido', sortable: false  },
                     { text: 'Valor Nominal', value: 'valor_nominal', sortable: false  },
                     { text: 'Valor Nominal', value: 'valor_neto', sortable: false  },
                     { text: 'TCEA', value: 'TCEA', sortable: false  }
                 ],
                 cabeceraDetalles:[
                     { text: 'Borrar', value: 'borrar', sortable: false  },
                     { text: 'Gasto', value: 'gasto', sortable: false  },
                     { text: 'Valor', value: 'valor', sortable: false  },
                     { text: 'Tipo Valor', value: 'tipo_valor', sortable: false  },
                     { text: 'Tipo Gasto', value: 'tipo_gasto', sortable: false  }

                 ],
                 detalles:[],
                 search: '',
                 id: '',
                 idcliente: '',
                 clientes: [],
                 serie_comprobante: '',
                 num_comprobante: '',
                 fecha_emision: '',
                 valor: 0.0,
                 tipo_valor: '',
                 tipoValores: ['Porcentaje', 'Valor'],
                 fecha_pago: '',
                 fecha_descuento: '',
                 tasa: 0.0,
                 monedas:['Dolar $', 'Soles s/'],
                 moneda: '',
                 tipoTasas: ['Tasa Efectiva Anual','Tasa Nominal Anual'],
                 tipo_tasa: '',
                 valor_entregado: 0.0,
                 valor_recibido: 0.0,
                 valor_nominal: 0.0,
                 valor_neto: 0.0,
                 TCEA: 0.0,
                 codigo: '',
                 verNuevo: 0,
                 errorGasto:null,
                 totalGastoInicial: 0.0,
                 tipo_gasto: '',
                 tipoGastos: ['Inicial', 'Final'],
                 totalGastoFinal: 0.0,
                 capaitalizacion: '',
                 capitalizaciones:['No hay','Diaria', 'Semanal', 'Quincenal', 'Mensual' ,'Semestral', 'Anual'],
                 descuento: 0.0,
                 cabeceraGastos: [
                     { text: 'Seleccionar', value: 'seleccionar', sortable: false  },
                     { text: 'Nombre', value: 'nombre', sortable: false  },
                     { text: 'Descripcion', value: 'descripcion', sortable: false  },
                 ],
                 gastos:[],
                 texto: '',
                 verGastos: 0,
                 verDet: 0,
                 valida: 0,
                 validaMensaje:[],
                 adModal: 0,
                 adAccion: 0,
                 adNombre: '',
                 adId: '',
                 comprobanteModal:0,
                 cliente:'',
                 fecha_hora:'',
                 num_documento:'',
                 direccion:'',
                 telefono:'',
                 email:'',
                 TCEA: 0.0,
                 conversion: '',
                 valorM: 0.0,
                 dias: 0,
                 tasaPeriodo: 0.0,
                 tasaDescontada: 0.0,
                 descuento: 0.0
             }
         },
         computed:{
                
         },
        watch: {
            dialog (val) {
            val || this.close()
            },
            
        },

        created () {
            this.listar();
            this.select();
        },
         methods:{
             mostrarNuevo(){
                 this.verNuevo = 1;
             },
             ocultarNuevo(){
                 this.verNuevo = 0;
                 this.Limpiar();
             },
             buscarCodigo(){
                let me=this;
                me.errorGasto=null;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Gasto/BuscarCodigoGasto/'+this.codigo,configuracion)
                .then(function(response){
                    me.agregarDetalle(response.data);
                }).catch(function(error){
                    console.log(error);
                    me.errorGasto = 'No Existe el Gasto';
                });
             },
             listarGastos(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Gasto/ListarGasto/'+me.texto,configuracion).then(function(response){
                    //console.log(response);
                    me.articulos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
             },
             mostrarGastos(){
                 this.verGastos = 1;
             },
             ocultarGasto(){
                 this.verGastos = 0;
             },
             agregarDetalle(data = []){
                 this.detalles.push({
                     idgasto: data['idgasto'],
                     nombre: data['nombre'],
                     valor: 0.0,
                     tipo_valor: '',
                     tipo_gasto: ''
                 });
             },
             eliminarDetalle(arr, item){
                 var i = arr.indexOf(item);
                 if(i !== i){
                     arr.splice(i,1);
                 }
             },
             listar(){
                 let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                let url='';
                if(!me.search){
                    url = 'api/Cartera/Listar/';
                }
                else{
                    url='api/Cartera/ListarFiltro/' + me.search;
                }
                axios.get(url,configuracion).then(function(response){
                    me.ingreso = response.data;
                }).catch(function(error){
                    console.log(error);
                })
             },
             listarDetalles(){
                 let me = this;
                 let header={"Authorization" : "Bearer " + this.$store.state.token};
                 let configuracion= {headers : header};
                 axios.get('api/Gasto/ListarDetalle/'+id,configuracion).then(function(response){
                     me.detalles=response.data;
                 }).catch(function(error){
                     console.log(error);
                 });
             },
             verDetalles(item){
                 this.limpiar(item);
                 this.serie_comprobante = item.serie_comprobante;
                 this.num_comprobante = item.num_comprobante;
                 this.fecha_emision = item.fecha_emision;
                 this.fecha_pago = item.fecha_pago;
                 this.fecha_descuento = item.fecha_descuento;
                 this.moneda = item.moneda;
                 this.tipo_tasa = item.tipo_tasa;
                 this.tasa = item.tasa;
                 this.capaitalizacion = item.capaitalizacion;
                 this.valor_entregado = item.valor_entregado;
                 this.valor_recibido = item.valor_recibido;
                 this.valor_nominal = item.valor_nominal;
                 this.valor_neto = item.valor_neto;
                 this.TCEA = item.TCEA;
                 this.listarDetalles(item.idcartera);
                 this.varNuevo = 1;
                 this.verDet = 1;
             },
             select(){
                 let me = this;
                 var clientesArray = [];
                 let header={"Authorization" : "Bearer " + this.$store.state.token};
                 let configuracion= {headers : header};
                 axios.get('api/Personas/ListarClientes/',configuracion).then(function(response){
                     clientesArray = response.data;
                     clientesArray.map(function(x){
                         me.clientes.push({text: x.nombre,value:x.idcliente});
                     });
                 }).catch(function(error){
                     console.error(error);
                 });
             },
             limpiar(){
                 this.id="";
                 this.idcliente="";
                 this.serie_comprobante = '';
                 this.num_comprobante = '';
                 this.fecha_emision = '';
                 this.fecha_pago = '';
                 this.fecha_descuento = '';
                 this.moneda = '';
                 this.tipo_tasa = '';
                 this.tasa = 0.0;
                 this.capaitalizacion = '';
                 this.valor_entregado = 0.0;
                 this.valor_recibido = 0.0;
                 this.valor_nominal = 0.0;
                 this.valor_neto = 0.0;
                 this.TCEA = '';
                 this.verDet = 0;
                 this.conversion = 0.0;
                 this.valorM = 0.0;
                 this.dias = 0;
                 this.tasaPeriodo = 0.0;
                 this.tasaDescontada = 0.0;
                 this.descuento = 0.0;
             },
             guardar () {
                 if (this.validar()){
                    return;
                }
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};                
                let me=this;
                axios.post('api/Gasto/Crear',{
                    'idcliente':me.idcliente,
                    'idusuario':me.idusuario,
                    'serie_comprobante':me.serie_comprobante,
                    'num_comprobante':me.num_comprobante,
                    'fecha_emision':me.fecha_emision,
                    'fecha_pago':me.fecha_pago,
                    'fecha_descuento':me.fecha_descuento,
                    'moneda':me.moneda,
                    'tipo_tasa':me.tipo_tasa,
                    'tasa':me.tasa,
                    'capaitalizacion':me.capaitalizacion,
                    'valor_entregado':me.valor_entregado,
                    'valor_recibido':me.valor_recibido,
                    'valor_nominal':me.valor_nominal,
                    'valor_neto':me.valor_neto,
                    'TCEA':me.TCEA,
                    'detalles':me.detalles
                },configuracion).then(function(response){
                    me.ocultarNuevo();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    console.log(error);
                });
             },
             validar(){
                this.valida=0;
                this.validaMensaje=[];

                if (!this.idcliente){
                    this.validaMensaje.push("Seleccione un cliente.");
                }
                if (!this.num_comprobante){
                    this.validaMensaje.push("Ingrese el número de factura.");
                }
                if (!this.serie_comprobante){
                    this.validaMensaje.push("Ingrese la serie de la factura.");
                }
                if (!this.fecha_emision){
                    this.validaMensaje.push("Ingrese la fecha de emision.");
                }
                if (!this.fecha_pago){
                    this.validaMensaje.push("Ingrese la fecha de pago.");
                }
                if (!this.fecha_descuento){
                    this.validaMensaje.push("Ingrese la fecha de descuento.");
                }
                if (!this.num_comprobante){
                    this.validaMensaje.push("Ingrese el número del comprobante.");
                }
                if (!this.moneda){
                    this.validaMensaje.push("Seleccione una moneda.");
                }
                if (!this.tipo_tasa){
                    this.validaMensaje.push("Seleccione un tipo de tasa.");
                }
                if (!this.tasa){
                    this.validaMensaje.push("Ingrese la tasa a utilizar.");
                }
                if (!this.capaitalizacion){
                    this.validaMensaje.push("Ingrese la capitalización del ejemplo.");
                }
                if (this.detalles.length<=0){
                    this.validaMensaje.push("Ingrese al menos un gasto al detalle.");
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(){
                this.adModal=1;
                this.adNombre=item.nombre;
                this.adId = item.idcartera;
                if(accion==1){
                    this.adAccion=1;
                }else if(accion==2){
                    this.adAccion=2;
                }else{
                    this.adModal=0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0;
            },
            desactivar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.get('api/Carteras/Anular'+this.adId,configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre=0;
                    me.adId='';
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                });
            },
            calcularValores(){
                let me = this;
                var fecha1 = moment(me.fecha_pago,"YYYY/MM/DD");
                var fecha2 = moment(me.fecha_descuento, "YYYY/MM/DD");
                var dias = fecha1.diff(fecha2, "days");
                for(var i=0;i<me.detalles.length;i++){
                    if(me.detalles[i].tipo_valor == "Porcentaje" && me.detalles[i].tipo_gasto == "Inicial"){
                        me.totalGastoInicial = me.totalGastoInicial + (parseFloat(me.detalles[i].valor) * parseFloat(me.valor_nominal));
                    }
                    else if(me.detalles[i].tipo_valor == "Valor" && me.detalles[i].tipo_gasto == "Inicial"){
                        me.totalGastoInicial = me.totalGastoInicial + parseFloat(me.detalles[i].valor);
                    }
                    else if(me.detalles[i].tipo_valor == "Porcentaje" && me.detalles[i].tipo_gasto == "Final"){
                        me.totalGastoFinal = me.totalGastoFinal + (parseFloat(me.detalles[i].valor) * parseFloat(me.valor_nominal));
                    }
                    else if(me.detalles[i].tipo_valor == "Valor" && me.detalles[i].tipo_gasto == "Final"){
                        me.totalGastoFinal = me.totalGastoFinal + parseFloat(me.detalles[i].valor);
                    }
                }
                if(me.capaitalizacion.length > 0){
                    if(me.capaitalizacion === 'No hay'){
                        me.valorM = 0;
                    }
                    else if(me.capaitalizacion === "Diaria"){
                        me.valorM = 360;
                    } else if(me.capaitalizacion === "Semanal"){
                        me.valorM = 48;
                    } else if(me.capaitalizacion === "Quincenal"){
                        me.valorM = 24;
                    } else if(me.capaitalizacion === "Mensual"){
                        me.valorM = 12;
                    } else if(me.capaitalizacion === "Semestral"){
                        me.valorM = 2;
                    } else if(me.capaitalizacion === "Anual"){
                        me.valorM = 1;
                    }
                }
                
                if(me.tipo_tasa === "Tasa Nominal Anual"){
                    me.conversion = Math.pow((1+(parseFloat(me.tasa)/me.valorM)), me.valorM) - 1;
                }


                if(me.tipo_tasa === "Tasa Nominal Anual"){
                    me.tasaPeriodo = Math.pow(1 + parseFloat(me.conversion), dias / 360) -1;
                }
                else if(me.tipo_tasa === "Tasa Efectiva Anual"){
                    me.tasaPeriodo = Math.pow(1 + parseFloat(me.tasa), dias / 360) -1;
                }
                me.tasaDescontada = parseFloat(me.tasaPeriodo) / (1 + parseFloat(me.tasaPeriodo));
                me.descuento = parseFloat(me.valor_nominal) * parseFloat(me.tasaDescontada);
                me.valor_neto = parseFloat(me.valor_nominal) - parseFloat(me.descuento);
                me.valor_recibido = parseFloat(me.valor_neto) - parseFloat(me.totalGastoInicial);
                me.valor_entregado = parseFloat(me.valor_nominal) + parseFloat(me.totalGastoFinal);
                me.TCEA = (Math.pow(parseFloat(me.valor_entregado) / parseFloat(me.valor_recibido), dias/360) - 1).toFixed(2);

                Console.log('Costo Finales Total: ', me.totalGastoInicial);
                Console.log('Costo Iniciales Total: ', me.totalGastoInicial);
                Console.log('Conversión de TNA a TEA: ', me.conversion);
                Console.log('Tasa del Periodo: ', me.tasaPeriodo);
                console.log('Tasa Descontada: ', me.tasaDescontada);
                Console.log('Descuento: ', me.descuento);
            }
         }
     }
 </script>