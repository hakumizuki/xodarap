import {describe, test, expect, jest} from "bun:test";

const mock = jest.fn();

describe("index", () => {
  test("should work", () => {
    mock();
    expect(mock).toHaveBeenCalled();
  });
});