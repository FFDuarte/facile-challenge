
import React , { useState, useEffect} from 'react';
import {  createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import MenuAdmin from '../../../components/MenuAdmin.js';
import Footer from '../../../components/FooterAdmin';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import api from '../../../services/api';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Script } from 'vm';

const crypto = require('crypto')
const secret = 'shezhuansauce';
let key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);



const mdTheme = createTheme();

function Listagem() {
  
  const [ usuarios , setUsuarios] = useState([]);

  useEffect(() => {
    
    async function loadUsuarios(){
      const response = await api.get('http://localhost:5000/api/usuarios')
      setUsuarios(response.data);
    }
    loadUsuarios();
  },[])

  function descrypted(value){
      const [iv,encrypted] = value.split(':')
      const ivBuffer = Buffer.from(iv,'hex')
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer);
      let content = decipher.update(Buffer.from(encrypted, 'hex'))
      content = Buffer.concat([content, decipher.final()])
      return content.toString()
  }

  async function handleDelete(id){
    if(window.confirm("Deseja realmente deletar o usuario ? ")){
      var result = await api.delete('http://localhost:5000/api/usuarios/'+ id);
      if(result.status === 200){
        window.location.href = '/usuarios' ;
      }else{
        alert('Ocorreu um erro! Tente novamente.')
      }
    }
  }
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <MenuAdmin title={'USUARIOS'}/>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Box  maxWidth="lg" sx={{ mt: 2, mb: 4  , ml: 0}}>
            <Grid container sx={{m: 1}} spacing={3}>
              <Grid item sm={12}>
                <Paper
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',                  
                  }}
                >
                  <h2>Listam de Usuarios </h2> <TableCell align="right">
                                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                    <Button color="secondary"><a  href='/usuarios/cadastrar' style={{textDecoration: 'none', color : 'white' }} >Cadastrar</a> </Button>
                                  </ButtonGroup>
                                </TableCell>
                  <Grid container spacing={3} >
                    <Grid item xs={12} sm={12}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome</TableCell>
                              <TableCell align="center">Email</TableCell>
                              <TableCell align="center">Tipo</TableCell>
                              <TableCell align="center">Data de Cadastrao</TableCell>
                              <TableCell align="center">Opções</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            { usuarios.map((row) => (
                              <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.nome_usuario}
                                </TableCell>
                                
                                <TableCell align="center"> { row.email_usuario } </TableCell>
                                <TableCell align="center"> 
                                {descrypted( row.comentario_usuario)} 
                                </TableCell>
                                <TableCell align="center"> {new Date(row.createdAt).toLocaleString('pt-br') } </TableCell>
                                <TableCell align="right">
                                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                    <Button color="primary" onClick={() => handleDelete(row._id)}>Excluir</Button>
                                  </ButtonGroup>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody> 
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
           <Grid>
              <Footer sx={{ pt: 4 }} />
           </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function UsuariosListagem() {
  return <Listagem />;
}
