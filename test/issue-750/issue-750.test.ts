import { assert } from "https://deno.land/std@0.180.0/testing/asserts.ts";

import * as element from "http://localhost:8080/@lume/element@0.10.1?target=esnext";
import * as variable from "http://localhost:8080/@lume/variable@0.10.1";

Deno.test("issue #750", () => {
  assert(checkKeys(element, variable));
});

// check keys of an object in another object
function checkKeys(a: object, b: object) {
  for (const key in b) {
    if (!(key in a)) {
      console.error(`key ${key} is missing in b`);
      return false;
    }
  }
  return true;
}
