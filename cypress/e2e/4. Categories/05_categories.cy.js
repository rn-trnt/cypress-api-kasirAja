describe("/categories", () => {
  /**
   * #######################################################################################################
   * Categories - Add Category
   * Use this api to add new category
   * #######################################################################################################
   */
  describe("Add Category", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing name
     * 4. successfully create new category with missing description
     * 5. successfully create new category
     */
    let categories = [];

    before("setup", () => {
      cy.login();
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "POST",
        url: "/categories",
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
        url: "/categories",
        body: {
          name: "makanan ringan",
          description: "makanan ringan dari indofood",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "POST",
        url: "/categories",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          description: "makanan ringan dari indofood",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"name" is required');
      });
    });

    it("should successfully create new category with missing description", () => {
      const name = "makanan ringan";

      cy.api({
        method: "POST",
        url: "/categories",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: name,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Category berhasil ditambahkan");
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.name).to.eq(name);

        categories.push({
          categoryId: response.body.data.categoryId,
          name: response.body.data.name,
          description: null,
        });
      });
    });

    it("should successfully create new category", () => {
      const name = "makanan ringan";
      const description = "makanan ringan dari indofood";

      cy.api({
        method: "POST",
        url: "/categories",
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
        expect(response.body.message).to.eq("Category berhasil ditambahkan");
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.name).to.eq(name);

        categories.push({
          categoryId: response.body.data.categoryId,
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
   * Categories - Get Category Detail
   * Use this api to get about one unit details
   * #######################################################################################################
   */
  describe("Get Category Detail", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid categoryId
     * 3. successfully get category detail
     */

    let categories = [];

    before("setup", () => {
      cy.login();
      cy.createCategory("makanan ringan", "makanan ringan dari indofood").then(
        (category) => {
          categories.push(category);
          cy.log(categories);
        }
      );
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "GET",
        url: `/categories/${categories[0]?.categoryId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid categoryId", () => {
      cy.api({
        method: "GET",
        url: `/categories/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully get category detail", () => {
      cy.api({
        method: "GET",
        url: `/categories/${categories[0]?.categoryId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).not.to.be.undefined;
        expect(response.body.data.category.name).to.eq(categories[0].name);
        expect(response.body.data.category.description).to.eq(
          categories[0].description
        );
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Categories - Get Category List
   * Use this api to get a list of categories associated with user’s token
   * #######################################################################################################
   */
  describe("Get Category List", () => {
    /**
     * 1. error message for empty header
     * 2. information for category not found
     * 3. successfully get category list
     */

    let categories = [];

    before("setup", () => {
      cy.login();
      cy.createCategory("makanan ringan", "makanan ringan dari indofood").then(
        (category) => {
          categories.push(category);
        }
      );
      cy.createCategory("makanan berat", "makanan berat dari indofood").then(
        (category) => {
          categories.push(category);
        }
      );
      cy.log(categories);
    });

    it("should return error message for empty header", () => {
      const q = "makanan";
      const page = 1;

      cy.api({
        method: "GET",
        url: "/categories",
        qs: {
          q: q,
          page: page,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return information for category not found", () => {
      const q = "Not Found";
      const page = 1000;

      cy.api({
        method: "GET",
        url: "/categories",
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
        expect(response.body.data.categories).to.be.an("array").that.is.empty;
      });
    });

    it("should successfully get category list", () => {
      const q = "makanan";
      const page = 1;

      cy.api({
        method: "GET",
        url: "/categories",
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
        expect(response.body.data.categories).not.to.be.undefined;
        expect(response.body.data.meta.total).to.eq(
          categories.length.toString()
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
   * Categories - Update Category
   * Use this api to update category detail
   * #######################################################################################################
   */
  describe("Update Category", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for missing name
     * 4. error message for category not found
     * 5. successfully update category
     */

    let categories = [];

    before("setup", () => {
      cy.login();
      cy.createCategory("gram", "weight measurement").then((category) => {
        categories.push(category);
        cy.log(categories);
      });
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "PUT",
        url: `/categories/${categories[0]?.categoryId}`,
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
        url: `/categories/${categories[0]?.categoryId}`,
        body: {
          name: `update-${categories[0].name}`,
          description: `update-${categories[0].description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "PUT",
        url: `/categories/${categories[0]?.categoryId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          description: `update-${categories[0].description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"name" is required');
      });
    });

    it("should return error message for category not found", () => {
      cy.api({
        method: "PUT",
        url: `/categories/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `update-${categories[0].name}`,
          description: `update-${categories[0].description}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully update category", () => {
      categories[0].name = `Update-${categories[0]?.name}`;
      categories[0].description = `Update-${categories[0]?.description}`;

      cy.api({
        method: "PUT",
        url: `/categories/${categories[0]?.categoryId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: categories[0].name,
          description: categories[0].description,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property(
          "name",
          categories[0]?.name
        );

        cy.checkCategory(categories[0]);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Categories - Delete Category
   * Use this api to delete category
   * #######################################################################################################
   */
  describe("Delete Category", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid categoryId
     * 3. successfully delete category
     */

    let categories = [];

    before("setup", () => {
      cy.login();
      cy.createCategory("gram", "weight measurement").then((category) => {
        categories.push(category);
        cy.log(categories);
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "DELETE",
        url: `/categories/${categories[0]?.categoryId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid categoryId", () => {
      cy.api({
        method: "DELETE",
        url: `/categories/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully delete category", () => {
      cy.api({
        method: "DELETE",
        url: `/categories/${categories[0]?.categoryId}`,
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
          url: `/categories/${categories[0]?.categoryId}`,
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.notFound(response, "Category tidak ditemukan");
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });
});
