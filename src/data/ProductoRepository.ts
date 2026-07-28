import { readFile, writeFile } from "fs/promises";
import { Producto } from "../models/ProductoModel.js";

export class ProductoRepository {

    private ruta = "./src/data/productos.json";
    
    async obtenerProducto(): Promise<Producto[]> {

        try {
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarProducto(productos: Producto[]): Promise<void> {
        try {
            
            await writeFile(
                this.ruta,
                JSON.stringify(productos, null, 4)
            );
        } catch (error) {
            console.log("ERROR AL GUARDAR");
            throw error;
        }
    }
}