// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//s
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("badRequest", (response, message) => {
  expect(response.status).to.eq(400);
  expect(response.body.status).to.eq("fail");
  expect(response.body.message).to.eq(message);
});

Cypress.Commands.add("unauthorized", (response, message) => {
  expect(response.status).to.eq(401);
  expect(response.body.message).to.eq(message);
});

Cypress.Commands.add("notFound", (response, message) => {
  expect(response.status).to.eq(404);
  expect(response.body.message).to.eq(message);
});

Cypress.Commands.add("generateUser", () => {
  const generatedUser = {
    name: `Toko ${Cypress.faker.person.fullName()}`,
    email: `Toko-${Date.now()}-${Cypress.faker.internet.email()}`,
    password: Cypress.faker.internet.password(12, true, /[A-Za-z0-9]/, "!@#"),
  };

  cy.log(`Generated User: ${JSON.stringify(generatedUser)}`);
  return cy.wrap(generatedUser);
});

Cypress.Commands.add("login", () => {
  cy.generateUser().then((user) => {
    // Register
    cy.api({
      method: "POST",
      url: "/registration",
      body: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      Cypress.env("LOGIN_EMAIL", user.email);
      Cypress.env("LOGIN_PASSWORD", user.password);

      // Login
      cy.api({
        method: "POST",
        url: "/authentications",
        body: {
          email: Cypress.env("LOGIN_EMAIL"),
          password: Cypress.env("LOGIN_PASSWORD"),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        Cypress.env("ACCESS_TOKEN", response.body.data.accessToken);
        Cypress.env("REFRESH_TOKEN", response.body.data.refreshToken);
      });
    });
  });
});

Cypress.Commands.add("clearCypressEnv", () => {
  Object.keys(Cypress.env()).forEach((key) => {
    Cypress.env(key, undefined);
  });

  cy.log("Environment Variables Cleared");
});

// role hard coded into admin/kasir only
Cypress.Commands.add("generateCompanyUser", (position) => {
  const generatedUser = {
    name: `${position} ${Cypress.faker.person.fullName()}`,
    email: `${position}-${Date.now()}-${Cypress.faker.internet.email()}`,
    password: Cypress.faker.internet.password(12, true, /[A-Za-z0-9]/, "!@#"),
  };

  cy.log(`Generated Company User: ${JSON.stringify(generatedUser)}`);
  return cy.wrap(generatedUser);
});

Cypress.Commands.add("addCompanyUser", (position) => {
  cy.generateCompanyUser(position).then((user) => {
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

      return cy.wrap({
        name: user.name,
        email: user.email,
        password: user.password,
        userId: response.body.data.userId,
      });
    });
  });
});

Cypress.Commands.add("checkCompanyUser", (userData) => {
  cy.api({
    method: "GET",
    url: `/users/${userData.userId}`,
    headers: {
      authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data.user.id).to.eq(userData.userId);
    expect(response.body.data.user.name).to.eq(userData.name);
    expect(response.body.data.user.email).to.eq(userData.email);
  });
});

Cypress.Commands.add("createUnit", (name, description) => {
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

    return cy.wrap({
      unitId: response.body.data.unitId,
      name: name,
      description: description,
    });
  });
});

Cypress.Commands.add("checkUnit", (unit) => {
  cy.api({
    method: "GET",
    url: `/units/${unit.unitId}`,
    headers: {
      authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data).not.to.be.undefined;
    expect(response.body.data.unit.name).to.eq(unit.name);
    expect(response.body.data.unit.description).to.eq(unit.description);
  });
});

Cypress.Commands.add("createCategory", (name, description) => {
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

    return cy.wrap({
      categoryId: response.body.data.categoryId,
      name: name,
      description: description,
    });
  });
});

Cypress.Commands.add("checkCategory", (category) => {
  cy.api({
    method: "GET",
    url: `/categories/${category.categoryId}`,
    headers: {
      authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data).not.to.be.undefined;
    expect(response.body.data.category.name).to.eq(category.name);
    expect(response.body.data.category.description).to.eq(category.description);
  });
});

Cypress.Commands.add("generateCustomer", () => {
  const generatedCustomer = {
    name: `Customer ${Cypress.faker.person.fullName()}`,
    phone:
      "08" +
      Cypress.faker.phone
        .number({ style: "international" })
        .replace("+", "")
        .substring(0, 9),
    address: Cypress.faker.location.city(),
    description: Cypress.faker.lorem.sentence({ min: 3, max: 5 }),
  };

  cy.log(`Generated Customer: ${JSON.stringify(generatedCustomer)}`);
  return cy.wrap(generatedCustomer);
});

Cypress.Commands.add("addCustomer", () => {
  cy.generateCustomer().then((customer) => {
    cy.api({
      method: "POST",
      url: "/customers",
      headers: {
        authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
      },
      body: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        description: customer.description,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);

      return cy.wrap({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        description: customer.description,
        customerId: response.body.data.customerId,
      });
    });
  });
});

Cypress.Commands.add("checkCustomer", (customer) => {
  cy.api({
    method: "GET",
    url: `/customers/${customer.customerId}`,
    headers: {
      authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data).not.to.be.undefined;
    expect(response.body.data.customer.name).to.eq(customer.name);
    expect(response.body.data.customer.description).to.eq(customer.description);
  });
});

Cypress.Commands.add("generateProduct", (categoryName, categoryDescription) => {
  cy.createCategory(categoryName, categoryDescription).then((category) => {
    const productData = {
      category_id: category.categoryId,
      code: Cypress.faker.string.alphanumeric(16).toUpperCase(),
      name: `Produk ${Cypress.faker.commerce
        .productName()
        .split(" ")[0]
        .toLowerCase()}`,
      price: Cypress.faker.commerce.price({ min: 10000, max: 100000, dec: 2 }),
      cost: Cypress.faker.commerce.price({ min: 5000, max: 9999, dec: 2 }),
      stock: Cypress.faker.string.numeric(3),
      category_name: categoryName,
    };

    cy.log(`Generated Product: ${JSON.stringify(productData)}`);
    return cy.wrap(productData);
  });
});

Cypress.Commands.add("addProduct", (categoryName, categoryDescription) => {
  cy.generateProduct(categoryName, categoryDescription).then((product) => {
    cy.api({
      method: "POST",
      url: `/products`,
      headers: {
        authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
      },
      body: {
        category_id: product.category_id,
        code: product.code,
        name: product.name,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);

      return cy.wrap({
        category_id: product.category_id,
        code: product.code,
        name: product.name,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        productId: response.body.data.productId,
        category_name: product.category_name,
      });
    });
  });
});

Cypress.Commands.add("checkProduct", (product) => {
  cy.api({
    method: "GET",
    url: `/products/${product.productId}`,
    headers: {
      authorization: `Bearer ${Cypress.env("ACCESS_TOKEN")}`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data).not.to.be.undefined;
    expect(response.body.data.product.name).to.eq(product.name);
  });
});
