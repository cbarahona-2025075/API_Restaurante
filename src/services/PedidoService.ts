import { PedidoRepository } from "../data/PedidoRepository.js";
import { Pedido } from "../models/PedidoModel.js";



export class PedidoService {
    private repository = new PedidoRepository();

    async listar(): Promise<Pedido[]> {
        return await this.repository.obtenerPedido();
    }

    async agregar(pedido: Pedido): Promise<void> {



        const pedidos = await this.repository.obtenerPedido();

        const existe = pedidos.some(p => p.idPedido === pedido.idPedido);

        if (existe) {
            throw new Error("YA EXISTE UN PEDIDO CON ESE ID")
        }

        pedidos.push(pedido);
        await this.repository.guardarPedido(pedidos);

        console.log("PEDIDO CREADO CORRECTAMENTE");
    }

    async buscar(id: number): Promise<Pedido | undefined> {
        const pedidos = await this.repository.obtenerPedido();

        return pedidos.find(p => p.idPedido === id);
    }

    async actualizar(pedido: Pedido): Promise<boolean> {



        const pedidos = await this.repository.obtenerPedido();

        const indice = pedidos.findIndex(p => p.idPedido === pedido.idPedido);

        if (indice === -1) {
            console.log("PEDIDO NO EXISTE");
            return false;
        }

        pedidos[indice] = pedido;

        await this.repository.guardarPedido(pedidos);

        console.log("PEDIDO ACTUALIZADO CORRECTAMENTE");
        return true;
    }

    async eliminar(id: number): Promise<boolean> {
        try {
            const pedidos = await this.repository.obtenerPedido();

            const nuevos = pedidos.filter(p => p.idPedido !== id);

            if (nuevos.length === pedidos.length) {
                console.log("PEDIDO NO ENCONTRADO");
                return false;
            }

            await this.repository.guardarPedido(nuevos);
            console.log("PEDIDO ELIMINADO CORRECTAMENTE");
            return true;
        } catch (error) {
            console.log("ERROR AL ELIMINAR UN PEDIDO");
            return false;
        }
    }
}