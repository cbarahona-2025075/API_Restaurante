//Vamos a crear una ruta de conexion o UNA RUTA DE ACCESO PARA QUE NUESTRO CLIENTE(Postman) PUEDA ACCEDER A NUESTRA API
import { createServer } from "node:http";
import { clienteRoutes } from "../routes/ClienteRoutes.js";
import { productoRoutes } from "../routes/ProductoRoutes.js";
import { mesaRoutes } from "../routes/MesaRoutes.js";
import { categoriaRoutes } from "../routes/CategoriaProductoRoutes.js";
import { pedidoRoutes } from "../routes/PedidoRoutes.js";
import { detalleRoutes } from "../routes/DetallePedidoRoutes.js";
import { pagoRoutes } from "../routes/PagoRoutes.js";

const servidor = createServer(async (req, res) => {
    const url = req.url ?? "";

    if (url.startsWith("/clientes")) {
        return clienteRoutes(req, res);
    }

    if (url.startsWith("/productos")) {
        return productoRoutes(req, res);
    }

    if (url.startsWith("/mesas")) {
        return mesaRoutes(req, res);
    }

    if (url.startsWith("/categorias")) {
        return categoriaRoutes(req, res);
    }

    if (url.startsWith("/pedidos")) {
        return pedidoRoutes(req, res);
    }

    if (url.startsWith("/detalles")) {
        return detalleRoutes(req, res);
    }

    if (url.startsWith("/pagos")) {
        return pagoRoutes(req, res);
    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        mensaje: "Ruta no encontrada"
    }));
});

servidor.listen(3000, () => {
    console.log("\n===============================");
    console.log("Servidor Iniciado")
    console.log("http://localhost:3000");
    console.log("\n===============================");
})