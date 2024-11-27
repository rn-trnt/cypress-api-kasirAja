describe("/products", () => {
  /**
   * #######################################################################################################
   * Products - Add Product
   * Use this api to add new product
   * #######################################################################################################
   */

  describe("Add Product", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing categoryId
     * 4. error message for missing code
     * 5. error message for missing name
     * 6. error message for missing price
     * 7. error message for missing cost
     * 8. error message for missing stock
     * 9. error message when price is lower than cost
     * 10. successfully create new product
     */
    let products = [];

    before("setup", () => {
      cy.login();
      cy.generateProduct("makanan ringan", "makanan ringan dari indofood").then(
        (product) => {
          products.push(product);
          cy.log(products);
        }
      );
    });

    it("should return error for empty body", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"value" must be of type object');
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        body: {
          category_id: products[0]?.category_id,
          code: products[0]?.code,
          name: products[0]?.name,
          price: products[0]?.price,
          cost: products[0]?.cost,
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing categoryId", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          code: products[0]?.code,
          name: products[0]?.name,
          price: products[0]?.price,
          cost: products[0]?.cost,
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"category_id" is required');
      });
    });

    it("should return error message for missing code", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0]?.category_id,
          name: products[0]?.name,
          price: products[0]?.price,
          cost: products[0]?.cost,
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"code" is required');
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0]?.category_id,
          code: products[0]?.code,
          price: products[0]?.price,
          cost: products[0]?.cost,
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"name" is required');
      });
    });

    it("should return error message for missing price", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0]?.category_id,
          code: products[0]?.code,
          name: products[0]?.name,
          cost: products[0]?.cost,
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"price" is required');
      });
    });

    it("should return error message for missing cost", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0]?.category_id,
          code: products[0]?.code,
          name: products[0]?.name,
          price: products[0]?.price,
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"cost" is required');
      });
    });

    it("should return error message for missing stock", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0]?.category_id,
          code: products[0]?.code,
          name: products[0]?.name,
          price: products[0]?.price,
          cost: products[0]?.cost,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"stock" is required');
      });
    });

    it("should return error message when price is lower than cost", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0]?.category_id,
          code: products[0]?.code,
          name: products[0]?.name,
          price: "100",
          cost: "1000",
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"price" must be greater than ref:cost');
      });
    });

    it("should successfully create new product", () => {
      cy.api({
        method: "POST",
        url: `/products`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0]?.category_id,
          code: products[0]?.code,
          name: products[0]?.name,
          price: products[0]?.price,
          cost: products[0]?.cost,
          stock: products[0]?.stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Product berhasil ditambahkan");
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.name).to.eq(products[0]?.name);
        expect(response.body.data.productId).not.to.be.null;
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Products - Get Product Detail
   * Use this api to get about one product details
   * #######################################################################################################
   */
  describe("Get Product Detail", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid productId
     * 3. successfully get product detail
     */

    let products = [];

    before("setup", () => {
      cy.login();
      cy.addProduct("makanan ringan", "makanan ringan dari indofood").then(
        (product) => {
          products.push(product);
          cy.log(products);
        }
      );
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "GET",
        url: `/products/${products[0]?.productId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid productId ", () => {
      cy.api({
        method: "GET",
        url: `/products/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully get product detail", () => {
      cy.api({
        method: "GET",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.product.code).to.eq(products[0].code);
        expect(response.body.data.product.name).to.eq(products[0].name);
        expect(response.body.data.product.description).to.be.null;
        expect(response.body.data.product.price).to.eq(products[0].price);
        expect(response.body.data.product.cost).to.eq(products[0].cost);
        expect(response.body.data.product.cost_average).to.be.null;
        expect(response.body.data.product.category_name).to.eq(
          products[0].category_name
        );
        expect(response.body.data.product.category_id).to.eq(
          products[0].category_id
        );
        expect(response.body.data.product.stock).to.eq(
          `${products[0].stock}.00`
        );
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Products - Get Product List
   * Use this api to get a list of products associated with user’s token
   * #######################################################################################################
   */
  describe("Get Product List", () => {
    /**
     * 1. error message for empty header
     * 2. information for product not found
     * 3. successfully get product list
     */

    let products = [];

    before("setup", () => {
      cy.login();
      cy.addProduct("makanan ringan", "makanan ringan dari indofood").then(
        (product) => {
          products.push(product);
        }
      );

      cy.addProduct("makanan berat", "makanan ringan dari indofood").then(
        (product) => {
          products.push(product);
        }
      );

      cy.log(products);
    });

    it("should successfully get product list", () => {
      const q = "Produk";
      const page = 1;
      const withStock = true;
      const withCategory = true;
      // const categoryId = products[0]?.category_id;

      cy.api({
        method: "GET",
        url: "/products",
        qs: {
          q: q,
          page: page,
          withStock: withStock,
          withCategory: withCategory,
          // categoryId: categoryId,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return information for product not found", () => {
      const q = "Not Found";
      const page = 1000;
      const withStock = true;
      const withCategory = true;
      // const categoryId = products[0]?.category_id;

      cy.api({
        method: "GET",
        url: "/products",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        qs: {
          q: q,
          page: page,
          withStock: withStock,
          withCategory: withCategory,
          // categoryId: categoryId,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.products).to.be.an("array").that.is.empty;
      });
    });

    it("should successfully get product list", () => {
      const q = "Produk";
      const page = 1;
      const withStock = true;
      const withCategory = true;
      // const categoryId = products[0]?.category_id;

      cy.api({
        method: "GET",
        url: "/products",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        qs: {
          q: q,
          page: page,
          withStock: withStock,
          withCategory: withCategory,
          // categoryId: categoryId,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.products).not.to.be.undefined;
        expect(response.body.data.meta.total).to.eq(products.length.toString());
        expect(response.body.data.meta.page).to.eq(page.toString());
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Products - Update Product
   * Use this api to update Product detail
   * #######################################################################################################
   */
  describe("Update Product", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing categoryId
     * 4. error message for missing code
     * 5. error message for missing name
     * 6. error message for missing price
     * 7. error message for missing cost
     * 8. error message for missing stock
     * 9. error message for product not found
     * 10. error message for invalid cost format
     * 11. error message for invalid price format
     * 12. error message for invalid stock format
     * 13. successfully update product
     */

    let products = [];

    before("setup", () => {
      cy.login();
      cy.addProduct("makanan ringan", "makanan ringan dari indofood").then(
        (product) => {
          products.push(product);
          cy.log(products);
        }
      );
    });

    it("should return error message for empty body", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"value" must be of type object');
      });
    });

    it("should return error message for empty header", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing categoryId", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"category_id" is required');
      });
    });

    it("should return error message for missing code", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,

          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"code" is required');
      });
    });

    it("should return error message for missing name", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,

          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"name" is required');
      });
    });

    it("should return error message for missing price", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,

          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"price" is required');
      });
    });

    it("should return error message for missing cost", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,

          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"cost" is required');
      });
    });

    it("should return error message for missing stock", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"stock" is required');
      });
    });

    it("should return error message for product not found", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should return error message for invalid cost format", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `Update-${products[0]?.cost}`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"cost" must be a number');
      });
    });

    it("should return error message for invalid price format", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `Update-${products[0]?.price}`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"price" must be a number');
      });
    });

    it("should return error message for invalid stock format", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `Update-${products[0]?.stock}`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"stock" must be a number');
      });
    });

    it("should successfully update product", () => {
      products[0].name = `Update-${products[0]?.name}`;
      products[0].price = `1`;
      products[0].cost = `100`;
      products[0].stock = `10`;

      cy.api({
        method: "PUT",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          category_id: products[0].category_id,
          code: products[0].code,
          name: products[0].name,
          price: products[0].price,
          cost: products[0].cost,
          stock: products[0].stock,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("name", products[0]?.name);

        cy.checkProduct(products[0]);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Products - Delete Product
   * Use this api to delete product
   * #######################################################################################################
   */
  describe("Delete Product", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid productId
     * 3. successfully delete product
     */

    let products = [];

    before("setup", () => {
      cy.login();
      cy.addProduct("makanan ringan", "makanan ringan dari indofood").then(
        (product) => {
          products.push(product);
          cy.log(products);
        }
      );
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "DELETE",
        url: `/products/${products[0]?.productId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid productId", () => {
      cy.api({
        method: "DELETE",
        url: `/products/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully delete product", () => {
      cy.api({
        method: "DELETE",
        url: `/products/${products[0]?.productId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq("success");
        expect(response.body.message).to.eq("Product berhasil dihapus");

        cy.api({
          method: "GET",
          url: `/products/${products[0]?.productId}`,
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.notFound(response, "Product tidak ditemukan");
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });
});
