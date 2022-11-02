// // Import any of your relevant dependencies
// const stringHash = require("string-hash");

// // Sample helper
// function iAmHelping(str) {
//   return `~~~${str}~~~`;
// }

exports.App = class App {
  anonymize(records) {
    console.log(`Streaming over data to S3 at: ${`${new Date().getHours()}/${new Date().getMinutes()}`}`)
    return records;
  }

  async run(turbine) {
    let source = await turbine.resources("pg_to_s3");

    let records = await source.records("myTable");

    let anonymized = await turbine.process(records, this.anonymize);

    let destination = await turbine.resources("meroxa_upsolver_s3");

    await destination.write(anonymized, `myTable_pg`, {
      "file.name.template": "{{timestamp:unit=yyyy}}/{{timestamp:unit=MM}}/{{timestamp:unit=DD}}/{{timestamp:unit=hh}}/{{timestamp:unit=mm}}/{{topic}}-{{partition:padding=true}}-{{start_offset:padding=true}}.gz"
    });
  }
};
