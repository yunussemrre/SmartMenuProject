// src/types/index.ts

export interface Category {
    id: number;
    name: string;
    imageUrl: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: number;
}

export interface Table {
    id: number;
    tableNumber: string;
    qrKey: string;
    isOccupied: boolean;
}

export interface User {
    id: number;
    username: string;
    role: string;
}

export interface TableCall {
    id: number;
    tableNo: string;
    callType: string;
    callTime: string;
    isHandled: boolean;
}

export interface OrderItem {
    productId: number;
    quantity: number;
    unitPrice: number;
    product?: Product;
}

export interface Order {
    id: number;
    tableId: number;
    table?: Table;
    totalPrice: number;
    isPaid: boolean;
    orderItems: OrderItem[];
    orderDate: string;
}
export interface Settings {
    id: number;
    restaurantName: string;
    logoUrl?: string;
    wifiPassword?: string;
    primaryColor: string;
}