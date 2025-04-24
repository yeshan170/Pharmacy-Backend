import { Order, OrderStatus } from '../models/order.model';
import { UserRole } from '../models/user.model';
import { AppError } from '../middleware/error';
import mongoose from 'mongoose';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderResponse,
  OrderListResponse,
  OrderData,
} from '../interfaces/order.interface';

export class OrderService {
  public static async createOrder(
    orderData: CreateOrderDto,
    customerId: mongoose.Types.ObjectId
  ): Promise<OrderResponse> {
    // Validate pharmacy ID
    if (!mongoose.Types.ObjectId.isValid(orderData.pharmacy)) {
      throw new AppError('Invalid pharmacy ID', 400);
    }

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    // Validate quantities
    for (const item of orderData.items) {
      if (item.quantity < 1) {
        throw new AppError('Item quantity must be at least 1', 400);
      }
    }

    // Validate total amount
    if (orderData.totalAmount <= 0) {
      throw new AppError('Total amount must be greater than 0', 400);
    }

    const order = await Order.create({
      ...orderData,
      customer: customerId,
    });

    const populatedOrder = await order.populate([
      { path: 'customer', select: 'name email' },
      { path: 'pharmacy', select: 'name address phone' },
    ]);

    return {
      success: true,
      data: this.transformOrderData(populatedOrder),
    };
  }

  public static async getCustomerOrders(
    customerId: mongoose.Types.ObjectId
  ): Promise<OrderListResponse> {
    const orders = await Order.find({ customer: customerId })
      .populate('pharmacy', 'name address phone')
      .populate('customer', 'name email')
      .select('-__v');

    return {
      success: true,
      count: orders.length,
      data: orders.map(this.transformOrderData),
    };
  }

  public static async getPharmacyOrders(
    pharmacyId: mongoose.Types.ObjectId
  ): Promise<OrderListResponse> {
    const orders = await Order.find({ pharmacy: pharmacyId })
      .populate('customer', 'name email')
      .populate('pharmacy', 'name address phone')
      .select('-__v');

    return {
      success: true,
      count: orders.length,
      data: orders.map(this.transformOrderData),
    };
  }

  public static async getOrderById(
    orderId: string,
    userId: mongoose.Types.ObjectId,
    userRole: UserRole,
    pharmacyId?: mongoose.Types.ObjectId
  ): Promise<OrderResponse> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await Order.findById(orderId)
      .populate('pharmacy', 'name address phone')
      .populate('customer', 'name email')
      .select('-__v');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check authorization
    if (
      userRole === UserRole.CUSTOMER &&
      order.customer.toString() !== userId.toString()
    ) {
      throw new AppError('Not authorized to view this order', 403);
    }

    if (
      userRole === UserRole.PHARMACY &&
      pharmacyId &&
      order.pharmacy.toString() !== pharmacyId.toString()
    ) {
      throw new AppError('Not authorized to view this order', 403);
    }

    return {
      success: true,
      data: this.transformOrderData(order),
    };
  }

  public static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    pharmacyId: mongoose.Types.ObjectId
  ): Promise<OrderResponse> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    if (!Object.values(OrderStatus).includes(status)) {
      throw new AppError('Invalid order status', 400);
    }

    const order = await Order.findById(orderId)
      .populate('pharmacy', 'name address phone')
      .populate('customer', 'name email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check if the pharmacy owns this order
    if (order.pharmacy._id.toString() !== pharmacyId.toString()) {
      throw new AppError('Not authorized to update this order', 403);
    }

    // Validate status transition
    if (!this.isValidStatusTransition(order.status, status)) {
      throw new AppError('Invalid status transition', 400);
    }

    order.status = status;
    await order.save();

    return {
      success: true,
      data: this.transformOrderData(order),
    };
  }

  public static async cancelOrder(
    orderId: string,
    customerId: mongoose.Types.ObjectId
  ): Promise<OrderResponse> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError('Invalid order ID', 400);
    }

    const order = await Order.findById(orderId)
      .populate('pharmacy', 'name address phone')
      .populate('customer', 'name email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check if the customer owns this order
    if (order.customer._id.toString() !== customerId.toString()) {
      throw new AppError('Not authorized to cancel this order', 403);
    }

    // Check if order can be cancelled
    if (order.status !== OrderStatus.PENDING) {
      throw new AppError('Order can only be cancelled when pending', 400);
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    return {
      success: true,
      data: this.transformOrderData(order),
    };
  }

  private static transformOrderData(order: any): OrderData {
    return {
      id: order._id,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
      },
      pharmacy: {
        name: order.pharmacy.name,
        address: order.pharmacy.address,
        phone: order.pharmacy.phone,
      },
      items: order.items,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      totalAmount: order.totalAmount,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private static isValidStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): boolean {
    const validTransitions: { [key in OrderStatus]?: OrderStatus[] } = {
      [OrderStatus.PENDING]: [
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.CONFIRMED]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PROCESSING]: [
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.OUT_FOR_DELIVERY]: [
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
      ],
    };

    const allowedStatuses = validTransitions[currentStatus];
    return allowedStatuses ? allowedStatuses.includes(newStatus) : false;
  }
} 