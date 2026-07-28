import { IncomingMessage, ServerResponse } from "node:http";
import { ClienteService } from "../services/ClienteService.js";

const service = new ClienteService();

export async function clienteRoutes(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        if (url === "/clientes") {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const clientes = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(clientes));

            return;
        }


        if (url === "/clientes/post") {

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
                    const cliente = JSON.parse(body);
                    await service.agregar(cliente);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "CLIENTE AGREGADO CORRECTAMENTE"
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

        if (url.startsWith("/clientes/buscar/")) {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/clientes/buscar/")[1];
            const idBuscar = Number(idTexto);

            if (isNaN(idBuscar) || idBuscar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVALIDO" }));
                return;
            }

            const cliente = await service.buscar(idBuscar);

            if (!cliente) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "CLIENTE CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify(cliente));
            return;

        }

        if (url.startsWith("/clientes/actualizar/")) {

            if (metodo !== "PUT") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/clientes/actualizar/")[1];

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
                    const cliente = JSON.parse(body);

                    const clienteActualizado = { ...cliente, id: idActualizar };

                    const actualizado = await service.actualizar(clienteActualizado);

                    if (!actualizado) {
                        res.writeHead(404);

                        res.end(JSON.stringify({
                            mensaje: "CLIENTE NO EXISTE"
                        }));

                        return;
                    }

                    res.writeHead(200);

                    res.end(JSON.stringify({
                        mensaje: "CLIENTE ACTUALIZADO CORRECTAMENTE"
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

        if (url.startsWith("/clientes/eliminar/")) {

            if (metodo !== "DELETE") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/clientes/eliminar/")[1];

            const idEliminar = Number(idTexto);

            if (isNaN(idEliminar) || idEliminar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVÁLIDO" }));
                return;
            }

            const cliente = await service.eliminar(idEliminar);

            if (!cliente) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "CLIENTE CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify({ mensaje: "CLIENTE ELIMINADO CORRECTAMENTE" }));
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