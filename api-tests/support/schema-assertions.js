// api-tests/support/schema-assertions.js
function isIsoDateString(value) {
  if (typeof value !== "string") return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

function assertErrorResponseSchema(body) {
  expect(body).to.be.an("object");

  // Required fields
  expect(body).to.include.keys("status", "error", "message");

  expect(body.status).to.be.a("number");
  expect(body.error).to.be.a("string");
  expect(body.message).to.be.a("string");

  // Optional field
  if (body.timestamp !== undefined) {
    expect(body.timestamp).to.be.a("string");
    expect(isIsoDateString(body.timestamp)).to.equal(true);
  }
}

function assertPlantShape(plant) {
  expect(plant).to.be.an("object");
  expect(plant).to.have.property("id");
  expect(plant).to.have.property("name");
  expect(plant).to.have.property("price");
  expect(plant).to.have.property("quantity");

  expect(plant.id).to.satisfy((v) => typeof v === "number" || typeof v === "string");
  expect(plant.name).to.be.a("string");
  expect(plant.price).to.be.a("number");
  expect(plant.quantity).to.be.a("number");
}

function assertSaleShape(sale) {
  expect(sale).to.be.an("object");
  expect(sale).to.have.property("id");
  expect(sale).to.have.property("plant");
  expect(sale).to.have.property("quantity");
  expect(sale).to.have.property("totalPrice");
  expect(sale).to.have.property("soldAt");

  expect(sale.id).to.satisfy((v) => typeof v === "number" || typeof v === "string");
  assertPlantShape(sale.plant);

  expect(sale.quantity).to.be.a("number");
  expect(sale.totalPrice).to.be.a("number");
  expect(sale.soldAt).to.be.a("string");
  expect(isIsoDateString(sale.soldAt)).to.equal(true);
}

function assertPageSaleSchema(body, maxSize) {
  expect(body).to.be.an("object");
  expect(body).to.have.property("content");
  expect(body).to.have.property("totalElements");
  expect(body).to.have.property("totalPages");
  expect(body).to.have.property("number");
  expect(body).to.have.property("size");

  expect(body.content).to.be.an("array");
  expect(body.content.length).to.be.at.most(maxSize);

  body.content.forEach(assertSaleShape);
}

module.exports = {
  assertErrorResponseSchema,
  assertSaleShape,
  assertPageSaleSchema,
};
