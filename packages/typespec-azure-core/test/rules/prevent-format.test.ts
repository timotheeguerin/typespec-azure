import {
  BasicTestRunner,
  LinterRuleTester,
  createLinterRuleTester,
} from "@typespec/compiler/testing";
import { preventFormatUse } from "../../src/rules/prevent-format.js";
import { createAzureCoreTestRunner } from "../test-host.js";

describe("typespec-azure-core: no-format rule", () => {
  let runner: BasicTestRunner;
  let tester: LinterRuleTester;

  beforeEach(async () => {
    runner = await createAzureCoreTestRunner({ omitServiceNamespace: true });
    tester = createLinterRuleTester(runner, preventFormatUse, "@azure-tools/typespec-azure-core");
  });

  it("emits a warning diagnostic for string properties that use `@format`", async () => {
    await tester
      .expect(
        `
        namespace Azure.Widget;

        model Widget {
          @format("abc123")
          name: string;
        }
        `
      )
      .toEmitDiagnostics([
        {
          code: "@azure-tools/typespec-azure-core/no-format",
          message: "Azure services should not use the `@format` decorator.",
        },
      ]);
  });

  it("emits a warning diagnostic for string models that use `@format`", async () => {
    await tester
      .expect(
        `
        namespace Azure.Widget;

        @format("abc123")
        scalar CoolString extends string;
        `
      )
      .toEmitDiagnostics([
        {
          code: "@azure-tools/typespec-azure-core/no-format",
          message: "Azure services should not use the `@format` decorator.",
        },
      ]);
  });
});
