import {
  fetchArtworksMet,
  fetchArtworksVA,
  fetchCombinedArtworks,
  metApi,
  vaApi,
} from "@/api/api";
import axiosMockAdapter from "axios-mock-adapter";
describe("Search Museum API", () => {
  const vaMock = new axiosMockAdapter(vaApi);
  const metMock = new axiosMockAdapter(metApi);

  describe("GET: V&A Museum API functions", () => {
    afterEach(() => {
      vaMock.reset();
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
      vaMock.onGet("/search?q=klint&page_size=10").reply(200, mockData);

      const result = await fetchArtworksVA("klint");

      expect(result).toEqual(mockData);
    });
    it("handles network errors in V&A search with 500 status response and error message", async () => {
      vaMock.onGet("/search?q=klint&page_size=10").reply(500);

      await expect(fetchArtworksVA("klint")).rejects.toThrow(
        "V&A Museum API request failed"
      );
    });
  });
  describe("GET: Met Museum API functions", () => {
    afterEach(() => metMock.reset());

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
      metMock.onGet("/search?q=klint").reply(200, mockSearchData);

      // object endpoint returning object details
      mockObjectData.forEach((object) => {
        metMock.onGet(`/objects/${object.objectID}`).reply(200, object);
      });

      const result = await fetchArtworksMet("klint");

      expect(result).toEqual(mockObjectData);
    });
    it("handles network errors in Met search with 500 status response and error message", async () => {
      metMock.onGet("/search?q=klint").reply(500);

      await expect(fetchArtworksMet("klint")).rejects.toThrow(
        "The Met Museum of Art API request failed"
      );
    });
  });
  describe("GET: combined API functions", () => {
    afterEach(() => {
      vaMock.reset();
      metMock.reset();
    });
    const mockCombinedArtworksArrayData = [
      {
        id: "123",
        title: "Blue Nude",
        artist: "Matisse",
        image: "va-image-url.jpg",
        source: "Victoria and Albert Museum",
      },
      {
        id: "789",
        title: "Vegetables",
        artist: "Matisse",
        image: "met-image-url.jpg",
        source: "The Metropolitan Museum of Art",
      },
    ];
    it("fetches combined artworks as an array  of artwork objects with the specified response structure", async () => {
      vaMock.onGet("/search?q=matisse&page_size=10").reply(200, {
        records: [
          {
            systemNumber: "123",
            _primaryTitle: "Blue Nude",
            _primaryMaker: "Matisse",
            _images: { _primary_thumbnail: "va-image-url.jpg" },
          },
        ],
      });

      metMock.onGet("/search?q=matisse").reply(200, {
        objectIDs: [789],
      });

      metMock.onGet(`/objects/789`).reply(200, {
        objectID: 789,
        title: "Vegetables",
        artistDisplayName: "Matisse",
        primaryImageSmall: "met-image-url.jpg",
      });

      const results = await fetchCombinedArtworks("matisse");
      console.log(results);

      expect(results).toEqual(mockCombinedArtworksArrayData);
    });
  });
});
