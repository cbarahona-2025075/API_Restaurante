import { ClienteRepository } from "../data/ClienteRepository.js";
import { Cliente } from "../models/ClienteModel.js";



export class ClienteService {
    private repository = new ClienteRepository();

    async listar(): Promise<Cliente[]> {
        return await this.repository.obtenerCliente();
    }

    async agregar(cliente: Cliente): Promise<void> {



        const clientes = await this.repository.obtenerCliente();

        const existe = clientes.some(c => c.idCliente === cliente.idCliente);

        if(existe){
            throw new Error("YA EXISTE UN CLIENTE CON ESE ID");
        }

        const correoDuplicado = clientes.some(c => c.email === cliente.email);

        if (correoDuplicado) {
            throw new Error(`Ya existe un usuario con el correo "${cliente.email}"`);
        }

        clientes.push(cliente);
        await this.repository.guardarCliente(clientes);

        console.log("CLIENTE CREADO CORRECTAMENTE");
    }

    async buscar(id:number): Promise<Cliente | undefined> {
        const clientes = await this.repository.obtenerCliente();

        return clientes.find(c => c.idCliente === id);
    }

    async actualizar(cliente: Cliente): Promise<boolean> {



        const clientes = await this.repository.obtenerCliente();

        const indice = clientes.findIndex(c => c.idCliente === cliente.idCliente);

          if (indice === -1) {
            console.log("CLIENTE NO EXISTE");
            return false;
        }

         const correoDuplicado = clientes.some(
            c => c.email === cliente.email && c.idCliente !== cliente.idCliente
        );

        if (correoDuplicado) {
            throw new Error(`Ya existe otro cliente con el correo "${cliente.email}"`);
        }

        clientes[indice] = cliente;

        await this.repository.guardarCliente(clientes);

        console.log("CLIENTE ACTUALIZADO CORRECTAMENTE");
        return true;
    }

    async eliminar(id: number): Promise<boolean> {
        try {
            const clientes = await this.repository.obtenerCliente();

            const nuevos = clientes.filter(c => c.idCliente !== id);

            if(nuevos.length === clientes.length){
                console.log("CLIENTE NO ENCONTRADO");
                return false;
            }

            await this.repository.guardarCliente(nuevos);
            console.log("CLIENTE ELIMINADO CORRECTAMENTE");
            return true;
        } catch (error) {
            console.log("ERROR AL ELIMINAR UN CLIENTE");
            return false;
        }
    }
}