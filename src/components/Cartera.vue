<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Ingresos</v-toolbar-title>
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
                    <v-dialog v-model="verArticulos" max-width="1000px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">Seleccione un artículo</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm12 md12 lg12 xl12>
                                            <v-text-field append-icon="search" 
                                            class="text-xs-center" v-model="texto"
                                            label="Ingrese artículo a buscar" @keyup.enter="listarArticulo()">

                                            </v-text-field>
                                            <template>
                                               <v-data-table
                                                    :headers="cabeceraArticulos"
                                                    :items="articulos"
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
                                                        <td>{{ props.item.nombre }}</td>
                                                        <td>{{props.item.categoria}}</td>
                                                        <td>{{props.item.descripcion}}</td>
                                                        <td>{{props.item.stock}}</td>
                                                        <td>{{props.item.precio_venta}}</td>
                                                    </template>
                                                    <template slot="no-data">
                                                        <h3>No hay artículos para mostrar.</h3>
                                                    </template>
                                                </v-data-table> 
                                            </template>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="ocultarArticulos()" color="blue darken" flat>
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
                :items="ingresos"
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
                    <td>{{ props.item.proveedor}}</td>
                    <td>{{ props.item.tipo_comprobante }}</td>
                    <td>{{ props.item.serie_comprobante }}</td>
                    <td>{{ props.item.num_comprobante }}</td>
                    <td>{{ props.item.fecha_hora }}</td>
                    <td>{{ props.item.impuesto }}</td>
                    <td>{{ props.item.total }}</td>
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
                        <v-select v-model="tipo_comprobante" 
                        :items="comprobantes" label="Tipo Comprobante">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="serie_comprobante" label="Serie Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="num_comprobante" label="Número Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-select v-model="idproveedor"
                        :items="proveedores" label="Proveedor">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="impuesto" label="Impuesto">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-text-field @keyup.enter="buscarCodigo()" v-model="codigo" label="Código">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn @click="mostrarArticulos()" small fab dark color="teal">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2 v-if="errorArticulo">
                        <div class="red--text" v-text="errorArticulo">
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
                                <td>{{ props.item.articulo }}</td>
                                <td><v-text-field type="number" v-model="props.item.cantidad"></v-text-field></td>
                                <td><v-text-field type="number" v-model="props.item.precio"></v-text-field></td>
                                <td>$ {{ props.item.cantidad * props.item.precio}}</td>
                            </template>
                            <template slot="no-data">
                                <h3>No hay artículos agregados al detalle.</h3>
                            </template>
                        </v-data-table>
                        <v-flex class="text-xs-right">
                            <strong>Total Parcial: </strong>$ {{totalParcial=(total-totalImpuesto).toFixed(2)}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong>Total Impuesto: </strong>$ {{totalImpuesto=((total*impuesto)/(100+impuesto)).toFixed(2)}}
                        </v-flex>
                        <v-flex class="text-xs-right">
                            <strong>Total Neto: </strong>$ {{total=(calcularTotal).toFixed(2)}}
                        </v-flex>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-btn @click="ocultarNuevo()" color="blue darken-1" flat>Cancelar</v-btn>
                        <v-btn v-if="verDet==0" @click="guardar()" color="success">Guardar</v-btn>
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
                 carteras:[],
                 dialog: false,
                 headers: [
                     { text: 'Opciones', value: 'opciones', sortable: false },
                     { text: 'Usuario', value: 'usuario', sortable: true },
                     { text: 'Cliente', value: 'cliente', sortable: true },
                     { text: 'Opciones', value: 'opciones', sortable: false },
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
                     { text: 'Seleccionar', value: 'seleccionar', sortable: false  },
                     { text: 'Gasto', value: 'gasto', sortable: false  },
                     { text: 'Valor', value: 'valor', sortable: false  },
                     { text: 'Tipo Valor', value: 'tipo_valor', sortable: false  },
                     { text: 'Tipo Gasto', value: 'tipo_gasto', sortable: false  }

                 ],
                 detalles:[],
                 search: '',
                 id: '',
                 idclientes: '',
                 clientes: [],
                 serie_comprobante: '',
                 num_comprobante: '',
                 fecha_emision: '',
                 valor: 0,
                 tipo_valor: '',
                 tipoValores: ['Procentaje', 'Valor'],
                 fecha_pago: '',
                 fecha_descuento: '',
                 tasa: 0.0,
                 monedas:['Dolar $', 'Soles s/'],
                 moneda: '',
                 tipoTasas: ['Tasa Efectiva Anual','Tasa Nominal Anual'],
                 tipo_tasa: '',
                 valor_entregado: 0,
                 valor_recibido: 0,
                 valor_nominal: 0,
                 valor_neto: 0,
                 TCEA: 0,
                 codigo: '',
                 verNuevo: 0,
                 errorGasto:null,
                 totalGastoInicial: 0,
                 tipo_gasto: '',
                 tipoGastos: ['Inicial', 'Final'],
                 totalGastoFinal: 0,
                 capaitalizacion: '',
                 fecha_emision: '',
                 fecha_pago: '',
                 fecha_descuento: '',
                 capitalizaciones:['Diaria', 'Semanal', 'Quincenal', 'Semestral', 'Anual'],
                 descuento: 0,
                 cabeceraGastos: [
                     { text: 'Seleccionar', value: 'seleccionar', sortable: false  },
                     { text: 'Codigo', value: 'codigo', sortable: false  },
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
                 TCEA: 0,
                 conversion: '',
                 valorM: 0,
                 dias: 0,
                 tasaPeriodo: 0.0,
                 tasaDescontada: 0.0,
                 descuento: 0.0,
             }
         },
        watch: {
            dialog (val) {
            val || this.close()
            }
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
                me.errorArticulo=null;
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
             agregarDetalle(){
                 this.detalles.push({
                     idgasto: data['idgasto'],
                     valor: data['valor'],
                     tipo_valor: data['tipo_valor'],
                     tipo_gasto: data['tipo_gasto']
                 });
             },
             eliminarDetalle(arr, item){
                 var i = arr.indexOd(item);
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
                    url = 'api/Cartera/Listar';
                }
                else{
                    url='api/Cartera/ListarFiltro'
                }
             }
         }
     }
 </script>