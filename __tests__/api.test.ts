import { fetchRecords } from "@/utils/api";
import axiosMockAdapter from "axios-mock-adapter";
import { api } from "../utils/api";

const mock = new axiosMockAdapter(api);

describe("fetchRecords V&A API function", () => {
  afterEach(() => mock.reset());

  it("fetches records successfully", async () => {
    const mockData = {
      records: [
        {
          systemNumber: "23",
          _primaryTitle: "Klint painting",
        },
      ],
    };
    mock.onGet("/search?q=klint&page_size=10").reply(200, mockData);

    const result = await fetchRecords("klint");

    expect(result).toEqual(mockData);
  });
});
