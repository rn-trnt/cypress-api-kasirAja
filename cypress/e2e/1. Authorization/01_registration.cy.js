/**
 * #######################################################################################################
 * Authorization - Registration
 * Use this API to get OAuth 2.0 Token for authorization.
 * This token will be an access token that must be added to every request header to our API resources.
 * #######################################################################################################
 */

describe("/registration", () => {
  /**
   * 1. register successfully
   * 2. error message for duplicate email entry
   * 3. error message for invalid email format
   * 4. error message for empty body
   * 5. error message for missing name
   * 6. error message for missing email
   * 7. error message for missing password
   * 8. error message for invalid body format
   */

  let generatedUser;

  before("setup", () => {
    cy.generateUser().then((user) => {
      generatedUser = user;
    });
  });

  it("should register successfully", () => {
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
      expect(response.body.message).to.eq("Toko berhasil didaftarkan");
      expect(response.body.data.name).to.eq(generatedUser.name);
      expect(response.body.data.email).to.eq(generatedUser.email);
    });
  });

  it("should return error message for duplicate email entry", () => {
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
      cy.badRequest(response, "Email sudah digunakan");
    });
  });

  it("should return error message for invalid email format", () => {
    cy.api({
      method: "POST",
      url: "/registration",
      body: {
        name: generatedUser.name,
        email: "invalidEmailFormat",
        password: generatedUser.password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.badRequest(response, '"email" must be a valid email');
    });
  });

  it("should return error message for empty body", () => {
    cy.api({
      method: "POST",
      url: "/registration",
      failOnStatusCode: false,
    }).then((response) => {
      cy.badRequest(response, '"value" must be of type object');
    });
  });

  it("should return error message for missing name", () => {
    cy.api({
      method: "POST",
      url: "/registration",
      body: {
        email: generatedUser.email,
        password: generatedUser.password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.badRequest(response, '"name" is required');
    });
  });

  it("should return error message for missing email", () => {
    cy.api({
      method: "POST",
      url: "/registration",
      body: {
        name: generatedUser.name,
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
      url: "/registration",
      body: {
        name: generatedUser.name,
        email: generatedUser.email,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.badRequest(response, '"password" is required');
    });
  });

  it("should return error message for invalid body format", () => {
    cy.api({
      method: "POST",
      url: "/registration",
      body: {
        name: generatedUser.name,
        email: generatedUser.email,
        password: generatedUser.password,
        invalid: "invalid format",
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.badRequest(response, '"invalid" is not allowed');
    });
  });
});
