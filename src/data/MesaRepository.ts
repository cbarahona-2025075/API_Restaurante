import { readFile, writeFile } from "fs/promises";
import { Mesa } from "../models/MesaModel.js";

export class MesaRepository {

    private ruta = "./src/data/mesas.json";

    async obtenerMesa(): Promise<Mesa[]> {

        try {
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarMesa(mesas: Mesa[]): Promise<void> {
        try {
            
            await writeFile(
                this.ruta,
                JSON.stringify(mesas, null, 4)
            );
        } catch (error) {
            console.log("ERROR AL GUARDAR");
            throw error;
        }
    }

}
