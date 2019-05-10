const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe("Shopping list Service", () => {
  let db;
  let testProducts = [
    {
      id: 1,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      name: "First product!",
      price: "18.00",
      category: "Main",
      checked: true
    },
    {
      id: 2,
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      name: "Second product!",
      price: "20.00",
      category: "Snack",
      checked: true
    },
    {
      id: 3,
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      name: "Third product!",
      price: "30.00",
      category: "Lunch",
      checked: true
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());

  context("shopping_list has data", () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testProducts);
    });

    it("getAllProducts()", () => {
      const expected = [...testProducts];
      return ShoppingListService.getAllProducts(db).then(results => {
        expect(results).to.eql(expected);
      });
    });

    it("insertProduct()", () => {
      const dummyProduct = {
        id: 4,
        date_added: new Date("1918-12-22T16:28:32.615Z"),
        name: "Fourth product!",
        price: "30.00",
        category: "Lunch",
        checked: true
      };
      return ShoppingListService.insertProduct(db, dummyProduct).then(
        insertedProduct => {
          expect(insertedProduct).to.eql(dummyProduct);
        }
      );
    });

    it("getbyId()", () => {
      const firstProduct = {
        id: 1,
        date_added: new Date("2029-01-22T16:28:32.615Z"),
        name: "First product!",
        price: "18.00",
        category: "Main",
        checked: true
      };
      return ShoppingListService.getById(db, 1).then(product => {
        expect(product).to.eql(firstProduct);
      });
    });

    it("deleteProduct()", () => {
      const productId = 3;
      return ShoppingListService.deleteProduct(db, productId)
        .then(() => ShoppingListService.getAllProducts(db))
        .then(allProducts => {
          const expected = testProducts.filter(
            product => product.id !== productId
          );
          expect(allProducts).to.eql(expected);
        });
    });

    it("updateProduct()", () => {
      const expectedProduct = {
        id: 3,
        date_added: new Date("1919-12-22T16:28:32.615Z"),
        name: "New Third Product!",
        price: "30.00",
        category: "Lunch",
        checked: true
      };

      return ShoppingListService.updateProduct(db, 3, {
        name: "New Third Product!"
      })
        .then(() => ShoppingListService.getById(db, 3))
        .then(updatedProduct => {
          expect(updatedProduct).to.eql(expectedProduct);
        });
    });
  });
});
