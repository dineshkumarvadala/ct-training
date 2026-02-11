import { ctpClientHTTPAPI, projectKey } from './BuildClient.js';
import {
  createApiBuilderFromCtpClient,
  type Product,
  type Category,
  type Customer,
  type Cart,
  type Order,
} from '@commercetools/platform-sdk';

const httpApiRoot = createApiBuilderFromCtpClient(
  ctpClientHTTPAPI
).withProjectKey({
  projectKey,
});

async function getProducts(): Promise<void> {
  const response = await httpApiRoot
    .products()
    .get({
      queryArgs: {
        limit: 2,
        offset: 0,
      },
    })
    .execute();

  const { total, count, results } = response.body;

  console.log('\n✅ Products fetched successfully!');
  console.log(`📦 Total products in project : ${total}`);
  console.log(`📄 Products on this page     : ${count}`);
  console.log('─────────────────────────────────────────\n');

  results.forEach((product: Product, index: number) => {
    const current = product.masterData.current;

    const name =
      current.name['en-GB'] ??
      current.name['en'] ??
      Object.values(current.name)[0] ??
      'No name';

    const slug =
      current.slug['en-GB'] ??
      current.slug['en'] ??
      Object.values(current.slug)[0] ??
      '';

    console.log(`${index + 1}. 🛍️  ${name}`);
    console.log(`   ID          : ${product.id}`);
    console.log(`   Slug        : ${slug}`);
    console.log(`   Variants    : ${current.variants.length + 1}`);
    console.log(`   Published   : ${product.masterData.published}`);
    console.log();
  });
}

async function getCategories(): Promise<void> {
  const response = await httpApiRoot
    .categories()
    .get({
      queryArgs: {
        limit: 2,
        offset: 0,
      },
    })
    .execute();

  const { total, count, results } = response.body;

  console.log('\n✅ Categories fetched successfully!');
  console.log(`📂 Total categories in project : ${total}`);
  console.log(`📄 Categories on this page     : ${count}`);
  console.log('─────────────────────────────────────────\n');

  results.forEach((category: Category, index: number) => {
    const name =
      category.name['en-GB'] ??
      category.name['en'] ??
      Object.values(category.name)[0] ??
      'No name';

    const slug =
      category.slug['en-GB'] ??
      category.slug['en'] ??
      Object.values(category.slug)[0] ??
      '';

    console.log(`${index + 1}. 📂 ${name}`);
    console.log(`   ID          : ${category.id}`);
    console.log(`   Key         : ${category.key ?? 'No key'}`);
    console.log(`   Slug        : ${slug}`);
    console.log(`   Parent      : ${category.parent?.id ?? 'Root category'}`);
    console.log();
  });
}

async function getCustomers(): Promise<void> {
  const response = await httpApiRoot
    .customers()
    .get({
      queryArgs: {
        limit: 2,
        offset: 0,
      },
    })
    .execute();

  const { total, count, results } = response.body;

  console.log('\n✅ Customers fetched successfully!');
  console.log(`👤 Total customers in project : ${total}`);
  console.log(`📄 Customers on this page     : ${count}`);
  console.log('─────────────────────────────────────────\n');

  results.forEach((customer: Customer, index: number) => {
    const fullName =
      [customer.firstName, customer.lastName]
        .filter(Boolean)
        .join(' ') || 'No name';

    console.log(`${index + 1}. 👤 ${fullName}`);
    console.log(`   ID    : ${customer.id}`);
    console.log(`   Email : ${customer.email}`);
    console.log(`   Key   : ${customer.key ?? 'No key'}`);
    console.log();
  });
}

