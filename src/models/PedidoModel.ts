import { EstadoPedido } from "../enums/EstadoPedido.js";

export interface Pedido {
  idPedido: number;
  idMesa: number;
  idCliente: number;
  fechaApertura: string;
  fechaCierre: string;
  estado: EstadoPedido;
  total: number;
}