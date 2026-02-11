import { ctpClientHTTPAPI, projectKey } from './BuildClient.js';

async function runGraphQLQuery(query: string) {
  const response = await ctpClientHTTPAPI.execute({
    uri: `/${projectKey}/graphql`,
    method: 'POST',
    body: { query },
  });

  return response.body;
}


async function fetchProducts() {
  const query = `
    query {
      products(limit: 2) {
        total
        results {
          id
          key
          masterData {
            current {
              name(locale: "en")
            }
          }
        }
      }
    }
  `;

  const data = await runGraphQLQuery(query);

  console.log('\n✅ GraphQL Products');
  console.log(JSON.stringify(data, null, 2));
}


async function fetchCustomers() {
  const query = `
    query {
      customers(limit: 2) {
        total
        results {
          id
          email
          firstName
          lastName
        }
      }
    }
  `;

  const data = await runGraphQLQuery(query);

  console.log('\n✅ GraphQL Customers');
  console.log(JSON.stringify(data, null, 2));
}


async function main() {
  console.log('🚀 Fetching via GraphQL (SDK client)...\n');

  await fetchProducts();
  await fetchCustomers();
}

main().catch(console.error);
