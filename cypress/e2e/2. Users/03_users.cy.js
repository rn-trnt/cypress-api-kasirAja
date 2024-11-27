describe("/users", () => {
  /**
   * #######################################################################################################
   * User - Create User
   * Use this API to create a new user in one company (such as Kasir roles)
   * #######################################################################################################
   */
  describe("Create User", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for invalid email format
     * 4. error message for missing name
     * 5. error message for missing email
     * 6. error message for missing password
     * 7. successfully create new user
     * 8  error message for duplicate email entry
     */

    let generatedCompanyUser = [];

    before("setup", () => {
      cy.login();
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "POST",
        url: "/users",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"value" must be of type object');
      });
    });

    it("should return error message for empty header", () => {
      cy.generateCompanyUser("Kasir")
        .then((user) => {
          cy.api({
            method: "POST",
            url: "/users",
            body: {
              name: user.name,
              email: user.email,
              password: user.password,
            },
            failOnStatusCode: false,
          });
        })
        .then((response) => {
          cy.unauthorized(response, "Missing authentication");
        });
    });

    it("should return error message for invalid email format", () => {
      cy.generateCompanyUser("Kasir").then((user) => {
        cy.api({
          method: "POST",
          url: "/users",
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          body: {
            name: user.name,
            email: "invalid email format",
            password: user.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.badRequest(response, '"email" must be a valid email');
        });
      });
    });

    it("should return error message for missing name", () => {
      cy.generateCompanyUser("Kasir").then((user) => {
        cy.api({
          method: "POST",
          url: "/users",
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          body: {
            email: user.email,
            password: user.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.badRequest(response, '"name" is required');
        });
      });
    });

    it("should return error message for missing email", () => {
      cy.generateCompanyUser("Kasir").then((user) => {
        cy.api({
          method: "POST",
          url: "/users",
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          body: {
            name: user.name,
            password: user.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.badRequest(response, '"email" is required');
        });
      });
    });

    it("should return error message for password email", () => {
      cy.generateCompanyUser("Kasir").then((user) => {
        cy.api({
          method: "POST",
          url: "/users",
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          body: {
            name: user.name,
            email: user.email,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.badRequest(response, '"password" is required');
        });
      });
    });

    it("should successfully create new user", () => {
      cy.generateCompanyUser("Kasir").then((user) => {
        cy.api({
          method: "POST",
          url: "/users",
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          body: {
            name: user.name,
            email: user.email,
            password: user.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.message).to.eq("User berhasil ditambahkan");
          expect(response.body.data).not.to.be.undefined;

          generatedCompanyUser.push({
            name: user.name,
            email: user.email,
            password: user.password,
            userId: response.body.data.userId,
          });

          cy.log(generatedCompanyUser);
        });
      });
    });

    it("should return error message for duplicate email entry", () => {
      cy.generateCompanyUser("Kasir").then((user) => {
        cy.api({
          method: "POST",
          url: "/users",
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          body: {
            name: user.name,
            email: user.email,
            password: user.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.message).to.eq("User berhasil ditambahkan");
          expect(response.body.data).not.to.be.undefined;
        });

        cy.api({
          method: "POST",
          url: "/users",
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          body: {
            name: user.name,
            email: user.email,
            password: user.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.badRequest(response, "Email sudah digunakan");
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Users - Get User Detail
   * Use this api to get about one user details
   * #######################################################################################################
   */
  describe("Get User Detail", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid userId
     * 3. successfully get user detail
     */

    let generatedCompanyUser = [];

    before("setup", () => {
      cy.login();
      cy.addCompanyUser("Kasir").then((companyUser) => {
        generatedCompanyUser.push(companyUser);
        cy.log(generatedCompanyUser);
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "GET",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error for invalid userId", () => {
      cy.api({
        method: "GET",
        url: `/users/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully get user detail", () => {
      const userIds = generatedCompanyUser.map((user) => user.userId);

      userIds.forEach((id) => {
        cy.api({
          method: "GET",
          url: `/users/${id}`,
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.data).not.to.be.undefined;
          expect(response.body.data.user.id).to.eq(id);
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * User - Get User List
   * Use this api to get a list of products associated with user’s token
   * #######################################################################################################
   */
  describe("Get User List", () => {
    /**
     * 1. error message for empty header
     * 2. error message for missing params
     * 3. information for user not found
     * 4. successfully get user list
     */

    let generatedCompanyUser = [];

    before("setup", () => {
      cy.login();
      cy.addCompanyUser("Kasir").then((companyUser) => {
        generatedCompanyUser.push(companyUser);
        cy.log(generatedCompanyUser);
      });
    });

    it("should return error message for empty header", () => {
      const q = "Kasir";
      const p = 1;

      cy.api({
        method: "GET",
        url: "/users",
        qs: {
          q: q,
          p: p,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return information for user not found", () => {
      const q = "Not Found";
      const p = 100;

      cy.api({
        method: "GET",
        url: "/users",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        qs: {
          q: q,
          p: p,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.users).to.be.an("array").that.is.empty;
      });
    });

    it("should successfully get user list", () => {
      const q = "Kasir";
      const p = 1;

      cy.api({
        method: "GET",
        url: "/users",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        qs: {
          q: q,
          p: p,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.users).not.to.be.undefined;
        expect(response.body.data.meta.page).to.eq(p);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * User - Update User
   * Use this api to update user detail
   * #######################################################################################################
   */
  describe("Update User", () => {
    /**
     * 1. error message for empty body
     * 2. error message for empty header
     * 3. error message for invalid email format
     * 4. error message for missing name
     * 5. error message for missing email
     * 6. error message for user not found
     * 7. successfully update user name
     * 8. successfully update user email
     */

    let generatedCompanyUser = [];

    before("setup", () => {
      cy.login();
      cy.addCompanyUser("Kasir").then((companyUser) => {
        generatedCompanyUser.push(companyUser);
        cy.log(generatedCompanyUser);
      });
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "PUT",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
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
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        body: {
          name: `Update ${generatedCompanyUser[0]?.name}`,
          email: `Update-${generatedCompanyUser[0]?.email}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid email format", () => {
      cy.api({
        method: "PUT",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `Update ${generatedCompanyUser[0]?.name}`,
          email: `Update Invalid Email Format`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"email" must be a valid email');
      });
    });

    it("should return error message for missing name", () => {
      cy.api({
        method: "PUT",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          email: `Update-${generatedCompanyUser[0]?.email}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"name" is required');
      });
    });

    it("should return error message for missing email", () => {
      cy.api({
        method: "PUT",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `Update ${generatedCompanyUser[0]?.name}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"email" is required');
      });
    });

    it("should return error message for user not found", () => {
      cy.api({
        method: "PUT",
        url: `/users/invalidId`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `Update ${generatedCompanyUser[0]?.name}`,
          email: `Update-${generatedCompanyUser[0]?.email}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully update user name", () => {
      generatedCompanyUser[0].name = `Update ${generatedCompanyUser[0]?.name}`;

      cy.api({
        method: "PUT",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `${generatedCompanyUser[0]?.name}`,
          email: `${generatedCompanyUser[0]?.email}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("User berhasil diupdate");
        expect(response.body.data).to.have.property(
          "name",
          generatedCompanyUser[0]?.name
        );

        cy.checkCompanyUser(generatedCompanyUser[0]);
      });
    });

    it("should successfully update user email", () => {
      generatedCompanyUser[0].email = `Update-${generatedCompanyUser[0]?.email}`;

      cy.api({
        method: "PUT",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          name: `${generatedCompanyUser[0]?.name}`,
          email: `${generatedCompanyUser[0]?.email}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("User berhasil diupdate");
        expect(response.body.data).to.have.property(
          "name",
          generatedCompanyUser[0]?.name
        );

        cy.checkCompanyUser(generatedCompanyUser[0]);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * User - Delete User
   * Use this api to delete user
   * #######################################################################################################
   */
  describe("Delete User", () => {
    /**
     * 1. error message for empty header
     * 2. error message for invalid userId
     * 3. successfully delete user
     */

    let generatedCompanyUser = [];

    before("setup", () => {
      cy.login();
      cy.addCompanyUser("Kasir").then((companyUser) => {
        generatedCompanyUser.push(companyUser);
        cy.log(generatedCompanyUser);
      });
    });

    it("should return error message for empty header", () => {
      cy.api({
        method: "DELETE",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Missing authentication");
      });
    });

    it("should return error message for invalid userId", () => {
      cy.api({
        method: "DELETE",
        url: `/users/invalid`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.notFound(response, "id tidak valid");
      });
    });

    it("should successfully delete user", () => {
      cy.api({
        method: "DELETE",
        url: `/users/${generatedCompanyUser[0]?.userId}`,
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("User berhasil dihapus");

        cy.api({
          method: "GET",
          url: `/users/${generatedCompanyUser[0]?.userId}`,
          headers: {
            authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
          },
          failOnStatusCode: false,
        }).then((response) => {
          cy.notFound(response, "User tidak ditemukan");
        });
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });
});
