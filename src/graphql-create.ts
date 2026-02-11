import { ctpClientHTTPAPI, projectKey } from './BuildClient.js';

async function runGraphQLQuery(query: string) {
  try {
    const response = await ctpClientHTTPAPI.execute({
      uri: `/${projectKey}/graphql`,
      method: 'POST',
      body: { query },
    });

    return response.body;

  } catch (error: any) {
    const graphqlErrors = error?.body?.errors ?? error?.error?.errors;

    if (graphqlErrors && Array.isArray(graphqlErrors)) {
      console.error('\n❌ Actual GraphQL Errors:');
      graphqlErrors.forEach((e: any, i: number) => {
        console.error(`  [${i + 1}] Message   : ${e.message}`);
        console.error(`       Locations : ${JSON.stringify(e.locations)}`);
        console.error(`       Extensions: ${JSON.stringify(e.extensions)}`);
      });
    }

    throw error;
  }
}

async function createCustomer() {
  const uniqueEmail = `dinesh${Date.now()}@example.com`;

  const mutation = `
    mutation {
      customerSignUp(
        draft: {
          email: "${uniqueEmail}"
          password: "Test@1234"
          firstName: "Dinesh"
          lastName: "Kumar"
        }
      ) {
        customer {
          id
          email
          firstName
          lastName
          createdAt
        }
      }
    }
  `;

  const data = await runGraphQLQuery(mutation);
  console.log('\n✅ Customer Created Successfully');
  console.log(JSON.stringify(data, null, 2));
}

async function createProduct() {
  const timestamp = Date.now();

  const mutation = `
    mutation {
      createProduct(
        draft: {
          productType: {
            typeId: "product-type"
            key: "bedding-bundle"
          }
          name: [
            { locale: "en", value: "GraphQL Test Product ${timestamp}" }
          ]
          slug: [
            { locale: "en", value: "graphql-test-product-${timestamp}" }
          ]
          masterVariant: {
            sku: "graphql-sku-${timestamp}"
          }
          publish: true
        }
      ) {
        id
        masterData {
          current {
            name(locale: "en")
            slug(locale: "en")
          }
        }
      }
    }
  `;

  const data = await runGraphQLQuery(mutation);
  console.log('\n✅ Product Created Successfully');
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  console.log(' Creating Customer and Product via GraphQL...\n');
  await createCustomer();
  await createProduct();
  console.log('\n All resources created successfully!');
}

main().catch((error) => {
  console.error('\n Error occurred:', error.message);
});