import { readFile, writeFile } from "fs/promises";
import { Pedido } from "../models/PedidoModel.js";

export class PedidoRepository {

    private ruta = "./src/data/pedidos.json";

    async obtenerPedido(): Promise<Pedido[]> {

        try {
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarPedido(pedidos: Pedido[]): Promise<void> {
        try {
            
            await writeFile(
                this.ruta,
                JSON.stringify(pedidos, null, 4)
            );
        } catch (error) {
            console.log("ERROR AL GUARDAR");
            throw error;
        }
    }
}