import { MetodoPago } from "../enums/MetodoPago.js";

export interface Pago {
  idPago: number;
  idPedido: number;
  monto: number;
  metodoPago: MetodoPago;
  fechaPago: string;
}