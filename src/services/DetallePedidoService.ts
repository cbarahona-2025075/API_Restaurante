import { DetalleRepository } from "../data/DetallePedidoRepository.js";
import { DetallePedido } from "../models/DetallePedidoModel.js";



export class DetallePedidoService {
    private repository = new DetalleRepository();

    async listar(): Promise<DetallePedido[]> {
        return await this.repository.obtenerDetalle();
    }

    async agregar(detalle: DetallePedido): Promise<void> {



        const detalles = await this.repository.obtenerDetalle();

        const existe = detalles.some(d => d.idDetalle === detalle.idDetalle);

        if (existe) {
            throw new Error("YA EXISTE UN DETALLE CON ESE ID")
        }

        detalles.push(detalle);
        await this.repository.guardarDetalle(detalles);

        console.log("DETALLE CREADO CORRECTAMENTE");
    }

    async buscar(id: number): Promise<DetallePedido | undefined> {
        const detalles = await this.repository.obtenerDetalle();

        return detalles.find(d => d.idDetalle === id);
    }

    async actualizar(detalle: DetallePedido): Promise<boolean> {



        const detalles = await this.repository.obtenerDetalle();

        const indice = detalles.findIndex(d => d.idDetalle === detalle.idDetalle);

        if (indice === -1) {
            console.log("DETALLE NO EXISTE");
            return false;
        }

        detalles[indice] = detalle;

        await this.repository.guardarDetalle(detalles);

        console.log("DETALLE ACTUALIZADO CORRECTAMENTE");
        return true;
    }

    async eliminar(id: number): Promise<boolean> {
        try {
            const detalles = await this.repository.obtenerDetalle();

            const nuevos = detalles.filter(d => d.idDetalle !== id);

            if (nuevos.length === detalles.length) {
                console.log("DETALLE NO ENCONTRADO");
                return false;
            }

            await this.repository.guardarDetalle(nuevos);
            console.log("DETALLE ELIMINADO CORRECTAMENTE");
            return true;
        } catch (error) {
            console.log("ERROR AL ELIMINAR UN DETALLE");
            return false;
        }
    }
}