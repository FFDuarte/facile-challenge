import React from 'react';

import { BrowserRouter ,Switch , Route } from 'react-router-dom';

import Usuarios from './pages/admin/usuarios'
import UsuariosCadastrar from './pages/admin/usuarios/usuarios.cadastrar';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/usuarios" exact component={Usuarios} />
                <Route path="/usuarios/cadastrar" exact component={UsuariosCadastrar} />


            </Switch>
        </BrowserRouter>
    )
}