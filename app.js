
const express = require('express')
const app = express()

// Permite recibir datos en formato JSON
app.use(express.json())

// Arreglo que almacena los productos
const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// Función para validar los datos de un producto
function validarProducto(nombre, descripcion, precio) {
    if (
        typeof nombre !== 'string' || nombre.trim() === '' ||
        typeof descripcion !== 'string' || descripcion.trim() === '' ||
        precio === undefined || precio === null || precio === ''
    ) {
        return false
    }

    if (!Number.isFinite(Number(precio))) {
        return false
    }

    return true
}

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.status(200).json(productos)
})

// GET - Obtener un producto por ID
app.get('/productos/:id', (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: 'El ID debe ser un numero entero valido'
        })
    }

    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    res.status(200).json(producto)
})

// ==================================================
// METODOS DE LA API REST
// ==================================================

// POST - Crear un nuevo producto
app.post('/productos', (req, res) => {

    const { nombre, descripcion, precio } = req.body

    // Validar los datos obligatorios
    if (!validarProducto(nombre, descripcion, precio)) {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios y deben contener datos validos'
        })
    }

    // Generar un ID nuevo que no se repita
    const nuevoId = Math.max(0, ...productos.map(p => p.id)) + 1

    // Crear el nuevo producto
    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio)
    }

    // Agregar el producto al arreglo
    productos.push(nuevoProducto)

    // Responder con código 201
    res.status(201).json(nuevoProducto)
})

// PUT - Actualizar un producto
app.put('/productos/:id', (req, res) => {

    // Obtener y validar el ID
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: 'El ID debe ser un numero entero valido'
        })
    }

    // Buscar el producto
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    // Recibir los nuevos datos
    const { nombre, descripcion, precio } = req.body

    // Validar los datos
    if (!validarProducto(nombre, descripcion, precio)) {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios y deben contener datos validos'
        })
    }

    // Crear el producto actualizado
    const productoActualizado = {
        id: id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio)
    }

    // Reemplazar el producto anterior
    productos[indice] = productoActualizado

    // Responder con código 200
    res.status(200).json(productoActualizado)
})

// DELETE - Eliminar un producto
app.delete('/productos/:id', (req, res) => {

    // Obtener y validar el ID
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: 'El ID debe ser un numero entero valido'
        })
    }

    // Buscar la posición del producto
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    // Eliminar el producto
    const productoEliminado = productos.splice(indice, 1)[0]

    // Confirmar la eliminación
    res.status(200).json({
        mensaje: 'Producto eliminado correctamente',
        producto: productoEliminado
    })
})

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
