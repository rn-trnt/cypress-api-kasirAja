describe("/customers", () => {
  /**
   * #######################################################################################################
   * Customers - Add Customer
   * Use this api to add new customer
   * #######################################################################################################
   */
  describe("Add Customer", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing name
     * 4. error message for invalid phone number
     * 5. successfully create new customer with missing phone, address & description
     * 6. successfully create new customer
     */

    let customers = [];

    before("setup", () => {
      cy.login();
      cy.generateCustomer().then((customer) => {
        customers.push(customer);
        cy.log(customers);
      });
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "POST",
        url: "/customers",
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
        url: "/customers",
        body: {
          name: customers[0]?.name,
          phone: customers[0]?.phone,
          address: customers[0]?.address,
          description: customers[0]?.description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "POST",
        url: "/customers",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          phone: customers[0]?.phone,
          address: customers[0]?.address,
          description: customers[0]?.description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"name" is required');
      });
    });

    it("should return error message for invalid phone number", () => {
      cy.api({
        method: "POST",
        url: "/customers",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: customers[0]?.name,
          phone: "invalid",
          address: customers[0]?.address,
          description: customers[0]?.description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"phone" must be a number');
      });
    });

    it("should successfully create new customer with missing phone, address & description", () => {
      cy.api({
        method: "POST",
        url: "/customers",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: customers[0]?.name,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Customer berhasil ditambahkan");
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.name).to.eq(customers[0]?.name);
        expect(response.body.data.customerId).not.to.be.null;
      });
    });

    it("should successfully create new customer", () => {
      cy.api({
        method: "POST",
        url: "/customers",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: customers[0]?.name,
          phone: customers[0]?.phone,
          address: customers[0]?.address,
          description: customers[0]?.description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Customer berhasil ditambahkan");
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.name).to.eq(customers[0]?.name);
        expect(response.body.data.customerId).not.to.be.null;
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Customers - Get Customer Detail
   * Use this api to get about one customer details
   * #######################################################################################################
   */
  describe("Get Customer Detail", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid customerId
     * 3. successfully get customer detail
     */

    let customers = [];

    before("setup", () => {
      cy.login();
      cy.addCustomer().then((customer) => {
        customers.push(customer);
        cy.log(customers);
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "GET",
        url: `/customers/${customers[0]?.customerId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid customerId", () => {
      cy.api({
        method: "GET",
        url: `/customers/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully get customer detail", () => {
      cy.api({
        method: "GET",
        url: `/customers/${customers[0]?.customerId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.customer.name).to.eq(customers[0].name);
        expect(response.body.data.customer.phone).to.eq(customers[0].phone);
        expect(response.body.data.customer.address).to.eq(customers[0].address);
        expect(response.body.data.customer.description).to.eq(
          customers[0].description
        );
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Customers - Get Customer List
   * Use this api to get a list of customers associated with user’s token
   * #######################################################################################################
   */
  describe("Get Customer List", () => {
    /**
     * 1. error message for empty header
     * 2. information for customer not found
     * 3. successfully get customer list
     */

    let customers = [];

    before("setup", () => {
      cy.login();
      cy.addCustomer().then((customer) => {
        customers.push(customer);
      });

      cy.addCustomer().then((customer) => {
        customers.push(customer);
      });

      cy.log(customers);
    });

    it("should return error message for empty header", () => {
      const q = "Customer";
      const page = 1;

      cy.api({
        method: "GET",
        url: "/customers",
        qs: {
          q: q,
          page: page,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return information customer not found", () => {
      const q = "Not Found";
      const page = 1000;

      cy.api({
        method: "GET",
        url: "/customers",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        qs: {
          q: q,
          page: page,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.customers).to.be.an("array").that.is.empty;
      });
    });

    it("should successfully get customer list", () => {
      const q = "Customer";
      const page = 1;

      cy.api({
        method: "GET",
        url: "/customers",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        qs: {
          q: q,
          page: page,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.customers).not.to.be.undefined;
        expect(response.body.data.meta.total).to.eq(
          customers.length.toString()
        );
        expect(response.body.data.meta.page).to.eq(page.toString());
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Customers - Update Customer
   * Use this api to update Customer detail
   * #######################################################################################################
   */
  describe("Update Customer", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing name
     * 4. error message for customer not found
     * 5. successfully update customer
     */

    let customers = [];

    before("setup", () => {
      cy.login();
      cy.addCustomer().then((customer) => {
        customers.push(customer);
        cy.log(customers);
      });
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "PUT",
        url: `/customers/${customers[0]?.customerId}`,
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
        method: "PUT",
        url: `/customers/${customers[0]?.customerId}`,
        body: {
          name: `Update-${customers[0]?.name}`,
          phone: `11111111111`,
          address: `Update-${customers[0]?.address}`,
          description: `Update-${customers[0]?.description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "PUT",
        url: `/customers/${customers[0]?.customerId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          phone: `11111111111`,
          address: `Update-${customers[0]?.address}`,
          description: `Update-${customers[0]?.description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"name" is required');
      });
    });

    it("should return error message for customer not found", () => {
      cy.api({
        method: "PUT",
        url: `/customers/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `Update-${customers[0]?.name}`,
          phone: `11111111111`,
          address: `Update-${customers[0]?.address}`,
          description: `Update-${customers[0]?.description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully update customer", () => {
      customers[0].name = `Update-${customers[0]?.name}`;
      customers[0].phone = `11111111111`;
      customers[0].address = `Update-${customers[0]?.address}`;
      customers[0].description = `Update-${customers[0]?.description}`;

      cy.api({
        method: "PUT",
        url: `/customers/${customers[0]?.customerId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: customers[0].name,
          phone: customers[0].phone,
          address: customers[0].address,
          description: customers[0].description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("name", customers[0]?.name);

        cy.checkCustomer(customers[0]);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Customers - Delete Customer
   * Use this api to delete customer
   * #######################################################################################################
   */
  describe("Delete Customer", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid customerId
     * 3. successfully delete customer
     */

    let customers = [];

    before("setup", () => {
      cy.login();
      cy.addCustomer().then((customer) => {
        customers.push(customer);
        cy.log(customers);
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "DELETE",
        url: `/customers/${customers[0]?.customerId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid customerId", () => {
      cy.api({
        method: "DELETE",
        url: `/customers/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully delete customer", () => {
      cy.api({
        method: "DELETE",
        url: `/customers/${customers[0]?.customerId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq("success");
        expect(response.body.data).to.be.an("object").that.is.empty;

        cy.api({
          method: "GET",
          url: `/customers/${customers[0]?.customerId}`,
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.notFound(response, "Customer tidak ditemukan");
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });
});