async function getCarts(): Promise<void> {
  const response = await httpApiRoot
    .carts()
    .get({
      queryArgs: {
        limit: 2,
        offset: 0,
      },
    })
    .execute();

  const { total, count, results } = response.body;

  console.log('\n✅ Carts fetched successfully!');
  console.log(`🛒 Total carts in project : ${total}`);
  console.log(`📄 Carts on this page     : ${count}`);
  console.log('─────────────────────────────────────────\n');

  results.forEach((cart: Cart, index: number) => {
    const itemCount = cart.lineItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.totalPrice
      ? `${(cart.totalPrice.centAmount / 100).toFixed(2)} ${cart.totalPrice.currencyCode}`
      : 'N/A';

    console.log(`${index + 1}. 🛒 Cart`);
    console.log(`   ID            : ${cart.id}`);
    console.log(`   Customer ID   : ${cart.customerId ?? 'Anonymous'}`);
    console.log(`   Cart State    : ${cart.cartState}`);
    console.log(`   Line Items    : ${cart.lineItems.length}`);
    console.log(`   Total Items   : ${itemCount}`);
    console.log(`   Total Price   : ${totalPrice}`);
    console.log(`   Created       : ${new Date(cart.createdAt).toLocaleDateString()}`);
    console.log();
  });
}

async function getOrders(): Promise<void> {
  const response = await httpApiRoot
    .orders()
    .get({
      queryArgs: {
        limit: 2,
        offset: 0,
      },
    })
    .execute();

  const { total, count, results } = response.body;

  console.log('\n✅ Orders fetched successfully!');
  console.log(`📋 Total orders in project : ${total}`);
  console.log(`📄 Orders on this page     : ${count}`);
  console.log('─────────────────────────────────────────\n');

  results.forEach((order: Order, index: number) => {
    const itemCount = order.lineItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = order.totalPrice
      ? `${(order.totalPrice.centAmount / 100).toFixed(2)} ${order.totalPrice.currencyCode}`
      : 'N/A';

    console.log(`${index + 1}. 📋 Order`);
    console.log(`   ID            : ${order.id}`);
    console.log(`   Order Number  : ${order.orderNumber ?? 'N/A'}`);
    console.log(`   Customer ID   : ${order.customerId ?? 'Guest'}`);
    console.log(`   Order State   : ${order.orderState}`);
    console.log(`   Payment State : ${order.paymentState ?? 'N/A'}`);
    console.log(`   Shipment State: ${order.shipmentState ?? 'N/A'}`);
    console.log(`   Line Items    : ${order.lineItems.length}`);
    console.log(`   Total Items   : ${itemCount}`);
    console.log(`   Total Price   : ${totalPrice}`);
    console.log(`   Created       : ${new Date(order.createdAt).toLocaleDateString()}`);
    console.log();
  });
}

async function main(): Promise<void> {
  console.log(' Fetching Commercetools Data...\n');
  console.log('═════════════════════════════════════════');
  
  await getProducts();
  await getCategories();
  await getCustomers();
  await getCarts();
  await getOrders();
  
  console.log('═════════════════════════════════════════');
  console.log('✨ All data fetched successfully!\n');
}

main().catch(console.error);


// // async function getProductById(productId: string): Promise<void> {
// //   const response = await httpApiRoot
// //     .products()
// //     .withId({ ID: productId })
// //     .get()
// //     .execute();
// //   const product: Product = response.body;
// //   console.log('✅ Product fetched successfully!');
// //   console.log(`🆔 ID   : ${product.id}`);
// //   console.log(
// //     `📦 Name : ${
// //       product.masterData.current.name['en-GB'] ??
// //       product.masterData.current.name['en'] ??
// //       Object.values(product.masterData.current.name)[0]
// //     }`
// //   );
// //   console.log(
// //     `🔑 Key  : ${product.key ?? 'No Key Set'}`
// //   );
// //   console.log(
// //     `📌 Published : ${product.masterData.published}\n`
// //   );
// // }

// // // Create readline interface
// // const rl = readline.createInterface({
// //   input: process.stdin,
// //   output: process.stdout,
// // });

// // // Prompt for product ID
// // rl.question('Enter Product ID: ', async (productId) => {
// //   rl.close();
// //   await getProductById(productId.trim()).catch(console.error);
// // });