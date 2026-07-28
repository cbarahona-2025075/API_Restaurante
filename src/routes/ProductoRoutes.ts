import { IncomingMessage, ServerResponse } from "node:http";
import { ProductoService } from "../services/ProductoService.js";

const service = new ProductoService();

export async function productoRoutes(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        if (url === "/productos") {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const productos = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(productos));

            return;
        }


        if (url === "/productos/post") {

            if (metodo !== "POST") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            let body = "";

            req.on("data", chunk => {
                body += chunk;
            })

            req.on("end", async () => {
                try {
                    const producto = JSON.parse(body);
                    await service.agregar(producto);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "PRODUCTO AGREGADO CORRECTAMENTE"
                    }));


                } catch (error) {
                    res.writeHead(409);
                    res.end(JSON.stringify({
                        mensaje: (error as Error).message
                    }))
                }
            })
            return;
        }

        if (url.startsWith("/productos/buscar/")) {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/productos/buscar/")[1];
            const idBuscar = Number(idTexto);

            if (isNaN(idBuscar) || idBuscar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVALIDO" }));
                return;
            }

            const producto = await service.buscar(idBuscar);

            if (!producto) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "PRODUCTO CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify(producto));
            return;

        }

        if (url.startsWith("/productos/actualizar/")) {

            if (metodo !== "PUT") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/productos/actualizar/")[1];

            const idActualizar = Number(idTexto);
            if (isNaN(idActualizar) || idActualizar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVÁLIDO" }));
                return;
            }

            let body = "";

            req.on("data", chunk => {
                body += chunk;
            });


            req.on("end", async () => {
                try {
                    const producto = JSON.parse(body);

                    const productoActualizado = { ...producto, id: idActualizar };

                    const actualizado = await service.actualizar(productoActualizado);

                    if (!actualizado) {
                        res.writeHead(404);

                        res.end(JSON.stringify({
                            mensaje: "PRODUCTO NO EXISTE"
                        }));

                        return;
                    }

                    res.writeHead(200);

                    res.end(JSON.stringify({
                        mensaje: "PRODUCTO ACTUALIZADO CORRECTAMENTE"
                    }));

                } catch (error) {
                    res.writeHead(409);

                    res.end(JSON.stringify({
                        mensaje: (error as Error).message
                    }));
                }
            });
            return;
        }

        if (url.startsWith("/productos/eliminar/")) {

            if (metodo !== "DELETE") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/productos/eliminar/")[1];

            const idEliminar = Number(idTexto);

            if (isNaN(idEliminar) || idEliminar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVÁLIDO" }));
                return;
            }

            const producto = await service.eliminar(idEliminar);

            if (!producto) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "PRODUCTO CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify({ mensaje: "PRODUCTO ELIMINADO CORRECTAMENTE" }));
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ mensaje: "RUTA NO ENCONTRADA" }));

    } catch (error) {
        res.writeHead(500);

        res.end(JSON.stringify({
            mensaje: (error as Error).message
        }))
    }


}