const { useDeliveryStore } = require('./src/services/store');

// Mock console.log to print clearly
const log = (msg) => console.log(`[TEST] ${msg}`);

async function runTest() {
  log('Starting Logic Verification...');
  
  const store = useDeliveryStore.getState();
  
  // 1. Initial State
  if (store.orders.length !== 0) throw new Error('Orders should be empty initially');
  log('Initial State: OK');

  // 2. Create Order (Customer)
  log('Action: Customer creates order...');
  store.createOrder([{ name: 'Burger', price: 10 }], 10.0, '123 Test St');
  
  const stateAfterOrder = useDeliveryStore.getState();
  const orderId = stateAfterOrder.orders[0].id;
  
  if (stateAfterOrder.orders.length !== 1) throw new Error('Order not created');
  if (stateAfterOrder.orders[0].status !== 'PENDING') throw new Error('Order status wrong');
  log(`Order Created: ${orderId} (PENDING)`);

  // 3. Assign Driver (Admin)
  log('Action: Admin assigns Driver d1...');
  store.assignDriver(orderId, 'd1');
  
  const stateAfterAssign = useDeliveryStore.getState();
  if (stateAfterAssign.orders[0].status !== 'ASSIGNED') throw new Error('Order not assigned');
  if (stateAfterAssign.orders[0].driverId !== 'd1') throw new Error('Driver ID mismatch');
  log('Order Assigned: OK');

  // 4. Accept Order (Driver)
  log('Action: Driver accepts order...');
  store.acceptOrder(orderId);
  
  const stateAfterAccept = useDeliveryStore.getState();
  if (stateAfterAccept.orders[0].status !== 'ACCEPTED') throw new Error('Order not accepted');
  log('Order Accepted: OK');

  // 5. Complete Order (Driver)
  log('Action: Driver completes order...');
  store.completeOrder(orderId);
  
  const stateAfterComplete = useDeliveryStore.getState();
  if (stateAfterComplete.orders[0].status !== 'DELIVERED') throw new Error('Order not delivered');
  log('Order Delivered: OK');

  log('✅ ALL TESTS PASSED');
}

runTest().catch(e => {
  console.error('❌ TEST FAILED:', e);
  process.exit(1);
});
