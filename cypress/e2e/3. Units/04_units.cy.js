describe("/units", () => {
  /**
   * #######################################################################################################
   * Units - Add Unit
   * Use this api to add new unit
   * #######################################################################################################
   */
  describe("Add Unit", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing name
     * 4. successfully create new unit with missing description
     * 5. successfully create new unit
     */
    let units = [];

    before("setup", () => {
      cy.login();
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "POST",
        url: "/units",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, "name is required, description is optional");
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "POST",
        url: "/units",
        body: {
          name: "gram",
          description: "weight measurement",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "POST",
        url: "/units",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          description: "weight measurement",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, "name is required, description is optional");
      });
    });

    it("should successfully create new unit with missing description", () => {
      const name = "gram";

      cy.api({
        method: "POST",
        url: "/units",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: name,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Unit berhasil ditambahkan");
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.name).to.eq(name);

        units.push({
          unitId: response.body.data.unitId,
          name: response.body.data.name,
          description: null,
        });
      });
    });

    it("should successfully create new unit", () => {
      const name = "gram";
      const description = "weight measurement";

      cy.api({
        method: "POST",
        url: "/units",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: name,
          description: description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Unit berhasil ditambahkan");
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.name).to.eq(name);

        units.push({
          unitId: response.body.data.unitId,
          name: response.body.data.name,
          description: description,
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Units - Get Unit Detail
   * Use this api to get about one unit details
   * #######################################################################################################
   */
  describe("Get Unit Detail", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid unitId
     * 3. successfully get unit detail
     */

    let units = [];

    before("setup", () => {
      cy.login();
      cy.createUnit("gram", "weight measurement").then((unit) => {
        units.push(unit);
        cy.log(units);
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "GET",
        url: `/units/${units[0]?.unitId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid unitId", () => {
      cy.api({
        method: "GET",
        url: `/units/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully get unit detail", () => {
      cy.api({
        method: "GET",
        url: `/units/${units[0]?.unitId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.unit.name).to.eq(units[0].name);
        expect(response.body.data.unit.description).to.eq(units[0].description);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Units - Get Unit List
   * Use this api to get a list of unit associated with user’s token
   * #######################################################################################################
   */
  describe("Get Unit List", () => {
    /**
     * 1. error message for empty header
     * 2. information for unit not found
     * 3. successfully get unit list
     */

    let units = [];

    before("setup", () => {
      cy.login();
      cy.createUnit("gram", "weight measurement").then((unit) => {
        units.push(unit);
      });
      cy.createUnit("kilogram", "weight measurement").then((unit) => {
        units.push(unit);
      });
      cy.log(units);
    });

    it("should return error message for empty header", () => {
      const q = "gram";
      const page = 1;

      cy.api({
        method: "GET",
        url: "/units",
        qs: {
          q: q,
          page: page,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return information for unit not found", () => {
      const q = "Not Found";
      const page = 1000;

      cy.api({
        method: "GET",
        url: "/units",
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
        expect(response.body.data.units).to.be.an("array").that.is.empty;
      });
    });

    it("should successfully get unit list", () => {
      const q = "gram";
      const page = 1;

      cy.api({
        method: "GET",
        url: "/units",
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
        expect(response.body.data.units).not.to.be.undefined;
        expect(response.body.data.meta.total).to.eq(units.length.toString());
        expect(response.body.data.meta.page).to.eq(page.toString());
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Units - Update Unit
   * Use this api to update Unit detail
   * #######################################################################################################
   */
  describe("Update Unit", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing name
     * 4. error message for unit not found
     * 5. successfully update unit
     */

    let units = [];

    before("setup", () => {
      cy.login();
      cy.createUnit("gram", "weight measurement").then((unit) => {
        units.push(unit);
        cy.log(units);
      });
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "PUT",
        url: `/units/${units[0]?.unitId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, "name is required, description is optional");
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "PUT",
        url: `/units/${units[0]?.unitId}`,
        body: {
          name: `update-${units[0].name}`,
          description: `update-${units[0].description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "PUT",
        url: `/units/${units[0]?.unitId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          description: `update-${units[0].description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, "name is required, description is optional");
      });
    });

    it("should return error message for unit not found", () => {
      cy.api({
        method: "PUT",
        url: `/units/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `update-${units[0].name}`,
          description: `update-${units[0].description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully update unit", () => {
      units[0].name = `Update-${units[0]?.name}`;
      units[0].description = `Update-${units[0]?.description}`;

      cy.api({
        method: "PUT",
        url: `/units/${units[0]?.unitId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: units[0].name,
          description: units[0].description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property("name", units[0]?.name);

        cy.checkUnit(units[0]);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Units - Delete Unit
   * Use this api to delete unit
   * #######################################################################################################
   */
  describe("Delete Unit", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid unitId
     * 3. successfully delete unit
     */

    let units = [];

    before("setup", () => {
      cy.login();
      cy.createUnit("gram", "weight measurement").then((unit) => {
        units.push(unit);
        cy.log(units);
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "DELETE",
        url: `/units/${units[0]?.unitId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid unitId", () => {
      cy.api({
        method: "DELETE",
        url: `/units/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully delete unit", () => {
      cy.api({
        method: "DELETE",
        url: `/units/${units[0]?.unitId}`,
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
          url: `/units/${units[0]?.unitId}`,
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.notFound(response, "Unit tidak ditemukan");
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });
});
