import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Rol from './components/Rol.vue'
import Usuario from './components/Usuario.vue'
import Cliente from './components/Cliente.vue'
import Login from './components/Login.vue'
import store from './store'
import Gasto from './components/Gasto.vue'
import Cartera from './components/Cartera.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta :{
        administrador :true,
        trabajador: true,
        nofinanzas: true
      }
    },
    {
      path: '/gastos',
      name: 'gastos',
      component: Gasto,
      meta :{
        administrador :true,
        trabajador: true
      }
    },
    {
      path: '/carteras',
      name: 'carteras',
      component: Cartera,
      meta :{
        administrador :true,
        trabajador: true
      }
    },
    {
      path: '/roles',
      name: 'roles',
      component: Rol,
      meta :{
        administrador :true
      }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: Usuario,
      meta :{
        administrador :true
      }
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: Cliente,
      meta :{
        administrador :true,
        trabajador: true
      }
    },   
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta : {
        libre: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next()
  } else if (store.state.usuario && store.state.usuario.rol== 'Administrador'){
    if (to.matched.some(record => record.meta.administrador)){
      next()
    }
  }else if (store.state.usuario && store.state.usuario.rol== 'Trabajador'){
    if (to.matched.some(record => record.meta.trabajador)){
      next()
    }
  }else if (store.state.usuario && store.state.usuario.rol== 'NoFinanzas'){
    if (to.matched.some(record => record.meta.nofinanzas)){
      next()
    }
  } else{
    next({
      name: 'login'
    })
  }
})

export default router
