import { fetchArtworksMet, fetchArtworksVA, metApi, vaApi } from "@/api/api";
import axiosMockAdapter from "axios-mock-adapter";

describe("GET: V&A Museum API functions", () => {
  const mock = new axiosMockAdapter(vaApi);

  afterEach(() => {
    mock.reset();
  });

  it("searches V&A artworks successfully with 200 status response", async () => {
    const mockData = {
      records: [
        {
          systemNumber: "23",
          _primaryTitle: "Klint painting",
        },
      ],
    };
    mock.onGet("/search?q=klint&page_size=10").reply(200, mockData);

    const result = await fetchArtworksVA("klint");

    expect(result).toEqual(mockData);
  });
  it("handles network errors in V&A search with 500 status response and error message", async () => {
    mock.onGet("/search?q=klint&page_size=10").reply(500);

    await expect(fetchArtworksVA("klint")).rejects.toThrow(
      "V&A Museum API request failed"
    );
  });
});

describe("GET: Met Museum API functions", () => {
  const mock = new axiosMockAdapter(metApi);
  afterEach(() => mock.reset());

  it("searches Met records successfully with 200 status response", async () => {
    const mockSearchData = {
      objectIDs: [2, 5, 9],
    };

    const mockObjectData = [
      { objectID: 2, title: "Adulthood" },
      { objectID: 5, title: "Childhood" },
      { objectID: 9, title: "Youth" },
    ];
    // search endpoint returning objectIDs
    mock.onGet("/search?q=klint").reply(200, mockSearchData);

    // object endpoint returning object details
    mockObjectData.forEach((object) => {
      mock.onGet(`/objects/${object.objectID}`).reply(200, object);
    });

    const result = await fetchArtworksMet("klint");

    expect(result).toEqual(mockObjectData);
  });
  it("handles network errors in Met search with 500 status response and error message", async () => {
    mock.onGet("/search?q=klint").reply(500);

    await expect(fetchArtworksMet("klint")).rejects.toThrow(
      "The Met Museum of Art API request failed"
    );
  });
});
