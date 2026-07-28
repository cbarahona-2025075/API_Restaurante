import { CategoriaProductoRepository } from "../data/CategoriaProductoRepository.js";
import { CategoriaProducto } from "../models/CategoriaProductoModel.js";



export class CategoriaProductoService {
    private repository = new CategoriaProductoRepository();

    async listar(): Promise<CategoriaProducto[]> {
        return await this.repository.obtenerCategoria();
    }

    async agregar(categoria: CategoriaProducto): Promise<void> {



        const categorias = await this.repository.obtenerCategoria();

        const existe = categorias.some(c => c.idCategoria === categoria.idCategoria);

        if(existe){
            throw new Error("YA EXISTE UNA CATEGORIA CON ESE ID")
        }

        categorias.push(categoria);
        await this.repository.guardarCategoria(categorias);

        console.log("CATEGORIA CREADA CORRECTAMENTE");
    }

    async buscar(id: number): Promise<CategoriaProducto | undefined> {
        const categorias = await this.repository.obtenerCategoria();

        return categorias.find(c => c.idCategoria === id);
    }

    async actualizar(categoria: CategoriaProducto): Promise<boolean> {



        const categorias = await this.repository.obtenerCategoria();

        const indice = categorias.findIndex(c => c.idCategoria === categoria.idCategoria);

        if(indice === -1){
            console.log("CATEGORIA NO EXISTE");
            return false;
        }

        categorias[indice] = categoria;

        await this.repository.guardarCategoria(categorias);

        console.log("CATEGORIA ACTUALIZADA CORRECTAMENTE");
        return true;
    }

    async eliminar(id: number): Promise<boolean> {
        try {
            const categorias = await this.repository.obtenerCategoria();

            const nuevos = categorias.filter(c => c.idCategoria !== id);

            if(nuevos.length === categorias.length){
                console.log("CATEGORIA NO ENCONTRADA");
                return false;
            }

            await this.repository.guardarCategoria(nuevos);
            console.log("CATEGORIA ELIMINADA CORRECTAMENTE");
            return true;
        } catch (error) {
            console.log("ERROR AL ELIMINAR UNA CATEGORIA");
            return false;
        }
    }
}