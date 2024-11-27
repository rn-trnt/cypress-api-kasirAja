# **Cypress API Testing for Kasir Aja**

This project automates the testing of the Kasir Aja API using Cypress, focusing on critical functionalities such as authentication, user management, product management, and more. The goal is to ensure the API performs reliably under various conditions.

The API contract for this project can be found [here](https://docs.google.com/document/d/1W0XI71VrHLgnhRyziVUQqy62Acnh0FSxGHs9n4GIV_U/edit?tab=t.0#heading=h.kby3fid6nryh).

---

## **Installation**

Clone the repository:

```
git clone <repository_url>
cd <repository_name>
```

Install dependencies:

```
npm install
```

## **Running Tests**

To execute the tests, run:

```
npx cypress open
```

---

## **Endpoint Tested**

The following endpoints are covered in this project:

- /registration
  </br >

- /authentications
  </br >

- /users
  </br >

- /units
  </br >

- /categories
  </br >

- /customers
  </br >

- /products

---

## **Test Cases**

The test cases validate the following scenarios:

**1. Authentication**

- User registration
- Login with valid and invalid credentials
- Token refresh and logout

</br >

**2. User Management**

- Create, retrieve, update, and delete users

</br >

**3. Product Management**

- Add, update, retrieve, and delete products

</br >

**4. Category Management**

- Add, update, retrieve, and delete categories

</br >

**5. Units and Customers**

- CRUD operations on units and customers

</br >

Each test case checks both success and error conditions to ensure robustness.

---
