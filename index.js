const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

const credentials = {
	host: '34.71.81.155',
	user: 'root',
	password: 'Andycr1',
	database: 'finanzas'
}

app.get('/tipomovimiento', (req, res) => {
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT * from tipomovimiento', (err, result) =>{
		if(err) throw error
		if(result.length > 0){
			res.json(result)
		} else res.send('No hay resultados')
	})
	connection.end()
})

app.get('/tipomotivo/*', (req, res) => {
	let idtipomovimiento = req.url.replace('/tipomotivo/','')
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT * from tipomotivo where idtipomovimiento = ?', [idtipomovimiento], (err, result) =>{
		if(err) throw error
		if(result.length > 0){
			res.json(result)
		} else res.send('No hay resultados')
	})
	connection.end()
})

app.post('/api/login', (req, res) => {
	const { username, password } = req.body
	const values = [username, password]
	var connection = mysql.createConnection(credentials)
	connection.query("SELECT * FROM usuarios WHERE usuario = ? AND password = ?", values, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			if (result.length > 0) {
				res.status(200).send({
					"id": result[0].idusuarios,
					"user": result[0].usuario,
					"username": result[0].nombre
				})
			} else {
				res.status(400).send('Usuario y/o contraseña incorrecta')
			}
		}
	})
	connection.end()
})

app.post('/registrar', (req, res) => {
	const {fecha, movimiento, motivo, concepto, importe, nota} = req.body
	const values = [fecha, movimiento, motivo, concepto, importe, nota]
	var connection = mysql.createConnection(credentials)
	connection.query("INSERT INTO movimientos (idusuario, fecha, idtipomovimiento, idmotivo, concepto, importe, nota)  values (1, ?, ?, ?, ?, ?, ?)", values, (err, result) => {
		if (err) {
			res.status(500).send('Ocurrio un error con el registro')
		} else res.status(200).send('Registro ingresado correctamente')
	})
	connection.end()
})

app.listen(4000, () => console.log('Server running at port 4000'))