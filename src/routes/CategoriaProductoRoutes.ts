import { IncomingMessage, ServerResponse } from "node:http";
import { CategoriaProductoService } from "../services/CategoriaProductoService.js";

const service = new CategoriaProductoService();

export async function categoriaRoutes(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        if (url === "/categorias") {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const categorias = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(categorias));

            return;
        }


        if (url === "/categorias/post") {

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
                    const categoria = JSON.parse(body);
                    await service.agregar(categoria);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "CATEGORIA AGREGADA CORRECTAMENTE"
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

        if (url.startsWith("/categorias/buscar/")) {

            if (metodo !== "GET") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/categorias/buscar/")[1];
            const idBuscar = Number(idTexto);

            if (isNaN(idBuscar) || idBuscar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVALIDO" }));
                return;
            }

            const categoria = await service.buscar(idBuscar);

            if (!categoria) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "CATEGORIA CON ESE ID NO ENCONTRADA" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify(categoria));
            return;

        }

        if (url.startsWith("/categorias/actualizar/")) {

            if (metodo !== "PUT") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/categorias/actualizar/")[1];

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
                    const categoria = JSON.parse(body);

                    const categoriaActualizada = { ...categoria, id: idActualizar };

                    const actualizado = await service.actualizar(categoriaActualizada);

                    if (!actualizado) {
                        res.writeHead(404);

                        res.end(JSON.stringify({
                            mensaje: "CATEGORIA NO EXISTE"
                        }));

                        return;
                    }

                    res.writeHead(200);

                    res.end(JSON.stringify({
                        mensaje: "CATEGORIA ACTUALIZADA CORRECTAMENTE"
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

        if (url.startsWith("/categorias/eliminar/")) {

            if (metodo !== "DELETE") {
                res.writeHead(405);
                res.end(JSON.stringify({ mensaje: "MÉTODO NO PERMITIDO PARA ESTA RUTA" }));
                return;
            }

            const idTexto = url.split("/categorias/eliminar/")[1];

            const idEliminar = Number(idTexto);

            if (isNaN(idEliminar) || idEliminar <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ mensaje: "ID INVÁLIDO" }));
                return;
            }

            const categoria = await service.eliminar(idEliminar);

            if (!categoria) {
                res.writeHead(404);
                res.end(JSON.stringify({ mensaje: "CATEGORIA CON ESE ID NO ENCONTRADA" }))
                return;
            }

            res.writeHead(200)
            res.end(JSON.stringify({ mensaje: "CATEGORIA ELIMINADA CORRECTAMENTE" }));
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