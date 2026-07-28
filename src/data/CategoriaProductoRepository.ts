import { readFile, writeFile } from "fs/promises";
import { CategoriaProducto } from "../models/CategoriaProductoModel.js";

export class CategoriaProductoRepository {

    private ruta = "./src/data/categoriaproducto.json";

    async obtenerCategoria(): Promise<CategoriaProducto[]> {

        try {
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarCategoria(categorias: CategoriaProducto[]): Promise<void> {
        try {
            
            await writeFile(
                this.ruta,
                JSON.stringify(categorias, null, 4)
            );
        } catch (error) {
            console.log("ERROR AL GUARDAR");
            throw error;
        }
    }
}