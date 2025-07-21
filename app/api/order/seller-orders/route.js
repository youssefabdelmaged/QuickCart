import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find all products owned by this seller
    const sellerProducts = await Product.find({ userId }).select('_id');
    const productIds = sellerProducts.map(product => product._id.toString());

    if (productIds.length === 0) {
      return NextResponse.json({ success: true, orders: [] });
    }

    // Find orders that contain any of the seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
    .populate({
      path: 'items.product',
      select: 'name price image userId'
    })
    .populate({
      path: 'address',
      select: 'fullName phoneNumber area city state pinCode'
    })
    .sort({ date: -1 });

    // Filter and format the orders to only include seller's products
    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => 
        productIds.includes(item.product._id.toString())
      );
      
      const orderTotal = sellerItems.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 
        0
      );

      return {
        _id: order._id,
        items: sellerItems,
        amount: orderTotal,
        address: order.address,
        status: order.status,
        date: order.date
      };
    });

    return NextResponse.json({ 
      success: true, 
      orders: sellerOrders
    });

  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}
