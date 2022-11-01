// // Import any of your relevant dependencies
// const stringHash = require("string-hash");

// // Sample helper
// function iAmHelping(str) {
//   return `~~~${str}~~~`;
// }

exports.App = class App {
  // Create a custom named function on the App to be applied to your records
  anonymize(records) {
    // records.forEach((record) => {
    //   // Use record `get` and `set` to read and write to your data
    //   record.set(
    //     "customer_email",
    //     iAmHelping(stringHash(record.get("customer_email")))
    //   );
    // });

    console.log(`Streaming over data to S3 at: ${`${new Date().getHours()}/${new Date().getMinutes()}`}`)

    // Use records `unwrap` transform on CDC formatted records
    // Has no effect on other formats
    // records.unwrap();

    return records;
  }

  async run(turbine) {
    // To configure resources for your production datastores
    // on Meroxa, use the Dashboard, CLI, or Terraform Provider
    // For more details refer to: http://docs.meroxa.com/

    // Identify the upstream datastore with the `resources` function
    // Replace `source_name` with the resource name configured on Meroxa
    let source = await turbine.resources("meroxa_upsolver_pg");

    // Specify which `source` records to pull with the `records` function
    // Replace `collection_name` with whatever data organisation method
    // is relevant to the datastore (e.g., table, bucket, collection, etc.)
    // If additional connector configs are needed, provided another argument i.e.
    // {"incrementing.field.name": "id"}
    let records = await source.records("myTable");

    // Specify the code to execute against `records` with the `process` function
    // Replace `Anonymize` with the function. If environment variables are needed
    // by the function, provide another argument i.e. {"MY_SECRET": "deadbeef"}.
    let anonymized = await turbine.process(records, this.anonymize);

    // Identify the upstream datastore with the `resources` function
    // Replace `source_name` with the resource name configured on Meroxa
    let destination = await turbine.resources("meroxa_upsolver_s3");

    // Specify where to write records to your `destination` using the `write` function
    // Replace `collection_archive` with whatever data organisation method
    // is relevant to the datastore (e.g., table, bucket, collection, etc.)
    // If additional connector configs are needed, provided another argument i.e.
    // {"behavior.on.null.values": "ignore"}
    // const today = new Date();
    // const dd = String(today.getDate()).padStart(2, '0');
    // const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // const yyyy = today.getFullYear();

    // const writeToAgainFinal = `${yyyy}/${mm}/${dd}/${today.getHours()}/${today.getMinutes()}`


    await destination.write(anonymized, `new_destination_new`, {
      "output_compression": "none"
    });
  }
};
