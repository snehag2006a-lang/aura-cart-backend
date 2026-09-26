
const Product = require("../models/Product");

const updateInventoryAfterPayment = async (transaction) => {
  try {
    const productsToUpdate = [];

    // STEP 1: Validate ALL products first
    for (const item of transaction.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(
          "Product not found: " + item.productId
        );
      }

      // Check sufficient inventory
      if (product.inventory < item.quantity) {
        throw new Error(
          "Insufficient inventory for " + product.name
        );
      }

      productsToUpdate.push({
        product,
        quantity: item.quantity
      });
    }

    // STEP 2: Update inventory only after ALL validation succeeds
    for (const item of productsToUpdate) {
      item.product.inventory -= item.quantity;

      await item.product.save();
    }

    return {
      success: true,
      message: "Inventory updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: "Inventory update failed",
      error: error.message
    };
  }
};

module.exports = {
  updateInventoryAfterPayment
};