import { PagoRepository } from "../data/PagoRepository.js";
import { Pago } from "../models/PagoModel.js";



export class PagoService {
    private repository = new PagoRepository();

    async listar(): Promise<Pago[]> {
        return await this.repository.obtenerPago();
    }

    async agregar(pago: Pago): Promise<void> {



        const pagos = await this.repository.obtenerPago();

        const existe = pagos.some(p => p.idPago === pago.idPago);

        if (existe) {
            throw new Error("YA EXISTE UN PAGO CON ESE ID")
        }

        pagos.push(pago);
        await this.repository.guardarPago(pagos);

        console.log("PAGO CREADO CORRECTAMENTE");
    }

    async buscar(id: number): Promise<Pago | undefined> {
        const pagos = await this.repository.obtenerPago();

        return pagos.find(p => p.idPago === id);
    }

    async actualizar(pago: Pago): Promise<boolean> {



        const pagos = await this.repository.obtenerPago();

        const indice = pagos.findIndex(p => p.idPago === pago.idPago);

        if (indice === -1) {
            console.log("PAGO NO EXISTE");
            return false;
        }

        pagos[indice] = pago;

        await this.repository.guardarPago(pagos);

        console.log("PAGO ACTUALIZADO CORRECTAMENTE");
        return true;
    }

    async eliminar(id: number): Promise<boolean> {
        try {
            const pagos = await this.repository.obtenerPago();

            const nuevos = pagos.filter(p => p.idPago !== id);

            if (nuevos.length === pagos.length) {
                console.log("PAGO NO ENCONTRADO");
                return false;
            }

            await this.repository.guardarPago(nuevos);
            console.log("PAGO ELIMINADO CORRECTAMENTE");
            return true;
        } catch (error) {
            console.log("ERROR AL ELIMINAR UN PAGO");
            return false;
        }
    }
}