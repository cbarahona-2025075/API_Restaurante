import { MesaRepository } from "../data/MesaRepository.js";
import { Mesa } from "../models/MesaModel.js";



export class MesaService {
    private repository = new MesaRepository();

    async listar(): Promise<Mesa[]> {
        return await this.repository.obtenerMesa();
    }

    async agregar(mesa: Mesa): Promise<void> {



        const mesas = await this.repository.obtenerMesa();

        const existe = mesas.some(m => m.idMesa === mesa.idMesa);

        if(existe){
            throw new Error("YA EXISTE UNA MESA CON ESA ID");
        }

        mesas.push(mesa);
        await this.repository.guardarMesa(mesas);

        console.log("MESA CREADA CORRECTAMENTE");
    }

    async buscar(id: number): Promise<Mesa | undefined> {
        const mesas = await this.repository.obtenerMesa();

        return mesas.find(m => m.idMesa === id);
    }

    async actualizar(mesa: Mesa): Promise<boolean> {



        const mesas = await this.repository.obtenerMesa();

        const indice = mesas.findIndex(m => m.idMesa === mesa.idMesa);

        if(indice === -1){
            console.log("MESA NO EXISTE");
        }

        mesas[indice] = mesa;

        await this.repository.guardarMesa(mesas);

        console.log("MESA ACTUALIZADA CORRECTAMENTE");
        return true;
    }

    async eliminar(id: number): Promise<boolean> {
        try {
            const mesas = await this.repository.obtenerMesa();

            const nuevos = mesas.filter(m => m.idMesa !== id);

            if(nuevos.length === mesas.length){
                console.log("MESA NO ENCONTRADA")
                return false;
            }

            await this.repository.guardarMesa(nuevos);
            console.log("MESA ELIMINADA CORRECTAMENTE");
            return true;
        } catch (error) {
            console.log("ERRO AL ELIMINAR UNA MESA");
            return false;
        }
    }
}