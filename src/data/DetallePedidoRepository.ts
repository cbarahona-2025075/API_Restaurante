import { readFile, writeFile } from "fs/promises";
import { DetallePedido } from "../models/DetallePedidoModel.js";

export class DetalleRepository {

    private ruta = "./src/data/detalles.json";

    async obtenerDetalle(): Promise<DetallePedido[]> {

        try {
            
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarDetalle(detalles: DetallePedido[]): Promise<void> {
        try {
            
            await writeFile(
                this.ruta,
                JSON.stringify(detalles, null, 4)
            );
        } catch (error) {
           console.log("ERROR AL GUARDAR");
           throw error;
        }
    }
}