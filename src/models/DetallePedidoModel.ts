export interface DetallePedido {
  idDetalle: number;
  idPedido: number;
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
