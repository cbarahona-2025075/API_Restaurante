import { IncomingMessage, ServerResponse } from "node:http";
import { PagoService } from "../services/PagoServise.js";

const service = new PagoService();

export async function pagoRoutes(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        if (url === "/pagos") {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const pagos = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(pagos));

            return;
        }


        if (url === "/pagos/post") {

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
                    const pago = JSON.parse(body);
                    await service.agregar(pago);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "PAGO AGREGADO CORRECTAMENTE"
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

        if (url.startsWith("/pagos/buscar/")) {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/pagos/buscar/")[1];
            const idBuscar = Number(idTexto);

            if (isNaN(idBuscar) || idBuscar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVALIDO" }));
                return;
            }

            const pago = await service.buscar(idBuscar);

            if (!pago) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "PAGO CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify(pago));
            return;

        }

        if (url.startsWith("/pagos/actualizar/")) {

            if (metodo !== "PUT") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/pagos/actualizar/")[1];

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
                    const pago = JSON.parse(body);

                    const pagoActualizado = { ...pago, id: idActualizar };

                    const actualizado = await service.actualizar(pagoActualizado);

                    if (!actualizado) {
                        res.writeHead(404);

                        res.end(JSON.stringify({
                            mensaje: "PAGO NO EXISTE"
                        }));

                        return;
                    }

                    res.writeHead(200);

                    res.end(JSON.stringify({
                        mensaje: "PAGO ACTUALIZADO CORRECTAMENTE"
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

        if (url.startsWith("/pagos/eliminar/")) {

            if (metodo !== "DELETE") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/pagos/eliminar/")[1];

            const idEliminar = Number(idTexto);

            if (isNaN(idEliminar) || idEliminar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVÁLIDO" }));
                return;
            }

            const pago = await service.eliminar(idEliminar);

            if (!pago) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "PAGO CON ESE ID NO ENCONTRADO" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify({ mensaje: "PAGO ELIMINADO CORRECTAMENTE" }));
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