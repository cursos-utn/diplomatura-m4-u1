const express = require('express');
const mysql = require('mysql');
const util = require('util');

const app = express();

// app.use(express.static('public'))
// app.use(express.urlencoded())
app.use(express.json());

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'diplomatura',
});
conexion.connect();
const query = util.promisify(conexion.query).bind(conexion);

app.get('/api/personas', async (req, res) => {
  const respuesta = await query('select id, nombre, apellido, edad from persona');
  // for (let i = 0; i < respuesta.length; i++) {
  //   respuesta[i].numeroOrden = i+1;
  // }
  // respuesta.forEach((elemento, idx) => {
  //   elemento.numeroOrden = idx;
  // });
  res.json(respuesta);
});

app.get('/api/personas/:id', async (req, res) => {
  try {
    const respuesta = await query('select * from persona where id=?', [req.params.id]);
    if (respuesta.length == 1) {
      res.json(respuesta[0]);
    } else {
      res.status(404).send();
    }
  } catch (e) {
    res.send('La persona no existe');
  }
});

app.post('/api/personas', async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const salario = req.body.salario;
    const respuesta = await query('insert into persona (nombre, apellido, edad, salario) values (?, ?, ?, ?)', [
      nombre,
      apellido,
      edad,
      salario,
    ]);
    // respuesta.insertId
    const registroInsertado = await query('select * from persona where id=?', [respuesta.insertId]);
    res.json(registroInsertado[0]);
  } catch (e) {
    res.status(500).send('Error en la operacion');
  }
});

app.put('/api/personas/:id', async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad;
    const salario = req.body.salario;
    const respuesta = await query('update persona set nombre=?, apellido=?, edad=?, salario=? where id=?', [
      nombre,
      apellido,
      edad,
      salario,
      req.params.id,
    ]);
    const registroInsertado = await query('select * from persona where id=?', [req.params.id]);
    res.json(registroInsertado[0]);
  } catch (e) {
    res.status(500).send('Error en la operacion');
  }
});

app.delete('/api/personas/:id', async (req, res) => {
  try {
    const registro = await query('select * from persona where id=?', [req.params.id]);
    if (registro.length == 1) {
      await query('delete from persona where id=?', [req.params.id]);
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } catch (e) {
    res.status(500).send('Error en la operacion');
  }
});

app.listen(3000, () => {
  console.log('App corriendo en el puerto 3000');
});

// recurso: personas

// Listar *
//  GET /personas

// Obtener un elemento particular *
// GET /personas/8

// Agregar
// POST /personas
// los datos de la persona en formato JSON

// Modificar
// PUT /personas/9
// los datos de la persona en formato JSON

// Borrar
// DELETE /personas/10
