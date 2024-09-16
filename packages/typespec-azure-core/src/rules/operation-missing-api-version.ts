import { ModelProperty, Operation, createRule } from "@typespec/compiler";

function isApiVersionParam(prop: ModelProperty): boolean {
  return prop.name === "apiVersion" && prop.type.kind === "Scalar" && prop.type.name === "string";
}

export const apiVersionRule = createRule({
  name: "operation-missing-api-version",
  description: "Operations need an api version parameter.",
  severity: "warning",
  messages: {
    default: `Operation is missing an api version parameter.`,
  },
  create(context) {
    return {
      operation: (op: Operation) => {
        if (!op.namespace) return;
        for (const param of op.parameters.properties.values()) {
          if (isApiVersionParam(param)) return;
        }
        context.reportDiagnostic({
          target: op,
        });
      },
    };
  },
});
