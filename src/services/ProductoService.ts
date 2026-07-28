import { ProductoRepository } from "../data/ProductoRepository.js";
import { Producto } from "../models/ProductoModel.js";



export class ProductoService {
    private repository = new ProductoRepository();

    async listar(): Promise<Producto[]> {
        return await this.repository.obtenerProducto();
    }

    async agregar(producto: Producto): Promise<void> {



        const productos = await this.repository.obtenerProducto();

        const existe = productos.some(p => p.idProducto === producto.idProducto);

        if(existe){
            throw new Error("YA EXISTE UN PRODUCTO CON ESE ID")
        }

        productos.push(producto);
        await this.repository.guardarProducto(productos);

        console.log("PRODUCTO CREADO CORRECTAMENTE");
    }

    async buscar(id: number): Promise<Producto | undefined> {
        const productos = await this.repository.obtenerProducto();

        return productos.find(p => p.idProducto === id);
    }

    async actualizar(producto: Producto): Promise<boolean> {



        const productos = await this.repository.obtenerProducto();

        const indice = productos.findIndex(p => p.idProducto === producto.idProducto);

        if(indice === -1){
            console.log("PRODUCTO NO EXISTE");
            return false;
        }

        productos[indice] = producto;

        await this.repository.guardarProducto(productos);

        console.log("PRODUCTO ACTUALIZADO CORRECTAMENTE");
        return true;
    }

    async eliminar(id: number): Promise<boolean> {
        try {
            const productos = await this.repository.obtenerProducto();

            const nuevos = productos.filter(p => p.idProducto !== id);

            if(nuevos.length === productos.length){
                console.log("PRODUCTO NO ENCONTRADO");
                return false;
            }

            await this.repository.guardarProducto(nuevos);
            console.log("PRODUCTO ELIMINADO CORRECTAMENTE");
            return true;
        } catch (error) {
            console.log("ERROR AL ELIMINAR UN PRODUCTO");
            return false;
        }
    }
}