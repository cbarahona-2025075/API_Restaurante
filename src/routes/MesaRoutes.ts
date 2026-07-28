import { IncomingMessage, ServerResponse } from "node:http";
import { MesaService } from "../services/MesaService.js";

const service = new MesaService();

export async function mesaRoutes(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        if (url === "/mesas") {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const mesas = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(mesas));

            return;
        }


        if (url === "/mesas/post") {

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
                    const mesa = JSON.parse(body);
                    await service.agregar(mesa);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "MESA AGREGADA CORRECTAMENTE"
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

        if (url.startsWith("/mesas/buscar/")) {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/mesas/buscar/")[1];
            const idBuscar = Number(idTexto);

            if (isNaN(idBuscar) || idBuscar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVALIDO" }));
                return;
            }

            const mesa = await service.buscar(idBuscar);

            if (!mesa) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "MESA CON ESE ID NO ENCONTRADA" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify(mesa));
            return;

        }

        if (url.startsWith("/mesas/actualizar/")) {

            if (metodo !== "PUT") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/mesas/actualizar/")[1];

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
                    const mesa = JSON.parse(body);

                    const mesaActualizada = { ...mesa, id: idActualizar };

                    const actualizada = await service.actualizar(mesaActualizada);

                    if (!actualizada) {
                        res.writeHead(404);

                        res.end(JSON.stringify({
                            mensaje: "MESA NO EXISTE"
                        }));

                        return;
                    }

                    res.writeHead(200);

                    res.end(JSON.stringify({
                        mensaje: "MESA ACTUALIZADA CORRECTAMENTE"
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

        if (url.startsWith("/mesas/eliminar/")) {

            if (metodo !== "DELETE") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/mesas/eliminar/")[1];

            const idEliminar = Number(idTexto);

            if (isNaN(idEliminar) || idEliminar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVÁLIDO" }));
                return;
            }

            const mesa = await service.eliminar(idEliminar);

            if (!mesa) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "MESA CON ESE ID NO ENCONTRADA" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify({ mensaje: "MESA ELIMINADA CORRECTAMENTE" }));
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