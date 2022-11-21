exports.App = class App {
  anonymize(records) {
    console.log(`Streaming over data to S3 at: ${`${new Date().getHours()}/${new Date().getMinutes()}`}`)
    return records;
  }

  async run(turbine) {
    let source = await turbine.resources("pg_db");

    let records = await source.records("myTable");

    let anonymized = await turbine.process(records, this.anonymize);

    let destination = await turbine.resources("tanveets3");

    await destination.write(anonymized, `myTable_pg`, {
      "file.name.template": "{{topic}}-{{partition}}-{{start_offset}}-{{timestamp:unit=yyyy}}{{timestamp:unit=MM}}{{timestamp:unit=dd}}{{timestamp:unit=HH}}.gz"
    });
  }
};
