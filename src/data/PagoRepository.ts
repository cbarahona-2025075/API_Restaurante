import { readFile, writeFile } from "fs/promises";
import { Pago } from "../models/PagoModel.js";

export class PagoRepository {

    private ruta = "./src/data/pagos.json";

    async obtenerPago(): Promise<Pago[]> {

        try {
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarPago(pagos: Pago[]): Promise<void> {
        try {
           
            await writeFile(
                this.ruta,
                JSON.stringify(pagos, null, 4)
            );
        } catch (error) {
            console.log("ERROR AL GUARDAR");
            throw error;
        }
    }
}