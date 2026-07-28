import { IncomingMessage, ServerResponse } from "node:http";
import { PedidoService } from "../services/PedidoService.js";

const service = new PedidoService();

export async function pedidoRoutes(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        if (url === "/pedidos") {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const pedidos = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(pedidos));

            return;
        }


        if (url === "/pedidos/post") {

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
                    const pedido = JSON.parse(body);
                    await service.agregar(pedido);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "PEDIDO AGREGADO CORRECTAMENTE"
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

        if (url.startsWith("/pedidos/buscar/")) {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/pedidos/buscar/")[1];
            const idBuscar = Number(idTexto);

            if (isNaN(idBuscar) || idBuscar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVALIDO" }));
                return;
            }

            const pedido = await service.buscar(idBuscar);

            if (!pedido) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "PEDIDO CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify(pedido));
            return;

        }

        if (url.startsWith("/pedidos/actualizar/")) {

            if (metodo !== "PUT") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/pedidos/actualizar/")[1];

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
                    const pedido = JSON.parse(body);

                    const pedidoActualizado = { ...pedido, id: idActualizar };

                    const actualizado = await service.actualizar(pedidoActualizado);

                    if (!actualizado) {
                        res.writeHead(404);

                        res.end(JSON.stringify({
                            mensaje: "PEDIDO NO EXISTE"
                        }));

                        return;
                    }

                    res.writeHead(200);

                    res.end(JSON.stringify({
                        mensaje: "PEDIDO ACTUALIZADO CORRECTAMENTE"
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

        if (url.startsWith("/pedidos/eliminar/")) {

            if (metodo !== "DELETE") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/pedidos/eliminar/")[1];

            const idEliminar = Number(idTexto);

            if (isNaN(idEliminar) || idEliminar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVÁLIDO" }));
                return;
            }

            const pedido = await service.eliminar(idEliminar);

            if (!pedido) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "PEDIDO CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify({ mensaje: "PEDIDO ELIMINADO CORRECTAMENTE" }));
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