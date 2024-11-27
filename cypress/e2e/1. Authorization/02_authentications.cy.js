describe("/authentications", () => {
  /**
   * #######################################################################################################
   * Authorization - Login
   * Use this API to get OAuth 2.0 Token for authorization.
   * This token will be an access token that must be added to every request header to our API resources.
   * #######################################################################################################
   */
  describe("Login", () => {
    /**
     * 1. error message for empty body
     * 2. error message for wrong password
     * 3. error message for wrong email
     * 4. error message for invalid email format
     * 5. error message for missing email
     * 6. error message for missing password
     * 7. access token on successful login
     */

    let generatedUser;

    before("setup", () => {
      cy.generateUser().then((user) => {
        generatedUser = user;

        cy.api({
          method: "POST",
          url: "/registration",
          body: {
            name: generatedUser.name,
            email: generatedUser.email,
            password: generatedUser.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(201);
          cy.log(response);
        });
      });
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "POST",
        url: "/authentications",
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"value" must be of type object');
      });
    });

    it("should return error message for wrong password", () => {
      cy.api({
        method: "POST",
        url: "/authentications",
        body: {
          email: generatedUser.email,
          password: "invalid password",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Kredensial yang Anda berikan salah");
      });
    });

    it("should return error message for wrong email", () => {
      cy.api({
        method: "POST",
        url: "/authentications",
        body: {
          email: "invalid@email.com",
          password: generatedUser.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.unauthorized(response, "Kredensial yang Anda berikan salah");
      });
    });

    // not valid email
    it("should return error message for invalid email format", () => {
      cy.api({
        method: "POST",
        url: "/authentications",
        body: {
          email: "invalid email format",
          password: generatedUser.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"email" must be a valid email');
      });
    });

    it("should return error message for missing email", () => {
      cy.api({
        method: "POST",
        url: "/authentications",
        body: {
          password: generatedUser.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"email" is required');
      });
    });

    it("should return error message for missing password", () => {
      cy.api({
        method: "POST",
        url: "/authentications",
        body: {
          email: generatedUser.email,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"password" is required');
      });
    });

    it("should return access token on successful login", () => {
      cy.api({
        method: "POST",
        url: "/authentications",
        body: {
          email: generatedUser.email,
          password: generatedUser.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(
          "Authentication berhasil ditambahkan"
        );
        expect(response.body.data.accessToken).not.to.be.undefined;
        expect(response.body.data.refreshToken).not.to.be.undefined;
        expect(response.body.data.user).not.to.be.undefined;
      });
    });
  });

  /**
   * #######################################################################################################
   * Authorization - Refresh Token
   * Use this api to get a new token if the accessToken has already expired.
   * This new token will be an access token that must be added to every request header to our API resources.
   * #######################################################################################################
   */
  describe("Refresh Token", () => {
    /**
     * 1. error message for empty body
     * 2. error message for wrong token
     * 3. successfully refresh the access token
     */

    before("setup", () => {
      cy.login();
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "PUT",
        url: "/authentications",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"value" must be of type object');
      });
    });

    it("should return error message for wrong token", () => {
      cy.api({
        method: "PUT",
        url: "/authentications",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          refreshToken: "wrong token",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, "Refresh token tidak valid");
      });
    });

    it("should successfully refresh the access token", () => {
      cy.api({
        method: "PUT",
        url: "/authentications",
        headers: {
          authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
        },
        body: {
          refreshToken: Cypress.env("REFRESH_TOKEN"),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("Access Token berhasil diperbarui");
        expect(response.body.data.accessToken).not.to.be.undefined;

        Cypress.env("ACCESS_TOKEN", response.body.data.accessToken);
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });

  /**
   * #######################################################################################################
   * Authorization - LogOut
   * Use this API to logout
   * #######################################################################################################
   */
  describe("LogOut", () => {
    /**
     * 1. error message for empty body
     * 2. error message for wrong refresh token
     * 3. successfully logout
     */

    before("setup", () => {
      cy.login();
    });

    it("should return error message for empty body", () => {
      cy.api({
        method: "DELETE",
        url: "/authentications",
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, '"value" must be of type object');
      });
    });

    it("should return error message for wrong refresh token", () => {
      cy.api({
        method: "DELETE",
        url: "/authentications",
        body: {
          refreshToken: "Wrong Token",
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.badRequest(response, "Refresh token tidak valid");
      });
    });

    it("should successfully logout", () => {
      cy.api({
        method: "DELETE",
        url: "/authentications",
        body: {
          refreshToken: Cypress.env("REFRESH_TOKEN"),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("Refresh token berhasil dihapus");
      });
    });

    after("clear environment variables", () => {
      cy.clearCypressEnv();
    });
  });
});
