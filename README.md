# Constituent Management

A lightweight program built with [NodeJS](https://nodejs.org) and [Typescript](https://www.typescriptlang.org/) to allow interaction via HTTP requests. Initial data is loaded from a provided `.csv` file.

## Getting Started

### Dependencies
Ensure you have the following installed:
 - [npm](https://www.npmjs.com/)
 - [NodeJS (v20.11.1)](https://nodejs.org/en/)

### Install all dependencies
```sh
cd <project-directory>
nvm use
npm i
```

### Review .env file

The `.env` file holds information such as host, port, and name of `.csv` file to use for the data store. Modify variables as you see fit. Defaults are set to:
```sh
DATASTORE_FILENAME="constituent-sample.csv"
HOSTNAME=127.0.0.1
SERVER_PORT=8080
```

*Note: data can only be loaded via a `.csv` file, and must live within the `files` directory*

### Run server
Once your `.env` is ready, start up the server.
```sh
npm run start
```

## API interactions
The program currently supports a number of API calls:

- `GET /constituents`: Returns all constituents records from the data store.
- `POST /constituents`:
  - Accepts `email`, `name`, and `address`.
  - If the `email` does not already exist in the data store, add a new record (i.e. append to the existing file).
  - If the `email` does exist, the new information is merged with the existing (in this case, updates `name` and `address`)
- `GET /constituents/:signupTime`:
  - Accepts `signupTime` as a string.
  - Returns all constituents less than or equal to signup time records from the data store.
- `GET /constituents/:signupTime/export`:
  - Works as `/constituents/:signupTime` but stores the results to a new CSV file called `constituents-export` with today's date and time.

### cUrl Requests
*The following assume you have `jq` installed. If you do not, you can either [jq](https://jqlang.github.io/jq/download/) or remove from the curl requests: ` | jq`

#### GET /constituents
```sh
curl --request GET http://localhost:8080/api/constituents | jq
```

#### POST /constituents
```sh
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"testing.test@example.com","name":"Full Name", "address": "123 Testing Street"}' \
  http://localhost:8080/api/constituents | jq
  ```

##### Example of merging
```sh
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"testing.test@example.com","name":"Entire Name", "address": "456 Testing Way"}' \
  http://localhost:8080/api/constituents | jq
  ```

#### GET /constituents/:signupTime
```sh
curl --request GET http://localhost:8080/api/constituents/2024-02-17T15:00:00 | jq
```

#### GET /constituents/:signupTime/export
```sh
curl --request GET http://localhost:8080/api/constituents/2024-02-17T15:00:00?export=true | jq
```
